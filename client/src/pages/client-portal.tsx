import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Star,
  ArrowLeft,
  CalendarDays,
  History
} from "lucide-react";
import { format } from "date-fns";

interface ClientSession {
  clientId: number;
  phone: string;
  email?: string;
  name?: string;
}

interface Booking {
  id: number;
  serviceId: number;
  serviceName: string;
  servicePrice: number;
  date: string;
  time: string;
  status: string;
  notes?: string;
}

interface Business {
  id: number;
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface ClientCustomization {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  logoUrl?: string;
  bannerUrl?: string;
  welcomeMessage?: string;
  businessDescription?: string;
  footerText?: string;
}

export default function ClientPortalPage() {
  const [location, setLocation] = useLocation();
  const [clientSession, setClientSession] = useState<ClientSession | null>(null);
  const [loginData, setLoginData] = useState({ phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  
  const businessSlug = location.split('/')[2]; // /client-portal/:slug
  
  const queryClient = useQueryClient();

  // Fetch business data
  const { data: business } = useQuery<Business>({
    queryKey: ['/api/businesses', businessSlug],
    enabled: !!businessSlug,
  });

  // Fetch customization
  const { data: customization } = useQuery<ClientCustomization>({
    queryKey: ['/api/businesses', businessSlug, 'client-customization'],
    enabled: !!businessSlug,
  });

  // Fetch client bookings
  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ['/api/client-bookings', clientSession?.clientId],
    enabled: !!clientSession?.clientId,
  });

  // Client login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: { phone: string; email?: string }) => {
      const response = await fetch('/api/client-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, businessSlug }),
      });
      if (!response.ok) throw new Error('Failed to login');
      return response.json();
    },
    onSuccess: (data) => {
      setClientSession(data);
      queryClient.invalidateQueries({ queryKey: ['/api/client-bookings'] });
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.phone && !loginData.email) return;
    
    setLoading(true);
    try {
      await loginMutation.mutateAsync(loginData);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setClientSession(null);
    setLoginData({ phone: "", email: "" });
  };

  const upcomingBookings = bookings.filter(b => 
    new Date(b.date + 'T' + b.time) > new Date() && b.status !== 'cancelled'
  );
  
  const pastBookings = bookings.filter(b => 
    new Date(b.date + 'T' + b.time) <= new Date() || b.status === 'cancelled'
  );

  // Apply custom styling
  const customStyle = customization ? {
    '--primary-color': customization.primaryColor || '#10b981',
    '--secondary-color': customization.secondaryColor || '#1e40af',
    '--accent-color': customization.accentColor || '#f59e0b',
    '--bg-color': customization.backgroundColor || '#ffffff',
    '--text-color': customization.textColor || '#111827',
  } as React.CSSProperties : {};

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Business not found</h1>
          <Button onClick={() => setLocation('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: customization?.backgroundColor || '#f9fafb',
        color: customization?.textColor || '#111827',
        ...customStyle
      }}
    >
      {/* Header with custom branding */}
      <div 
        className="border-b shadow-sm"
        style={{ backgroundColor: customization?.backgroundColor || '#ffffff' }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {customization?.logoUrl && (
                <img
                  src={customization.logoUrl}
                  alt={business.name}
                  className="h-12 w-auto object-contain"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">{business.name}</h1>
                <p className="text-sm opacity-75">Client Portal</p>
              </div>
            </div>
            
            {clientSession && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">{clientSession.name || 'Client'}</p>
                  <p className="text-sm opacity-75">{clientSession.phone}</p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Banner */}
      {customization?.bannerUrl && (
        <div className="h-32 overflow-hidden">
          <img
            src={customization.bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!clientSession ? (
          // Login Form
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Access Your Account</CardTitle>
                {customization?.welcomeMessage && (
                  <p className="text-center text-sm opacity-75 mt-2">
                    {customization.welcomeMessage}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Your phone number"
                      value={loginData.phone}
                      onChange={(e) => setLoginData(prev => ({ ...prev, phone: e.target.value }))}
                      className="text-base" // Prevent iOS zoom
                    />
                  </div>
                  
                  <div className="text-center text-sm opacity-75">or</div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email address"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      className="text-base" // Prevent iOS zoom
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading || (!loginData.phone && !loginData.email)}
                    style={{ backgroundColor: customization?.primaryColor }}
                  >
                    {loading ? 'Accessing...' : 'Access My Account'}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <Button 
                    variant="link" 
                    onClick={() => setLocation(`/book/${businessSlug}`)}
                  >
                    Book a New Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Client Dashboard
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">
                    Welcome back, {clientSession.name || 'Valued Client'}!
                  </h2>
                  {customization?.businessDescription && (
                    <p className="opacity-75 mb-4">{customization.businessDescription}</p>
                  )}
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={() => setLocation(`/book/${businessSlug}`)}
                      style={{ backgroundColor: customization?.primaryColor }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book New Appointment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Tabs */}
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Upcoming ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  History ({pastBookings.length})
                </TabsTrigger>
              </TabsList>

              {/* Upcoming Bookings */}
              <TabsContent value="upcoming" className="space-y-4">
                {upcomingBookings.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="font-medium mb-2">No upcoming appointments</h3>
                      <p className="text-sm opacity-75 mb-4">Book your next appointment to get started</p>
                      <Button 
                        onClick={() => setLocation(`/book/${businessSlug}`)}
                        style={{ backgroundColor: customization?.primaryColor }}
                      >
                        Book Appointment
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  upcomingBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{booking.serviceName}</h3>
                              <Badge 
                                variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                                style={{ 
                                  backgroundColor: booking.status === 'confirmed' 
                                    ? customization?.accentColor 
                                    : undefined 
                                }}
                              >
                                {booking.status}
                              </Badge>
                            </div>
                            
                            <div className="space-y-1 text-sm opacity-75">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {booking.time}
                              </div>
                            </div>
                            
                            {booking.notes && (
                              <p className="text-sm mt-2 p-2 bg-gray-50 rounded">{booking.notes}</p>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold">${booking.servicePrice}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Booking History */}
              <TabsContent value="history" className="space-y-4">
                {pastBookings.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="font-medium mb-2">No booking history</h3>
                      <p className="text-sm opacity-75">Your completed appointments will appear here</p>
                    </CardContent>
                  </Card>
                ) : (
                  pastBookings.map((booking) => (
                    <Card key={booking.id} className="opacity-75">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{booking.serviceName}</h3>
                              <Badge variant="secondary">
                                {booking.status}
                              </Badge>
                            </div>
                            
                            <div className="space-y-1 text-sm opacity-75">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {booking.time}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold">${booking.servicePrice}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Footer */}
      {customization?.footerText && (
        <div className="border-t mt-12">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm opacity-75">
            {customization.footerText}
          </div>
        </div>
      )}
    </div>
  );
}