import React, { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientMobileNavigation from "@/components/client-mobile-nav";
import {
  Calendar,
  Clock,
  Star,
  User,
  Phone,
  Mail,
  MapPin,
  Bell,
  Settings,
  LogOut,
  Edit,
  Heart,
  Gift,
  CreditCard,
  History,
  Plus,
  MessageSquare,
} from "lucide-react";

interface ClientDashboardProps {
  params?: { slug: string };
}

export default function ClientDashboard(props: any) {
  const { slug } = useParams();
  const currentSlug = props?.params?.slug || slug;

  // Get client customization for this business
  const { data: customization = {}, isLoading: customizationLoading } = useQuery({
    queryKey: [`/api/businesses/${currentSlug}/client-customization`],
    enabled: !!currentSlug,
  });

  // Type-safe access to customization properties
  const safeCustomization = customization as any || {};
  
  // Debug logging
  console.log('ClientDashboard - Current slug:', currentSlug);
  console.log('ClientDashboard - Customization data:', safeCustomization);
  console.log('ClientDashboard - Primary color:', safeCustomization?.primaryColor);
  console.log('ClientDashboard - Query enabled:', !!currentSlug);

  // Mock client data (in real app this would come from client authentication)
  const mockClient = {
    id: 1,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    profileImageUrl: null,
    loyaltyPoints: 150,
    totalVisits: 12,
    memberSince: "2024-01-15",
  };

  // Mock booking data
  const mockUpcomingBookings = [
    {
      id: 1,
      service: { name: "Hair Cut & Style", price: 65, duration: 60 },
      appointmentDate: "2025-07-08T14:00:00Z",
      status: "confirmed",
      business: { name: safeCustomization?.businessName || "Elite Salon" },
    },
    {
      id: 2,
      service: { name: "Color Treatment", price: 120, duration: 120 },
      appointmentDate: "2025-07-15T10:00:00Z",
      status: "confirmed",
      business: { name: safeCustomization?.businessName || "Elite Salon" },
    },
  ];

  const mockBookingHistory = [
    {
      id: 3,
      service: { name: "Hair Cut", price: 55, duration: 45 },
      appointmentDate: "2025-06-20T15:30:00Z",
      status: "completed",
      business: { name: safeCustomization?.businessName || "Elite Salon" },
    },
    {
      id: 4,
      service: { name: "Highlights", price: 95, duration: 90 },
      appointmentDate: "2025-06-05T11:00:00Z",
      status: "completed",
      business: { name: safeCustomization?.businessName || "Elite Salon" },
    },
  ];

  // Apply custom styles based on customization
  const customStyles = customization ? {
    '--primary-color': safeCustomization.primaryColor,
    '--secondary-color': safeCustomization.secondaryColor,
    '--accent-color': safeCustomization.accentColor,
    '--background-color': safeCustomization.backgroundColor,
    '--text-color': safeCustomization.textColor,
  } as React.CSSProperties : {};

  if (customizationLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tim-green"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pb-16"
      style={{ 
        backgroundColor: safeCustomization?.backgroundColor || '#fafafa',
        color: safeCustomization?.textColor || '#111827',
        ...customStyles 
      }}
    >
      {/* Enhanced Header with Banner Support */}
      <div className="relative">
        {/* Banner Image */}
        {safeCustomization?.bannerUrl && (
          <div className="h-32 md:h-48 relative overflow-hidden">
            <img 
              src={safeCustomization.bannerUrl} 
              alt="Banner" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
        )}
        
        {/* Header Content */}
        <div 
          className={`${safeCustomization?.bannerUrl ? 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white' : 'bg-white shadow-sm border-b'}`}
          style={{ 
            backgroundColor: !safeCustomization?.bannerUrl ? (safeCustomization?.backgroundColor || '#ffffff') : undefined,
            borderColor: !safeCustomization?.bannerUrl ? (safeCustomization?.primaryColor ? `${safeCustomization.primaryColor}20` : '#e5e7eb') : undefined
          }}
        >
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {safeCustomization?.logoUrl ? (
                  <img 
                    src={safeCustomization.logoUrl} 
                    alt="Logo" 
                    className="h-12 w-auto bg-white rounded-lg p-1 shadow-sm" 
                  />
                ) : (
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                    style={{ backgroundColor: safeCustomization?.primaryColor || '#10b981' }}
                  >
                    {(safeCustomization?.businessName || "BS").charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className={`text-xl md:text-2xl font-bold ${safeCustomization?.bannerUrl ? 'text-white' : ''}`}>
                    {safeCustomization?.businessName || "Business Portal"}
                  </h1>
                  <p className={`text-sm ${safeCustomization?.bannerUrl ? 'text-gray-200' : 'text-gray-600'}`}>
                    Client Dashboard
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {safeCustomization?.showNotifications !== false && (
                  <Button 
                    variant={safeCustomization?.bannerUrl ? "secondary" : "ghost"} 
                    size="sm"
                    className={safeCustomization?.bannerUrl ? "bg-white/20 text-white hover:bg-white/30" : ""}
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant={safeCustomization?.bannerUrl ? "secondary" : "ghost"} 
                  size="sm"
                  className={safeCustomization?.bannerUrl ? "bg-white/20 text-white hover:bg-white/30" : ""}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  variant={safeCustomization?.bannerUrl ? "secondary" : "ghost"} 
                  size="sm"
                  className={safeCustomization?.bannerUrl ? "bg-white/20 text-white hover:bg-white/30" : ""}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome Message */}
        {safeCustomization?.welcomeMessage && (
          <div 
            className="mb-6 p-4 rounded-lg border"
            style={{ 
              backgroundColor: safeCustomization?.primaryColor ? `${safeCustomization.primaryColor}10` : '#f0fdf4',
              borderColor: safeCustomization?.primaryColor || '#10b981'
            }}
          >
            <p className="text-center">{safeCustomization.welcomeMessage}</p>
          </div>
        )}

        {/* Enhanced Profile Section */}
        {safeCustomization?.showProfileSection !== false && (
          <Card className="mb-6 shadow-lg border-0" style={{ backgroundColor: safeCustomization?.backgroundColor || '#ffffff' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="h-20 w-20 shadow-lg ring-4 ring-white">
                  <AvatarImage src={mockClient.profileImageUrl || ""} />
                  <AvatarFallback 
                    style={{ backgroundColor: safeCustomization?.primaryColor || '#10b981' }}
                    className="text-white text-xl font-bold"
                  >
                    {mockClient.firstName.charAt(0)}{mockClient.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-1">
                    Welcome back, {mockClient.firstName}!
                  </h2>
                  <p className="text-gray-600 mb-2">
                    Member since {new Date(mockClient.memberSince).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{mockClient.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{mockClient.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Button variant="outline" size="sm" className="mb-2">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
              
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${safeCustomization?.primaryColor || '#10b981'}10` }}>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full" style={{ backgroundColor: safeCustomization?.primaryColor || '#10b981' }}>
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold" style={{ color: safeCustomization?.primaryColor || '#10b981' }}>
                    {mockClient.loyaltyPoints}
                  </div>
                  <div className="text-xs text-gray-600">Loyalty Points</div>
                </div>
                
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${safeCustomization?.secondaryColor || '#1e40af'}10` }}>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full" style={{ backgroundColor: safeCustomization?.secondaryColor || '#1e40af' }}>
                    <History className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold" style={{ color: safeCustomization?.secondaryColor || '#1e40af' }}>
                    {mockClient.totalVisits}
                  </div>
                  <div className="text-xs text-gray-600">Total Visits</div>
                </div>
                
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${safeCustomization?.accentColor || '#f59e0b'}10` }}>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full" style={{ backgroundColor: safeCustomization?.accentColor || '#f59e0b' }}>
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold" style={{ color: safeCustomization?.accentColor || '#f59e0b' }}>
                    4.9
                  </div>
                  <div className="text-xs text-gray-600">Avg Rating</div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-gray-400">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-700">2</div>
                  <div className="text-xs text-gray-600">Upcoming</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            {safeCustomization?.showUpcomingBookings !== false && (
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            )}
            {safeCustomization?.showBookingHistory !== false && (
              <TabsTrigger value="history">History</TabsTrigger>
            )}
            {safeCustomization?.showServices !== false && (
              <TabsTrigger value="services">Services</TabsTrigger>
            )}
            {safeCustomization?.showReviewsSection !== false && (
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            )}
          </TabsList>

          {/* Upcoming Bookings */}
          {safeCustomization?.showUpcomingBookings !== false && (
            <TabsContent value="upcoming" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
                {safeCustomization?.enableOnlineBooking && (
                  <Button 
                    style={{ backgroundColor: safeCustomization?.primaryColor || '#10b981' }}
                    className="text-white hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                )}
              </div>

              <div className="grid gap-4">
                {mockUpcomingBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{booking.service.name}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {(() => {
                                if (!booking.appointmentDate) return "Date TBD";
                                const date = new Date(booking.appointmentDate);
                                if (isNaN(date.getTime())) return "Invalid date";
                                return date.toLocaleDateString();
                              })()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {(() => {
                                if (!booking.appointmentDate) return "Time TBD";
                                const date = new Date(booking.appointmentDate);
                                if (isNaN(date.getTime())) return "Invalid time";
                                return date.toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                });
                              })()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg">${booking.service.price}</div>
                          <Badge variant="outline">{booking.status}</Badge>
                          <div className="mt-2 space-x-2">
                            {safeCustomization?.enableRescheduleBooking && (
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3 mr-1" />
                                Reschedule
                              </Button>
                            )}
                            {safeCustomization?.enableCancelBooking && (
                              <Button variant="outline" size="sm">
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {/* Booking History */}
          {safeCustomization?.showBookingHistory !== false && (
            <TabsContent value="history" className="space-y-4">
              <h3 className="text-lg font-semibold">Booking History</h3>
              
              <div className="grid gap-4">
                {mockBookingHistory.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{booking.service.name}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {(() => {
                                if (!booking.appointmentDate) return "Date TBD";
                                const date = new Date(booking.appointmentDate);
                                if (isNaN(date.getTime())) return "Invalid date";
                                return date.toLocaleDateString();
                              })()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {(() => {
                                if (!booking.appointmentDate) return "Time TBD";
                                const date = new Date(booking.appointmentDate);
                                if (isNaN(date.getTime())) return "Invalid time";
                                return date.toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                });
                              })()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg">${booking.service.price}</div>
                          <Badge variant="secondary">{booking.status}</Badge>
                          <div className="mt-2">
                            <Button variant="outline" size="sm">
                              <Star className="h-3 w-3 mr-1" />
                              Rate Service
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {/* Services */}
          {safeCustomization?.showServices !== false && (
            <TabsContent value="services" className="space-y-4">
              <h3 className="text-lg font-semibold">Available Services</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Hair Cut & Style", price: 65, duration: 60, description: "Professional cut and styling" },
                  { name: "Color Treatment", price: 120, duration: 120, description: "Full color application" },
                  { name: "Highlights", price: 95, duration: 90, description: "Partial highlights" },
                  { name: "Deep Conditioning", price: 45, duration: 45, description: "Intensive hair treatment" },
                ].map((service, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{service.name}</h4>
                        <div className="text-lg font-bold">${service.price}</div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{service.duration} minutes</span>
                        {safeCustomization?.enableOnlineBooking && (
                          <Button 
                            size="sm"
                            style={{ backgroundColor: safeCustomization?.primaryColor || '#10b981' }}
                            className="text-white hover:opacity-90"
                          >
                            Book Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {/* Reviews */}
          {safeCustomization?.showReviewsSection !== false && (
            <TabsContent value="reviews" className="space-y-4">
              <h3 className="text-lg font-semibold">Reviews & Feedback</h3>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Share Your Experience</h4>
                    <p className="text-gray-600 mb-4">Help others by leaving a review of your recent visits</p>
                    <Button 
                      style={{ backgroundColor: safeCustomization?.primaryColor || '#10b981' }}
                      className="text-white hover:opacity-90"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Write Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Business Description */}
        {safeCustomization?.businessDescription && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">About {safeCustomization.businessName}</h3>
              <p className="text-gray-600">{safeCustomization.businessDescription}</p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        {safeCustomization?.footerText && (
          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
            {safeCustomization.footerText}
          </div>
        )}
      </div>

      {/* Client Mobile Navigation */}
      {currentSlug && <ClientMobileNavigation businessSlug={currentSlug} />}
    </div>
  );
}