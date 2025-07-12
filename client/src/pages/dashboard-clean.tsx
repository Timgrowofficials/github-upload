import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DollarSign,
  Calendar,
  Users,
  Star,
  Plus,
  UserPlus,
  MessageSquare,
  BarChart3,
  Settings,
  Activity,
  ArrowUp,
  ArrowDown,
  Globe,
  Target,
  Edit3,
  Share2,
  Copy,
  ExternalLink,
  Scissors,
  Palette
} from "lucide-react";
import Navigation from "@/components/navigation";
import DesktopSidebar from "@/components/desktop-sidebar";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import RealTimeFeed from "@/components/real-time-feed";
import QuickBookingForm from "@/components/quick-booking-form";

export default function EnhancedDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);

  // Fetch real data
  const { data: analytics } = useQuery<any>({
    queryKey: ["/api/analytics/dashboard"],
  });

  const { data: businessData } = useQuery<any>({
    queryKey: ["/api/businesses/me"],
  });

  const { data: upcomingBookings } = useQuery<any>({
    queryKey: ["/api/bookings/upcoming"],
  });

  const { data: todayBookings } = useQuery<any>({
    queryKey: ["/api/bookings/today"],
  });

  const copyBookingLink = async () => {
    if (businessData?.slug) {
      const bookingUrl = `${window.location.origin}/book/${businessData.slug}`;
      try {
        await navigator.clipboard.writeText(bookingUrl);
        toast({
          title: "Link copied!",
          description: "Booking page link has been copied to clipboard",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to copy link",
          variant: "destructive",
        });
      }
    }
  };

  const openBookingPage = () => {
    if (businessData?.slug) {
      const bookingUrl = `${window.location.origin}/book/${businessData.slug}`;
      window.open(bookingUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16 md:pb-0 lg:min-h-screen lg:bg-gradient-to-br lg:from-slate-50 lg:via-gray-50 lg:to-white">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Navigation />
      </div>
      
      {/* Desktop Sidebar */}
      <DesktopSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 lg:transition-all lg:duration-300">
        <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
        
        {/* Professional Header Section - Desktop Simple & Clean */}
        <div className="flex items-center justify-between mb-6 lg:bg-white lg:rounded-xl lg:shadow-lg lg:p-6 lg:mb-8 lg:border lg:border-gray-200">
          {/* Left Section - Business Identity */}
          <div className="lg:space-y-4">
            {/* Main Title Area */}
            <div className="lg:flex lg:items-center lg:gap-4">
              <div className="hidden lg:flex lg:w-12 lg:h-12 lg:bg-tim-green lg:rounded-lg lg:items-center lg:justify-center lg:shadow-md">
                <Activity className="lg:h-6 lg:w-6 lg:text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 lg:text-3xl lg:font-bold lg:text-slate-900">
                  Business Dashboard
                </h1>
                <p className="text-gray-600 lg:text-base lg:text-slate-600">
                  Professional business management & analytics
                </p>
              </div>
            </div>
            
            {/* Business Status & Info - Desktop Only */}
            <div className="hidden lg:flex lg:items-center lg:gap-3">
              <div className="lg:flex lg:items-center lg:gap-2 lg:px-3 lg:py-1 lg:bg-green-50 lg:rounded-full lg:border lg:border-green-200">
                <div className="lg:w-2 lg:h-2 lg:bg-green-500 lg:rounded-full lg:animate-pulse"></div>
                <span className="lg:text-xs lg:font-medium lg:text-green-700">Active</span>
              </div>
              {businessData && (
                <div className="lg:flex lg:items-center lg:gap-2 lg:px-3 lg:py-1 lg:bg-blue-50 lg:rounded-full lg:border lg:border-blue-200">
                  <Globe className="lg:h-3 lg:w-3 lg:text-blue-600" />
                  <span className="lg:text-xs lg:font-medium lg:text-blue-700">{businessData.name}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Section - Desktop Metrics */}
          <div className="hidden lg:block">
            <div className="lg:grid lg:grid-cols-2 lg:gap-4">
              <div className="lg:text-center lg:p-4 lg:bg-gray-50 lg:rounded-lg">
                <div className="lg:text-2xl lg:font-bold lg:text-slate-900">${analytics?.monthlyRevenue || 0}</div>
                <div className="lg:text-xs lg:text-slate-600 lg:font-medium">Monthly Revenue</div>
                <div className="lg:flex lg:items-center lg:justify-center lg:gap-1 lg:mt-1">
                  <ArrowUp className="lg:h-3 lg:w-3 lg:text-green-600" />
                  <span className="lg:text-xs lg:text-green-600">+15.2%</span>
                </div>
              </div>
              
              <div className="lg:text-center lg:p-4 lg:bg-gray-50 lg:rounded-lg">
                <div className="lg:text-2xl lg:font-bold lg:text-slate-900">{analytics?.weekBookings || 0}</div>
                <div className="lg:text-xs lg:text-slate-600 lg:font-medium">Weekly Bookings</div>
                <div className="lg:flex lg:items-center lg:justify-center lg:gap-1 lg:mt-1">
                  <ArrowUp className="lg:h-3 lg:w-3 lg:text-blue-600" />
                  <span className="lg:text-xs lg:text-blue-600">+8.5%</span>
                </div>
              </div>
              
              <div className="lg:text-center lg:p-4 lg:bg-gray-50 lg:rounded-lg">
                <div className="lg:text-2xl lg:font-bold lg:text-slate-900">{analytics?.totalClients || 0}</div>
                <div className="lg:text-xs lg:text-slate-600 lg:font-medium">Total Clients</div>
                <div className="lg:flex lg:items-center lg:justify-center lg:gap-1 lg:mt-1">
                  <ArrowUp className="lg:h-3 lg:w-3 lg:text-purple-600" />
                  <span className="lg:text-xs lg:text-purple-600">+12.3%</span>
                </div>
              </div>
              
              <div className="lg:text-center lg:p-4 lg:bg-gray-50 lg:rounded-lg">
                <div className="lg:text-2xl lg:font-bold lg:text-slate-900">4.5</div>
                <div className="lg:text-xs lg:text-slate-600 lg:font-medium">Satisfaction</div>
                <div className="lg:flex lg:items-center lg:justify-center lg:gap-1 lg:mt-1">
                  <ArrowUp className="lg:h-3 lg:w-3 lg:text-amber-600" />
                  <span className="lg:text-xs lg:text-amber-600">+23%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Portal Section - Enhanced */}
        {businessData && (
          <div className="mb-6 lg:mb-8">
            <div className="bg-gradient-to-r from-tim-green/10 to-green-600/10 lg:bg-gradient-to-r lg:from-slate-50 lg:to-green-50 rounded-xl lg:rounded-2xl p-4 lg:p-8 border lg:border-green-200 lg:backdrop-blur-sm">
              <div className="space-y-3 lg:space-y-4">
                <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
                  <div className="hidden lg:flex lg:w-12 lg:h-12 lg:bg-white lg:bg-opacity-20 lg:rounded-full lg:items-center lg:justify-center">
                    <Share2 className="lg:h-6 lg:w-6 lg:text-tim-green" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 lg:text-2xl lg:font-bold lg:text-slate-900">Share Your Booking Page</h3>
                    <p className="text-xs md:text-sm text-gray-600 lg:text-lg lg:text-slate-600">Let customers book appointments directly through your personalized link</p>
                  </div>
                </div>
                
                <div className="space-y-2 lg:space-y-3">
                  <div className="bg-white bg-opacity-20 rounded-lg p-2 md:p-3 lg:p-4 lg:bg-opacity-30 lg:backdrop-blur-sm">
                    <p className="text-xs md:text-sm font-mono text-gray-700 lg:text-base lg:font-medium lg:text-slate-700 break-all">
                      {window.location.origin}/book/{businessData.slug}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 lg:gap-3">
                    <Button 
                      onClick={copyBookingLink}
                      size="sm" 
                      className="flex-1 bg-tim-green hover:bg-green-600 text-white text-xs md:text-sm lg:px-6 lg:py-3 lg:text-base lg:font-semibold lg:shadow-lg lg:hover:shadow-xl lg:transform lg:hover:scale-105 lg:transition-all"
                    >
                      <Copy className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Copy Link
                    </Button>
                    <Button 
                      onClick={openBookingPage}
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs md:text-sm border-tim-green text-tim-green hover:bg-tim-green hover:text-white lg:px-6 lg:py-3 lg:text-base lg:font-semibold lg:border-2 lg:hover:shadow-lg lg:transform lg:hover:scale-105 lg:transition-all"
                    >
                      <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Open Page
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Metrics Grid - Desktop Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:gap-8 lg:mb-12">
          {/* Revenue Card - Enhanced */}
          <Card className="lg:shadow-2xl lg:border-0 lg:bg-gradient-to-br lg:from-white lg:to-gray-50 lg:hover:shadow-3xl lg:transition-all lg:duration-300 lg:transform lg:hover:scale-105">
            <CardContent className="p-3 md:p-4 lg:p-8">
              <div className="flex items-center justify-between mb-3 lg:mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center lg:w-16 lg:h-16 lg:bg-gradient-to-br lg:from-green-500 lg:to-emerald-600 lg:shadow-2xl lg:ring-4 lg:ring-green-100">
                  <DollarSign className="h-5 w-5 text-white lg:h-8 lg:w-8" />
                </div>
                <div className="flex items-center gap-1 text-green-600 lg:bg-gradient-to-r lg:from-green-100 lg:to-emerald-100 lg:px-3 lg:py-2 lg:rounded-full lg:shadow-md">
                  <ArrowUp className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="text-xs font-semibold lg:text-sm lg:font-bold">+15.2%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 lg:text-4xl lg:font-black lg:mb-2">
                ${analytics?.monthlyRevenue || 0}
              </div>
              <p className="text-xs text-gray-600 lg:text-base lg:text-slate-600 lg:font-medium">Monthly Revenue</p>
              <div className="mt-2 lg:mt-4">
                <Progress value={75} className="h-1 lg:h-2" />
                <p className="text-xs text-gray-500 mt-1 lg:text-sm lg:mt-2 lg:font-medium">75% of goal</p>
              </div>
              
              {/* Enhanced Desktop Features */}
              <div className="hidden lg:block lg:mt-4 lg:pt-4 lg:border-t lg:border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Target: $3,000</span>
                  <span className="text-sm font-semibold text-green-600">${3000 - (analytics?.monthlyRevenue || 0)} to go</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Card - Enhanced */}
          <Card className="lg:shadow-2xl lg:border-0 lg:bg-gradient-to-br lg:from-white lg:to-gray-50 lg:hover:shadow-3xl lg:transition-all lg:duration-300 lg:transform lg:hover:scale-105">
            <CardContent className="p-3 md:p-4 lg:p-8">
              <div className="flex items-center justify-between mb-3 lg:mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center lg:w-16 lg:h-16 lg:bg-gradient-to-br lg:from-blue-500 lg:to-cyan-600 lg:shadow-2xl lg:ring-4 lg:ring-blue-100">
                  <Calendar className="h-5 w-5 text-white lg:h-8 lg:w-8" />
                </div>
                <div className="flex items-center gap-1 text-blue-600 lg:bg-gradient-to-r lg:from-blue-100 lg:to-cyan-100 lg:px-3 lg:py-2 lg:rounded-full lg:shadow-md">
                  <ArrowUp className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="text-xs font-semibold lg:text-sm lg:font-bold">+8.5%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 lg:text-4xl lg:font-black lg:mb-2">
                {analytics?.weekBookings || 0}
              </div>
              <p className="text-xs text-gray-600 lg:text-base lg:text-slate-600 lg:font-medium">Total Bookings</p>
              <div className="mt-2 lg:mt-4">
                <Progress value={60} className="h-1 lg:h-2" />
                <p className="text-xs text-gray-500 mt-1 lg:text-sm lg:mt-2 lg:font-medium">60% of goal</p>
              </div>
            </CardContent>
          </Card>

          {/* Clients Card - Enhanced */}
          <Card className="lg:shadow-2xl lg:border-0 lg:bg-gradient-to-br lg:from-white lg:to-gray-50 lg:hover:shadow-3xl lg:transition-all lg:duration-300 lg:transform lg:hover:scale-105">
            <CardContent className="p-3 md:p-4 lg:p-8">
              <div className="flex items-center justify-between mb-3 lg:mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center lg:w-16 lg:h-16 lg:bg-gradient-to-br lg:from-purple-500 lg:to-violet-600 lg:shadow-2xl lg:ring-4 lg:ring-purple-100">
                  <Users className="h-5 w-5 text-white lg:h-8 lg:w-8" />
                </div>
                <div className="flex items-center gap-1 text-purple-600 lg:bg-gradient-to-r lg:from-purple-100 lg:to-violet-100 lg:px-3 lg:py-2 lg:rounded-full lg:shadow-md">
                  <ArrowUp className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="text-xs font-semibold lg:text-sm lg:font-bold">+12.3%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 lg:text-4xl lg:font-black lg:mb-2">
                {analytics?.totalClients || 0}
              </div>
              <p className="text-xs text-gray-600 lg:text-base lg:text-slate-600 lg:font-medium">Active Clients</p>
              <div className="mt-2 lg:mt-4">
                <Progress value={80} className="h-1 lg:h-2" />
                <p className="text-xs text-gray-500 mt-1 lg:text-sm lg:mt-2 lg:font-medium">80% of goal</p>
              </div>
            </CardContent>
          </Card>

          {/* Satisfaction Card - Enhanced */}
          <Card className="lg:shadow-2xl lg:border-0 lg:bg-gradient-to-br lg:from-white lg:to-gray-50 lg:hover:shadow-3xl lg:transition-all lg:duration-300 lg:transform lg:hover:scale-105">
            <CardContent className="p-3 md:p-4 lg:p-8">
              <div className="flex items-center justify-between mb-3 lg:mb-6">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center lg:w-16 lg:h-16 lg:bg-gradient-to-br lg:from-amber-500 lg:to-orange-600 lg:shadow-2xl lg:ring-4 lg:ring-amber-100">
                  <Star className="h-5 w-5 text-white lg:h-8 lg:w-8" />
                </div>
                <div className="flex items-center gap-1 text-amber-600 lg:bg-gradient-to-r lg:from-amber-100 lg:to-orange-100 lg:px-3 lg:py-2 lg:rounded-full lg:shadow-md">
                  <ArrowUp className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="text-xs font-semibold lg:text-sm lg:font-bold">+23%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 lg:text-4xl lg:font-black lg:mb-2">
                4.5
              </div>
              <p className="text-xs text-gray-600 lg:text-base lg:text-slate-600 lg:font-medium">Satisfaction</p>
              <div className="mt-2 lg:mt-4">
                <Progress value={90} className="h-1 lg:h-2" />
                <p className="text-xs text-gray-500 mt-1 lg:text-sm lg:mt-2 lg:font-medium">Excellent rating</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { icon: Plus, label: "New Booking", color: "bg-tim-green text-white", action: () => setIsQuickBookingOpen(true) },
              { icon: UserPlus, label: "Add Client", color: "bg-blue-500 text-white", action: () => setLocation("/clients") },
              { icon: Calendar, label: "Schedule", color: "bg-purple-500 text-white", action: () => setLocation("/calendar") },
              { icon: Globe, label: "Website Builder", color: "bg-orange-500 text-white", action: () => setLocation("/website-builder") },
              { icon: Palette, label: "Customize Booking Page", color: "bg-pink-500 text-white", action: () => setLocation("/client-customization") },
              { icon: BarChart3, label: "Reports", color: "bg-indigo-500 text-white", action: () => setLocation("/analytics") }
            ].map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity & Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Today's Schedule</CardTitle>
                <Badge variant="secondary">{(todayBookings?.length || 0)} appointments</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingBookings && upcomingBookings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingBookings.slice(0, 3).map((booking: any, index: number) => (
                    <div key={booking.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{booking.clientName}</h4>
                        <p className="text-sm text-gray-600">{booking.service?.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {(() => {
                              if (!booking.dateTime) return "Time TBD";
                              const date = new Date(booking.dateTime);
                              if (isNaN(date.getTime())) return "Invalid time";
                              return date.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                                timeZone: 'America/New_York'
                              });
                            })()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {booking.status || "confirmed"}
                        </Badge>
                        <p className="text-xs text-tim-green font-semibold mt-1">
                          ${booking.service?.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments today</h3>
                  <p className="text-gray-600">Your schedule is clear for today</p>
                  <Button className="mt-4 bg-tim-green hover:bg-green-600" onClick={() => setIsQuickBookingOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Booking
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real Time Feed */}
          <div>
            <RealTimeFeed />
          </div>
        </div>

        </div>
      </div>

      {/* Quick Booking Dialog */}
      <Dialog open={isQuickBookingOpen} onOpenChange={setIsQuickBookingOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Booking</DialogTitle>
            <DialogDescription>
              Quickly add a new appointment to your schedule
            </DialogDescription>
          </DialogHeader>
          <QuickBookingForm onSuccess={() => setIsQuickBookingOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}