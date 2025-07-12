import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClientSchema, type Service, type Business } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  Star, 
  MapPin,
  Phone,
  Mail,
  CalendarPlus,
  Check,
  ChevronRight,
  Calendar,
  Scissors,
  Heart,
  Smartphone
} from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";


// Simplified form schema for booking
const bookingFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface BookingSubmissionData {
  serviceId: number;
  appointmentDate: string;
  notes?: string;
  clientData: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };
}

export default function BookingPage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const { data: business } = useQuery<Business>({
    queryKey: [`/api/businesses/${slug}`],
    enabled: !!slug,
  });

  const { data: services } = useQuery<Service[]>({
    queryKey: [`/api/businesses/${slug}/services`],
    enabled: !!slug,
  });

  const { data: reviews } = useQuery<any[]>({
    queryKey: [`/api/businesses/${slug}/reviews`],
    enabled: !!slug,
  });

  // Get client customization for this business
  const { data: customization } = useQuery<any>({
    queryKey: [`/api/businesses/${slug}/client-customization`],
    enabled: !!slug,
  });

  // Fetch existing bookings for the selected date to check availability
  const { data: existingBookings } = useQuery<any[]>({
    queryKey: [`/api/businesses/${business?.id}/bookings/${selectedDate}`],
    enabled: !!business?.id && !!selectedDate,
  });

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/bookings", data);
      return await response.json();
    },
    onSuccess: (booking) => {
      // Store booking details including the current selections before resetting
      setBookingDetails({
        ...booking,
        selectedService: selectedService,
        selectedDate: selectedDate,
        selectedTime: selectedTime
      });
      setShowConfirmation(true);
      
      // Reset form after storing details
      form.reset();
      setSelectedService(null);
      setSelectedDate("");
      setSelectedTime("");
      
      toast({
        title: "Booking confirmed!",
        description: "Your appointment has been successfully booked.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    if (!selectedService) return;
    
    // Split name into firstName and lastName
    const nameParts = data.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Convert 12-hour time to 24-hour format
    const [timePart, period] = selectedTime.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    let hour24 = hours;
    
    if (period === 'PM' && hours !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }
    
    // Create the appointment date in EST timezone by building the date string directly
    // This preserves the exact time the user selected without timezone conversion
    const appointmentDateString = `${selectedDate}T${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    
    console.log('Booking Debug:', {
      selectedTime,
      selectedDate,
      hour24,
      minutes,
      appointmentDateString
    });
    
    const bookingData = {
      businessSlug: slug,
      serviceId: selectedService.id,
      appointmentDate: appointmentDateString,
      clientData: {
        firstName,
        lastName,
        phone: data.phone,
        email: data.email || undefined,
      },
      notes: undefined,
    };
    
    bookingMutation.mutate(bookingData);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Generate available dates (next 30 days, excluding Sundays)
  // Helper function to format date in EST timezone
  const formatDateString = (date: Date) => {
    return date.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }); // YYYY-MM-DD in EST
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (0)
      if (date.getDay() !== 0) {
        dates.push(date);
      }
    }
    
    return dates;
  };



  // Generate time slots in 12-hour format
  const getTimeSlots = () => {
    const times = [
      "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
      "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
      "4:00 PM", "4:30 PM", "5:00 PM"
    ];
    
    return times;
  };



  const availableDates = getAvailableDates();
  const timeSlots = getTimeSlots();

  // Check if a time slot is booked
  const isTimeSlotBooked = (time: string) => {
    if (!existingBookings || !Array.isArray(existingBookings)) {
      return false;
    }
    
    return existingBookings.some((booking: any) => {
      // Convert 12-hour time to 24-hour for comparison
      const [timePart, period] = time.split(' ');
      const [hours, minutes] = timePart.split(':').map(Number);
      let hour24 = hours;
      
      if (period === 'PM' && hours !== 12) {
        hour24 += 12;
      } else if (period === 'AM' && hours === 12) {
        hour24 = 0;
      }
      
      // Parse the booking date - it's already in ISO format from the API
      const bookingDate = new Date(booking.appointmentDate);
      
      // Compare date and time components using EST timezone
      const bookingDateStr = formatDateString(bookingDate);
      const bookingHour = parseInt(bookingDate.toLocaleString('en-US', { 
        hour: '2-digit', 
        hour12: false, 
        timeZone: 'America/New_York' 
      }));
      const bookingMinute = parseInt(bookingDate.toLocaleString('en-US', { 
        minute: '2-digit', 
        timeZone: 'America/New_York' 
      }));
      
      return bookingDateStr === selectedDate && 
             bookingHour === hour24 && 
             bookingMinute === minutes;
    });
  };

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Business not found</h1>
          <p className="text-muted-foreground">The booking page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const averageRating = reviews && Array.isArray(reviews) && reviews.length > 0 
    ? (reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  // Apply custom styles based on customization
  const customStyles = customization ? {
    '--primary-color': customization.primaryColor || '#10b981',
    '--secondary-color': customization.secondaryColor || '#1e40af',
    '--accent-color': customization.accentColor || '#f59e0b',
    '--background-color': customization.backgroundColor || '#ffffff',
    '--text-color': customization.textColor || '#111827',
  } as React.CSSProperties : {};

  const primaryColor = customization?.primaryColor || '#10b981';
  const secondaryColor = customization?.secondaryColor || '#1e40af';
  const accentColor = customization?.accentColor || '#f59e0b';
  const backgroundColor = customization?.backgroundColor || '#ffffff';
  const textColor = customization?.textColor || '#111827';

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(to bottom right, ${backgroundColor}, ${backgroundColor}f0, ${primaryColor}10)`,
        color: textColor,
        ...customStyles 
      }}
    >
      {/* Modern Hero Section */}
      <div className="relative overflow-hidden">
        {/* Banner Image */}
        {customization?.bannerUrl && (
          <div className="absolute inset-0">
            <img
              src={customization.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        )}
        
        {/* Background gradient (only if no banner) */}
        {!customization?.bannerUrl && (
          <>
            <div 
              className="absolute inset-0"
              style={{ 
                background: `linear-gradient(to bottom right, ${primaryColor}, ${primaryColor}e6, ${secondaryColor})` 
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </>
        )}
        
        {/* Tim Grow brand header */}
        <div className="relative z-10 pt-6 pb-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                <span className="text-white">Tim</span>
                <span className="text-white">Grow</span>
                <span className="text-red-300">.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Profile Section */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center text-white">
              {/* Business Avatar */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-white/20 shadow-2xl">
                    <AvatarImage 
                      src={customization?.logoUrl || ""} 
                      alt={customization?.businessName || business?.name || ""} 
                    />
                    <AvatarFallback className="text-2xl font-bold bg-white/10 text-white backdrop-blur">
                      {(customization?.businessName || business?.name)?.charAt(0).toUpperCase() || "B"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-tim-amber p-1 rounded-full">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Business Name */}
              <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                {customization?.businessName || business?.name || "Business"}
              </h1>
              
              {/* Business Type */}
              <p className="text-lg text-white/80 mb-4 font-medium">
                {business?.businessType || "Service Business"}
              </p>

              {/* Welcome Message */}
              {customization?.welcomeMessage && (
                <div 
                  className="mt-6 p-4 rounded-lg backdrop-blur-sm border border-white/20"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <p className="text-white/90 text-center">{customization.welcomeMessage}</p>
                </div>
              )}

              {/* Reviews & Location */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-tim-amber text-tim-amber" />
                    ))}
                  </div>
                  <span className="font-semibold">{averageRating}</span>
                  <span>({Array.isArray(reviews) ? reviews.length : 0} reviews)</span>
                </div>
                
                {business?.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{business.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Booking Content */}
      <div className="relative -mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Booking Flow */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Step 1: Services Selection */}
              <div 
                className="rounded-2xl shadow-xl border overflow-hidden"
                style={{ 
                  backgroundColor: backgroundColor,
                  borderColor: `${primaryColor}20`
                }}
              >
                <div 
                  className="px-8 py-6 border-b"
                  style={{ 
                    background: `linear-gradient(to right, ${primaryColor}08, ${secondaryColor}08)`,
                    borderColor: `${primaryColor}20`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex items-center justify-center w-8 h-8 text-white rounded-full text-sm font-bold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      1
                    </div>
                    <h2 className="text-2xl font-bold" style={{ color: textColor }}>Choose Your Service</h2>
                  </div>
                  <p className="text-gray-600 mt-2">Select the service you'd like to book</p>
                </div>
                
                <div className="p-8">
                  {services && Array.isArray(services) && services.length > 0 ? (
                    <div className="grid gap-4">
                      {services.map((service: Service) => (
                        <div 
                          key={service.id}
                          className="relative group rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden"
                          style={{
                            backgroundColor: backgroundColor,
                            borderColor: selectedService?.id === service.id ? primaryColor : '#e5e7eb',
                            boxShadow: selectedService?.id === service.id 
                              ? `0 25px 50px -12px ${primaryColor}20, 0 0 0 2px ${primaryColor}20` 
                              : 'none'
                          }}
                          onClick={() => handleServiceSelect(service)}
                        >
                          <div className="flex">
                            {/* Service Image */}
                            <div 
                              className="w-32 h-24 flex-shrink-0 relative overflow-hidden rounded-lg border"
                              style={{ 
                                background: `linear-gradient(to bottom right, ${primaryColor}08, ${secondaryColor}08)`,
                                borderColor: `${primaryColor}20`
                              }}
                            >
                              {service.imageUrl ? (
                                <img 
                                  src={service.imageUrl} 
                                  alt={service.name}
                                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                />
                              ) : (
                                <div 
                                  className="w-full h-full flex items-center justify-center"
                                  style={{ background: `linear-gradient(to bottom right, ${primaryColor}10, ${primaryColor}20)` }}
                                >
                                  <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-sm">
                                    <Scissors className="h-6 w-6" style={{ color: primaryColor }} />
                                  </div>
                                </div>
                              )}
                              {selectedService?.id === service.id && (
                                <div 
                                  className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
                                  style={{ backgroundColor: `${primaryColor}30` }}
                                >
                                  <div className="bg-white rounded-full p-2 shadow-lg">
                                    <Check className="h-5 w-5" style={{ color: primaryColor }} />
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Service Content */}
                            <div className="flex-1 p-5">
                              <div className="flex justify-between items-start h-full">
                                <div className="flex-1 flex flex-col justify-between">
                                  <div>
                                    <h3 className="text-xl font-bold mb-2 leading-tight" style={{ color: textColor }}>{service.name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                                      {service.description || "Professional service tailored to your needs"}
                                    </p>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div 
                                      className="flex items-center gap-2 text-sm px-2 py-1 rounded-full"
                                      style={{ 
                                        backgroundColor: `${primaryColor}10`,
                                        color: primaryColor
                                      }}
                                    >
                                      <Clock className="h-3 w-3" />
                                      <span>{service.duration} min</span>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-2xl font-bold" style={{ color: primaryColor }}>${parseFloat(service.price).toFixed(0)}</div>
                                      <div className="text-xs text-gray-500">per session</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="max-w-sm mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CalendarPlus className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Available</h3>
                        <p className="text-gray-500">This business hasn't added any services yet. Please check back later.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Date & Time Selection */}
              <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-opacity ${selectedService ? "" : "opacity-50"}`}>
                <div className="bg-gradient-to-r from-tim-green/5 to-tim-navy/5 px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      selectedService ? "bg-tim-green text-white" : "bg-gray-300 text-gray-600"
                    }`}>
                      2
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Select Date & Time</h2>
                  </div>
                  <p className="text-gray-600 mt-2">Choose your preferred appointment slot</p>
                </div>
                
                <div className="p-8 space-y-8">
                  {/* Date Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-tim-green" />
                      Choose Date
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {availableDates.slice(0, 12).map((date) => {
                        const dateStr = formatDateString(date);
                        const isSelected = selectedDate === dateStr;
                        
                        return (
                          <Button
                            key={dateStr}
                            variant={isSelected ? "default" : "outline"}
                            className={`p-3 h-auto flex flex-col gap-1 ${
                              isSelected 
                                ? "bg-tim-green hover:bg-green-600 border-tim-green" 
                                : "hover:border-tim-green hover:bg-tim-green/5"
                            }`}
                            onClick={() => handleDateSelect(dateStr)}
                            disabled={!selectedService}
                          >
                            <div className="text-xs font-medium opacity-80">
                              {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="text-lg font-bold">
                              {date.getDate()}
                            </div>
                            <div className="text-xs opacity-60">
                              {date.toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-tim-green" />
                        Choose Time
                      </h3>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {timeSlots.map((time) => {
                          const isSelected = selectedTime === time;
                          const isBooked = isTimeSlotBooked(time);
                          
                          return (
                            <Button
                              key={time}
                              variant={isSelected ? "default" : "outline"}
                              disabled={isBooked}
                              className={`p-3 relative ${
                                isBooked
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                  : isSelected 
                                    ? "bg-tim-green hover:bg-green-600 border-tim-green text-white" 
                                    : "hover:border-tim-green hover:bg-tim-green/5"
                              }`}
                              onClick={() => !isBooked && handleTimeSelect(time)}
                            >
                              <span className={isBooked ? "line-through" : ""}>
                                {time}
                              </span>
                              {isBooked && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                  ✕
                                </span>
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Contact Information */}
              {selectedDate && selectedTime && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-tim-green/5 to-tim-navy/5 px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-tim-green text-white rounded-full text-sm font-bold">
                        3
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Your Information</h2>
                    </div>
                    <p className="text-gray-600 mt-2">Tell us how to reach you</p>
                  </div>
                  
                  <div className="p-8">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-900 font-medium">Full Name *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter your full name" 
                                    {...field}
                                    className="border-gray-300 focus:border-tim-green focus:ring-tim-green/20"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-900 font-medium">Phone Number *</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="tel" 
                                    placeholder="(123) 456-7890" 
                                    {...field}
                                    className="border-gray-300 focus:border-tim-green focus:ring-tim-green/20"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-900 font-medium">Email Address</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="your@email.com" 
                                  {...field}
                                  className="border-gray-300 focus:border-tim-green focus:ring-tim-green/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full text-white font-semibold py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:opacity-90"
                          style={{ 
                            backgroundColor: primaryColor
                          }}
                          disabled={bookingMutation.isPending}
                        >
                          {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card 
                  className="shadow-lg border"
                  style={{ 
                    backgroundColor: backgroundColor,
                    borderColor: `${primaryColor}20`
                  }}
                >
                  <CardHeader 
                    style={{ 
                      background: `linear-gradient(to right, ${primaryColor}08, ${secondaryColor}08)`
                    }}
                  >
                    <CardTitle className="text-xl font-bold" style={{ color: textColor }}>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {selectedService ? (
                      <div className="space-y-4">
                        <div className="border-b pb-4">
                          <h3 className="font-semibold" style={{ color: textColor }}>{selectedService.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{selectedService.duration} minutes</p>
                          <p className="text-2xl font-bold mt-2" style={{ color: primaryColor }}>${selectedService.price}</p>
                        </div>

                        {selectedDate && (
                          <div className="border-b pb-4">
                            <h4 className="font-medium text-gray-900">Date & Time</h4>
                            <p className="text-gray-700">
                              {new Date(selectedDate).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                timeZone: 'America/New_York'
                              })}
                            </p>
                            {selectedTime && (
                              <p className="text-gray-700">{selectedTime}</p>
                            )}
                          </div>
                        )}

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{business?.phone || "Contact via booking"}</span>
                          </div>
                          {business?.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span>{business.email}</span>
                            </div>
                          )}
                          {business?.address && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{business.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CalendarPlus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Select a service to get started</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Business Description */}
      {(customization?.businessDescription || customization?.footerText) && (
        <div 
          className="border-t py-8"
          style={{ 
            backgroundColor: `${primaryColor}05`,
            borderColor: `${primaryColor}20`
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {customization?.businessDescription && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-3" style={{ color: textColor }}>About Us</h3>
                <p className="text-gray-600 leading-relaxed">{customization.businessDescription}</p>
              </div>
            )}
            {customization?.footerText && (
              <div className="text-sm text-gray-500">
                {customization.footerText}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent 
          className="max-w-md" 
          aria-describedby="booking-confirmation-description"
          style={{ backgroundColor: backgroundColor }}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold" style={{ color: primaryColor }}>
              Booking Confirmed! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Check className="h-8 w-8" style={{ color: primaryColor }} />
            </div>
            <p style={{ color: textColor }}>
              Your appointment with <strong>{customization?.businessName || business?.name || "this business"}</strong> has been successfully booked!
            </p>
            {bookingDetails && (
              <div 
                className="rounded-lg p-4 text-sm"
                style={{ 
                  backgroundColor: `${primaryColor}10`,
                  color: textColor
                }}
              >
                <p><strong>Service:</strong> {bookingDetails.selectedService?.name}</p>
                <p><strong>Date:</strong> {new Date(bookingDetails.selectedDate + 'T12:00:00').toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  timeZone: 'America/New_York'
                })}</p>
                <p><strong>Time:</strong> {bookingDetails.selectedTime}</p>
                <p><strong>Price:</strong> <span style={{ color: primaryColor, fontWeight: 'bold' }}>${bookingDetails.selectedService?.price}</span></p>
              </div>
            )}
          </div>
          <Button 
            onClick={() => setShowConfirmation(false)}
            className="w-full text-white hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}