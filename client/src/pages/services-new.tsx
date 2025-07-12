import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertServiceSchema, type Service } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { 
  Plus,
  Edit,
  Trash,
  Scissors,
  DollarSign,
  Clock,
  Upload,
  X,
  Camera
} from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const serviceFormSchema = insertServiceSchema.omit({ businessId: true });
type ServiceFormData = z.infer<typeof serviceFormSchema>;

export default function Services() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      duration: 60,
      imageUrl: "",
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      // Convert price to decimal format for the database
      const processedData = {
        ...data,
        price: parseFloat(data.price).toFixed(2),
      };
      return apiRequest("POST", "/api/services", processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setShowAddService(false);
      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
      toast({
        title: "Service created",
        description: "Your service has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create service",
        variant: "destructive",
      });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      if (!editingService) throw new Error("No service selected");
      // Convert price to decimal format for the database
      const processedData = {
        ...data,
        price: parseFloat(data.price).toFixed(2),
      };
      return apiRequest("PATCH", `/api/services/${editingService.id}`, processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setEditingService(null);
      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
      toast({
        title: "Service updated",
        description: "Your service has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: number) => {
      return apiRequest("DELETE", `/api/services/${serviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Service deleted",
        description: "Your service has been removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setImageUploading(true);

    try {
      // Create preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Upload to Cloudflare
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Set the Cloudflare URL
      setSelectedImage(result.url);
      form.setValue("imageUrl", result.url);
      
      // Replace preview with actual Cloudflare URL
      URL.revokeObjectURL(previewUrl);
      setImagePreview(result.url);

      toast({
        title: "Image uploaded",
        description: "Your service image has been uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      
      // Reset on error
      setImagePreview(null);
      setSelectedImage(null);
      form.setValue("imageUrl", "");
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    form.setValue("imageUrl", "");
  };

  const onSubmit = (data: ServiceFormData) => {
    if (editingService) {
      updateServiceMutation.mutate(data);
    } else {
      createServiceMutation.mutate(data);
    }
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    form.reset({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      duration: service.duration,
      imageUrl: service.imageUrl || "",
    });
    if (service.imageUrl) {
      setImagePreview(service.imageUrl);
      setSelectedImage(service.imageUrl);
    }
  };

  const closeDialog = () => {
    setShowAddService(false);
    setEditingService(null);
    form.reset();
    setSelectedImage(null);
    setImagePreview(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tim-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-6">
        {/* Page Header */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-tim-green to-green-600 rounded-full flex items-center justify-center">
                  <Scissors className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                Service Management
              </h1>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Manage your services, pricing, and availability</p>
            </div>
            <Button 
              onClick={() => setShowAddService(true)}
              className="bg-tim-green hover:bg-green-600 h-9 md:h-10"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Service</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {services && Array.isArray(services) && services.length > 0 ? (
            services.map((service: Service) => (
              <Card key={service.id} className="shadow-sm hover:shadow-md transition-shadow mobile-card">
                <CardContent className="p-4 md:p-6">
                  {service.imageUrl && (
                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={service.imageUrl} 
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base md:text-lg">{service.name}</h3>
                    <div className="flex gap-1 md:gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(service)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteServiceMutation.mutate(service.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {service.description && (
                    <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-tim-green" />
                      <span className="font-semibold text-tim-green">${service.price}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-3 w-3 md:h-4 md:w-4" />
                      <span>{service.duration} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <CardContent>
                  <Scissors className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No services yet</h3>
                  <p className="text-gray-500 mb-4">Add your first service to get started</p>
                  <Button 
                    onClick={() => setShowAddService(true)}
                    className="bg-tim-green hover:bg-green-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Service
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Service Dialog */}
      <Dialog open={showAddService || !!editingService} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-tim-green" />
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Service Photo</label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                    imageUploading 
                      ? "border-tim-green bg-tim-green/5 cursor-not-allowed" 
                      : "border-gray-300 cursor-pointer hover:border-tim-green"
                  }`}
                  onClick={() => !imageUploading && document.getElementById('photo-upload')?.click()}
                >
                  {imageUploading ? (
                    <div className="py-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tim-green mx-auto mb-2"></div>
                      <p className="text-sm font-medium text-tim-green">Uploading to Cloudflare...</p>
                      <p className="text-xs text-gray-500">Please wait</p>
                    </div>
                  ) : imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-6">
                      <Camera className="h-8 w-8 text-tim-green mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">Upload to Cloudflare</p>
                      <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                    </div>
                  )}
                  
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Men's Haircut, Facial Treatment"
                        className="mobile-padding"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your service..."
                        className="min-h-[80px] mobile-padding resize-none"
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="text"
                          placeholder="50"
                          className="mobile-padding"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (min)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="60"
                          className="mobile-padding"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-tim-green hover:bg-green-600"
                  disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
                >
                  {createServiceMutation.isPending || updateServiceMutation.isPending ? (
                    "Saving..."
                  ) : editingService ? (
                    "Update Service"
                  ) : (
                    "Add Service"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}