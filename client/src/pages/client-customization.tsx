import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Palette,
  Layout,
  Eye,
  Settings,
  Bell,
  Smartphone,
  Monitor,
  Save,
  RotateCcw,
  Paintbrush,
  MessageSquare,
  Star,
  Calendar,
  User,
  CreditCard,
  Gift,
  Mail,
  Phone,
  Clock,
  MapPin,
  LogOut,
  Edit,
  Heart,
  History,
  Plus,
  Upload,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import Navigation from "@/components/navigation";
import ClientDashboard from "@/pages/client-dashboard";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Preview Component for Real-time Client Dashboard Preview
function ClientDashboardPreview({ formData }: { formData: any }) {
  const customStyles = formData ? {
    '--primary-color': formData.primaryColor,
    '--secondary-color': formData.secondaryColor,
    '--accent-color': formData.accentColor,
    '--background-color': formData.backgroundColor,
    '--text-color': formData.textColor,
  } as React.CSSProperties : {};

  return (
    <div className="sticky top-6">
      <Card className="shadow-xl border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Preview
          </CardTitle>
          <p className="text-sm text-gray-600">This is how your clients will see their dashboard</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-0 max-h-[600px] overflow-y-auto">
            {/* Real Client Dashboard Preview */}
            <div className="transform scale-75 origin-top-left w-[133%] h-[133%] overflow-hidden">
              <ClientDashboard businessSlug="sahil-ansari" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ClientCustomizationPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const { data: customization, isLoading } = useQuery({
    queryKey: ["/api/client-customization"],
  });

  const [formData, setFormData] = useState<any>(customization || {});
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Update form data when customization loads
  React.useEffect(() => {
    if (customization) {
      console.log("Updating formData with customization:", customization);
      setFormData(customization);
    }
  }, [customization]);

  // Debug: Log current formData state
  React.useEffect(() => {
    console.log("Current formData state:", formData);
  }, [formData]);

  const saveCustomization = useMutation({
    mutationFn: async (data: any) => {
      console.log("Saving customization data:", data);
      return apiRequest("POST", "/api/client-customization", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/client-customization"] });
      toast({
        title: "Settings saved!",
        description: "Your client dashboard customization has been updated.",
      });
    },
    onError: (error: any) => {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: `Failed to save customization settings: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  // Image upload mutations
  const uploadImage = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: 'logo' | 'banner' }) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      const { type } = variables;
      const { url } = data;
      
      if (type === 'logo') {
        setFormData((prev: any) => ({ ...prev, logoUrl: url }));
        setUploadingLogo(false);
      } else {
        setFormData((prev: any) => ({ ...prev, bannerUrl: url }));
        setUploadingBanner(false);
      }

      toast({
        title: "Image uploaded!",
        description: `${type === 'logo' ? 'Logo' : 'Banner'} image has been uploaded successfully.`,
      });
    },
    onError: (error: any) => {
      setUploadingLogo(false);
      setUploadingBanner(false);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    },
  });



  const handleSave = () => {
    saveCustomization.mutate(formData);
  };

  const handleReset = () => {
    const defaultSettings = {
      primaryColor: "#10b981",
      secondaryColor: "#1e40af",
      accentColor: "#f59e0b",
      backgroundColor: "#ffffff",
      textColor: "#111827",
      layoutStyle: "modern",
      showServices: true,
      showBookingHistory: true,
      showUpcomingBookings: true,
      showReviewsSection: true,
      showProfileSection: true,
      showNotifications: true,
      enableOnlineBooking: true,
      enableCancelBooking: true,
      enableRescheduleBooking: true,
      enablePaymentHistory: false,
      enableLoyaltyProgram: false,
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      welcomeMessage: "",
      footerText: "",
      businessDescription: "",
    };
    setFormData(defaultSettings);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (type: 'logo' | 'banner') => {
    if (type === 'logo') {
      logoInputRef.current?.click();
    } else {
      bannerInputRef.current?.click();
    }
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (type === 'logo') {
        setUploadingLogo(true);
      } else {
        setUploadingBanner(true);
      }

      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Update form data with the new image URL
      const updatedFormData = {
        ...formData,
        [type === 'logo' ? 'logoUrl' : 'bannerUrl']: result.url,
      };
      
      setFormData(updatedFormData);

      // Automatically save the customization with the new image
      try {
        const savedData = await apiRequest("POST", "/api/client-customization", updatedFormData);
        
        // Merge the saved data with current form data to preserve all fields
        setFormData((prev: any) => ({
          ...prev,
          ...savedData,
          // Ensure image URLs are preserved
          logoUrl: savedData.logoUrl || prev.logoUrl,
          bannerUrl: savedData.bannerUrl || prev.bannerUrl
        }));
        
        // Invalidate the cache to refetch the latest data
        queryClient.invalidateQueries({ queryKey: ["/api/client-customization"] });
        
        toast({
          title: "Image uploaded successfully",
          description: `Your ${type} has been uploaded and saved.`,
        });
      } catch (error) {
        console.error('Error saving customization:', error);
        // Keep the updated form data even if save failed since image was uploaded
        toast({
          title: "Image uploaded but save failed",
          description: "The image was uploaded but couldn't be saved. Please click Save Changes.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (type === 'logo') {
        setUploadingLogo(false);
      } else {
        setUploadingBanner(false);
      }
    }
  };

  const handleImageRemove = (type: 'logo' | 'banner') => {
    setFormData((prev: any) => ({
      ...prev,
      [type === 'logo' ? 'logoUrl' : 'bannerUrl']: null,
    }));
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16 md:pb-0">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tim-green"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Customization Form - Left Column */}
          <div className="xl:col-span-2">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-tim-green to-green-600 rounded-xl flex items-center justify-center">
                      <Palette className="h-6 w-6 text-white" />
                    </div>
                    Client Dashboard Customization
                  </h1>
                  <p className="text-gray-600 mt-2">Customize how your clients experience their dashboard and booking interface</p>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={saveCustomization.isPending}
                    className="bg-tim-green hover:bg-green-600"
                  >
                    {saveCustomization.isPending ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Preview Badge */}
              <div className="flex items-center gap-2 mb-6">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Eye className="h-3 w-3 mr-1" />
                  Live Preview Updates Automatically
                </Badge>
                <Badge variant="outline">
                  Changes apply to all client dashboards instantly
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="branding" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="branding" className="flex items-center gap-2">
                  <Paintbrush className="h-4 w-4" />
                  Branding
                </TabsTrigger>
                <TabsTrigger value="layout" className="flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Layout
                </TabsTrigger>
                <TabsTrigger value="features" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Features
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
              </TabsList>

              {/* Branding Tab */}
              <TabsContent value="branding" className="space-y-6">
                {/* Image Upload Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo Upload */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Business Logo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-xs text-gray-500 mb-2">Debug: logoUrl = {formData?.logoUrl || 'undefined'}</div>
                      {formData?.logoUrl ? (
                        <div className="relative">
                          <img
                            src={formData.logoUrl}
                            alt="Business Logo"
                            className="w-full h-32 object-contain bg-gray-50 rounded-lg border"
                            onLoad={() => console.log("Logo loaded successfully", formData.logoUrl)}
                            onError={(e) => console.log("Logo failed to load:", formData.logoUrl, e)}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleImageRemove('logo')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                          onClick={() => handleImageUpload('logo')}
                        >
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload logo</p>
                          <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageSelect(e, 'logo')}
                      />
                      {uploadingLogo && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                          Uploading logo...
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Banner Upload */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Banner Image
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-xs text-gray-500 mb-2">Debug: bannerUrl = {formData?.bannerUrl || 'undefined'}</div>
                      {formData?.bannerUrl ? (
                        <div className="relative">
                          <img
                            src={formData.bannerUrl}
                            alt="Banner"
                            className="w-full h-32 object-cover bg-gray-50 rounded-lg border"
                            onLoad={() => console.log("Banner loaded successfully", formData.bannerUrl)}
                            onError={(e) => console.log("Banner failed to load:", formData.bannerUrl, e)}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleImageRemove('banner')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                          onClick={() => handleImageUpload('banner')}
                        >
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload banner</p>
                          <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                      <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageSelect(e, 'banner')}
                      />
                      {uploadingBanner && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                          Uploading banner...
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Brand Colors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex items-center gap-3">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={formData.primaryColor || "#10b981"}
                            onChange={(e) => updateField("primaryColor", e.target.value)}
                            className="w-16 h-10 p-1 rounded-md"
                          />
                          <Input
                            value={formData.primaryColor || "#10b981"}
                            onChange={(e) => updateField("primaryColor", e.target.value)}
                            placeholder="#10b981"
                            className="flex-1"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Main brand color for buttons and highlights</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex items-center gap-3">
                          <Input
                            id="secondaryColor"
                            type="color"
                            value={formData.secondaryColor || "#1e40af"}
                            onChange={(e) => updateField("secondaryColor", e.target.value)}
                            className="w-16 h-10 p-1 rounded-md"
                          />
                          <Input
                            value={formData.secondaryColor || "#1e40af"}
                            onChange={(e) => updateField("secondaryColor", e.target.value)}
                            placeholder="#1e40af"
                            className="flex-1"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Secondary brand color for accents</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accentColor">Accent Color</Label>
                        <div className="flex items-center gap-3">
                          <Input
                            id="accentColor"
                            type="color"
                            value={formData.accentColor || "#f59e0b"}
                            onChange={(e) => updateField("accentColor", e.target.value)}
                            className="w-16 h-10 p-1 rounded-md"
                          />
                          <Input
                            value={formData.accentColor || "#f59e0b"}
                            onChange={(e) => updateField("accentColor", e.target.value)}
                            placeholder="#f59e0b"
                            className="flex-1"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Accent color for notifications and highlights</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <div className="flex items-center gap-3">
                          <Input
                            id="backgroundColor"
                            type="color"
                            value={formData.backgroundColor || "#ffffff"}
                            onChange={(e) => updateField("backgroundColor", e.target.value)}
                            className="w-16 h-10 p-1 rounded-md"
                          />
                          <Input
                            value={formData.backgroundColor || "#ffffff"}
                            onChange={(e) => updateField("backgroundColor", e.target.value)}
                            placeholder="#ffffff"
                            className="flex-1"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Main background color for the dashboard</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="textColor">Text Color</Label>
                        <div className="flex items-center gap-3">
                          <Input
                            id="textColor"
                            type="color"
                            value={formData.textColor || "#111827"}
                            onChange={(e) => updateField("textColor", e.target.value)}
                            className="w-16 h-10 p-1 rounded-md"
                          />
                          <Input
                            value={formData.textColor || "#111827"}
                            onChange={(e) => updateField("textColor", e.target.value)}
                            placeholder="#111827"
                            className="flex-1"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Primary text color throughout the dashboard</p>
                      </div>
                    </div>

                    {/* Color Preview */}
                    <div className="mt-6 p-4 rounded-lg border bg-gray-50">
                      <h4 className="font-medium mb-3">Color Preview</h4>
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-8 h-8 rounded-full shadow-sm border"
                          style={{ backgroundColor: formData.primaryColor }}
                          title="Primary Color"
                        ></div>
                        <div 
                          className="w-8 h-8 rounded-full shadow-sm border"
                          style={{ backgroundColor: formData.secondaryColor }}
                          title="Secondary Color"
                        ></div>
                        <div 
                          className="w-8 h-8 rounded-full shadow-sm border"
                          style={{ backgroundColor: formData.accentColor }}
                          title="Accent Color"
                        ></div>
                        <div 
                          className="w-16 h-8 rounded shadow-sm border flex items-center justify-center text-xs"
                          style={{ 
                            backgroundColor: formData.backgroundColor,
                            color: formData.textColor
                          }}
                        >
                          Sample
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Layout Tab */}
              <TabsContent value="layout" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="h-5 w-5" />
                      Dashboard Layout
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Layout Style</Label>
                      <Select
                        value={formData.layoutStyle || "modern"}
                        onValueChange={(value) => updateField("layoutStyle", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select layout style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Modern - Clean cards with shadows</SelectItem>
                          <SelectItem value="minimal">Minimal - Simple borders and spacing</SelectItem>
                          <SelectItem value="classic">Classic - Traditional layout with dividers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Dashboard Sections</h4>
                      <p className="text-sm text-gray-600">Choose which sections to display on the client dashboard</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Star className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="font-medium">Services Section</p>
                              <p className="text-xs text-gray-500">Show available services</p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.showServices ?? true}
                            onCheckedChange={(checked) => updateField("showServices", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="font-medium">Booking History</p>
                              <p className="text-xs text-gray-500">Past appointments</p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.showBookingHistory ?? true}
                            onCheckedChange={(checked) => updateField("showBookingHistory", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="font-medium">Upcoming Bookings</p>
                              <p className="text-xs text-gray-500">Future appointments</p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.showUpcomingBookings ?? true}
                            onCheckedChange={(checked) => updateField("showUpcomingBookings", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Star className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="font-medium">Reviews Section</p>
                              <p className="text-xs text-gray-500">Leave and view reviews</p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.showReviewsSection ?? true}
                            onCheckedChange={(checked) => updateField("showReviewsSection", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="font-medium">Profile Section</p>
                              <p className="text-xs text-gray-500">Client profile management</p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.showProfileSection ?? true}
                            onCheckedChange={(checked) => updateField("showProfileSection", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Bell className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="font-medium">Notifications</p>
                              <p className="text-xs text-gray-500">System notifications</p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.showNotifications ?? true}
                            onCheckedChange={(checked) => updateField("showNotifications", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Client Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Booking Features</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="font-medium">Online Booking</p>
                              <p className="text-xs text-gray-500">Allow clients to book online</p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.enableOnlineBooking ?? true}
                            onCheckedChange={(checked) => updateField("enableOnlineBooking", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="font-medium">Cancel Bookings</p>
                              <p className="text-xs text-gray-500">Allow booking cancellation</p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.enableCancelBooking ?? true}
                            onCheckedChange={(checked) => updateField("enableCancelBooking", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="font-medium">Reschedule Bookings</p>
                              <p className="text-xs text-gray-500">Allow booking rescheduling</p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.enableRescheduleBooking ?? true}
                            onCheckedChange={(checked) => updateField("enableRescheduleBooking", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="font-medium">Payment History</p>
                              <p className="text-xs text-gray-500">Show payment records</p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.enablePaymentHistory ?? false}
                            onCheckedChange={(checked) => updateField("enablePaymentHistory", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Gift className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="font-medium">Loyalty Program</p>
                              <p className="text-xs text-gray-500">Enable loyalty rewards</p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.enableLoyaltyProgram ?? false}
                            onCheckedChange={(checked) => updateField("enableLoyaltyProgram", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Custom Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="welcomeMessage">Welcome Message</Label>
                      <Textarea
                        id="welcomeMessage"
                        placeholder="Welcome to our client portal! We're excited to serve you."
                        value={formData.welcomeMessage || ""}
                        onChange={(e) => updateField("welcomeMessage", e.target.value)}
                        rows={3}
                      />
                      <p className="text-xs text-gray-500">Personalized welcome message shown to clients</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessDescription">Business Description</Label>
                      <Textarea
                        id="businessDescription"
                        placeholder="Brief description of your business and services..."
                        value={formData.businessDescription || ""}
                        onChange={(e) => updateField("businessDescription", e.target.value)}
                        rows={3}
                      />
                      <p className="text-xs text-gray-500">Description shown on the client dashboard</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="footerText">Footer Text</Label>
                      <Input
                        id="footerText"
                        placeholder="© 2025 Your Business Name. All rights reserved."
                        value={formData.footerText || ""}
                        onChange={(e) => updateField("footerText", e.target.value)}
                      />
                      <p className="text-xs text-gray-500">Footer text displayed at the bottom</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Default Notification Preferences</h4>
                      <p className="text-sm text-gray-600">Set default notification preferences for new clients</p>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="font-medium">Email Notifications</p>
                              <p className="text-xs text-gray-500">Booking confirmations, reminders, updates</p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.emailNotifications ?? true}
                            onCheckedChange={(checked) => updateField("emailNotifications", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="font-medium">SMS Notifications</p>
                              <p className="text-xs text-gray-500">Text message reminders and updates</p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.smsNotifications ?? true}
                            onCheckedChange={(checked) => updateField("smsNotifications", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Bell className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="font-medium">Push Notifications</p>
                              <p className="text-xs text-gray-500">Browser notifications for real-time updates</p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.pushNotifications ?? true}
                            onCheckedChange={(checked) => updateField("pushNotifications", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Live Preview - Right Column */}
          <div className="xl:col-span-1">
            <ClientDashboardPreview formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}