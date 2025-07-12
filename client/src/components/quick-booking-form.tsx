import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Phone, Mail, Scissors } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QuickBookingFormProps {
  onSuccess?: () => void;
}

export default function QuickBookingForm({ onSuccess }: QuickBookingFormProps) {
  const [formData, setFormData] = useState({
    serviceName: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: ""
  });

  const queryClient = useQueryClient();

  // Fetch services for selection
  const { data: services = [] } = useQuery<any[]>({
    queryKey: ["/api/services"],
  });

  // Fetch business data to get the slug
  const { data: business } = useQuery<any>({
    queryKey: ["/api/businesses/me"],
  });

  // Create booking mutation
  const createBooking = useMutation({
    mutationFn: async (bookingData: any) => {
      console.log('Quick booking data being sent:', bookingData);
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Quick booking error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Created",
        description: `Appointment scheduled for ${formData.clientName}`,
      });
      
      // Reset form
      setFormData({
        serviceName: "",
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        appointmentDate: "",
        appointmentTime: "",
        notes: ""
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
      console.error('Booking creation error:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.serviceName || !formData.clientName || !formData.clientPhone || 
        !formData.appointmentDate || !formData.appointmentTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Find selected service
    const selectedService = services.find((s: any) => s.name === formData.serviceName);
    if (!selectedService) {
      toast({
        title: "Invalid Service",
        description: "Please select a valid service.",
        variant: "destructive",
      });
      return;
    }

    // Split client name into first and last name
    const nameParts = formData.clientName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Validate business data is available
    if (!business?.slug) {
      toast({
        title: "Error",
        description: "Business information not available. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Create booking data to match server API format
    const bookingData = {
      businessSlug: business.slug,
      serviceId: selectedService.id,
      clientData: {
        firstName,
        lastName,
        phone: formData.clientPhone,
        email: formData.clientEmail || undefined
      },
      appointmentDate: `${formData.appointmentDate}T${formData.appointmentTime}:00`,
      notes: formData.notes || undefined
    };

    createBooking.mutate(bookingData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-tim-green" />
          Quick Booking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label htmlFor="service">Service *</Label>
            <Select value={formData.serviceName} onValueChange={(value) => handleInputChange('serviceName', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service: any) => (
                  <SelectItem key={service.id} value={service.name}>
                    <div className="flex items-center gap-2">
                      <Scissors className="h-4 w-4" />
                      <span>{service.name} - ${service.price}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Client Information */}
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="clientName"
                placeholder="Enter client name"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientPhone">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="clientPhone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.clientPhone}
                onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email (Optional)</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="clientEmail"
                type="email"
                placeholder="Enter email address"
                value={formData.clientEmail}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Date *</Label>
              <Input
                id="appointmentDate"
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentTime">Time *</Label>
              <Select value={formData.appointmentTime} onValueChange={(value) => handleInputChange('appointmentTime', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requests or notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-tim-green hover:bg-green-600" 
            disabled={createBooking.isPending}
          >
            {createBooking.isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                Creating Booking...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Create Booking
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}