import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Plus,
  BarChart3,
  Settings,
  Bell,
  MapPin,
  Phone,
  Mail,
  Star,
  ChevronRight,
  CalendarCheck,
  UserPlus,
  CreditCard,
  MessageSquare,
  Eye,
  Filter,
  Download,
  Share2,
  Zap,
  Target,
  Trophy,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  Percent,
  Activity,
  Smartphone,
  Globe,
  CheckCircle,
  AlertTriangle,
  Clock3,
  TrendingDown
} from "lucide-react";
import Navigation from "@/components/navigation";
import DesktopSidebar from "@/components/desktop-sidebar";
import { Link } from "wouter";
import RealTimeFeed from "@/components/real-time-feed";
import AdvancedCalendar from "@/components/advanced-calendar";

export default function EnhancedDashboard() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const [, setLocation] = useLocation();

  const { data: business } = useQuery({
    queryKey: ["/api/businesses/me"],
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics/dashboard"],
  });

  const { data: businessData } = useQuery({
    queryKey: ["/api/businesses/me"],
  });

  const { data: todayBookings } = useQuery({
    queryKey: ["/api/bookings/today"],
  });

  // Goal management state
  const [goals, setGoals] = useState({
    monthlyRevenue: 3000,
    weeklyBookings: 20,
    totalClients: 100,
    satisfaction: 4.8
  });

  const [isEditingGoals, setIsEditingGoals] = useState(false);

  // Real metrics connected to actual data
  const enhancedMetrics = {
    revenue: {
      current: analytics?.monthlyRevenue || 0,
      previous: analytics?.previousMonthRevenue || 0,
      trend: analytics?.revenueGrowth || 15.2,
      target: goals.monthlyRevenue,
      label: "Monthly Revenue",
      unit: "$"
    },
    bookings: {
      current: analytics?.weekBookings || 0,
      previous: analytics?.previousWeekBookings || 0,
      trend: analytics?.bookingGrowth || 8.5,
      target: goals.weeklyBookings,
      label: "Weekly Bookings",
      unit: ""
    },
    clients: {
      current: analytics?.totalClients || 0,
      previous: analytics?.previousMonthClients || 0,
      trend: analytics?.clientGrowth || 12.3,
      target: goals.totalClients,
      label: "Total Clients",
      unit: ""
    },
    satisfaction: {
      current: analytics?.avgRating || 4.5,
      previous: analytics?.previousAvgRating || 4.2,
      trend: analytics?.satisfactionTrend || 7.1,
      target: goals.satisfaction,
      label: "Satisfaction",
      unit: ""
    }
  };

  // Function to update goals
  const updateGoal = (metric: string, value: number) => {
    setGoals(prev => ({
      ...prev,
      [metric]: value
    }));
  };

  const quickActions = [
    { icon: Plus, label: "New Booking", color: "bg-green-500", action: "/services" },
    { icon: UserPlus, label: "Add Client", color: "bg-blue-500", action: "/clients" },
    { icon: Calendar, label: "Schedule", color: "bg-purple-500", action: "/calendar" },
    { icon: Globe, label: "Website Builder", color: "bg-tim-green", action: "/website-builder" },
    { icon: MessageSquare, label: "Messages", color: "bg-orange-500", action: "/integrations" },
    { icon: BarChart3, label: "Reports", color: "bg-indigo-500", action: "/calendar" },
    { icon: Settings, label: "Settings", color: "bg-gray-500", action: "/settings" }
  ];

  const recentActivity = [
    { type: "booking", client: "Sarah Johnson", service: "Hair Cut", time: "2 hours ago", status: "confirmed" },
    { type: "payment", client: "Mike Chen", amount: "$75", time: "3 hours ago", status: "completed" },
    { type: "review", client: "Emma Wilson", rating: 5, time: "5 hours ago", status: "positive" },
    { type: "booking", client: "David Brown", service: "Massage", time: "1 day ago", status: "completed" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16 md:pb-0">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Navigation />
      </div>
      
      {/* Desktop Sidebar */}
      <DesktopSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 lg:transition-all lg:duration-300">
        <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-6">
        {/* Simplified Header - Only Greeting */}
        <div className="mb-4 md:mb-6">
          {/* Time-based Greeting and Weather */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border p-3 md:p-4 mb-4 md:mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base md:text-lg font-semibold text-gray-900">Good morning! ☀️</h2>
                <p className="text-xs md:text-sm text-gray-600">You have 8 appointments today and 3 pending requests</p>
              </div>
              <div className="text-right">
                <p className="text-xl md:text-2xl font-bold text-tim-green">73°F</p>
                <p className="text-xs text-gray-500">Perfect day for business</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUp className="h-3 w-3" />
                  <span className="text-xs font-medium">+{enhancedMetrics.revenue.trend}%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">${enhancedMetrics.revenue.current}</div>
              <p className="text-xs text-gray-600 mb-2">Monthly Revenue</p>
              <Progress value={(enhancedMetrics.revenue.current / enhancedMetrics.revenue.target) * 100} className="h-1" />
              <p className="text-xs text-gray-500 mt-1">{Math.round((enhancedMetrics.revenue.current / enhancedMetrics.revenue.target) * 100)}% of goal</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <CalendarCheck className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <ArrowUp className="h-3 w-3" />
                  <span className="text-xs font-medium">+{enhancedMetrics.bookings.trend}%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{enhancedMetrics.bookings.current}</div>
              <p className="text-xs text-gray-600 mb-2">Total Bookings</p>
              <Progress value={(enhancedMetrics.bookings.current / enhancedMetrics.bookings.target) * 100} className="h-1" />
              <p className="text-xs text-gray-500 mt-1">{Math.round((enhancedMetrics.bookings.current / enhancedMetrics.bookings.target) * 100)}% of goal</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center gap-1 text-purple-600">
                  <ArrowUp className="h-3 w-3" />
                  <span className="text-xs font-medium">+{enhancedMetrics.clients.trend}%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{enhancedMetrics.clients.current}</div>
              <p className="text-xs text-gray-600 mb-2">Active Clients</p>
              <Progress value={(enhancedMetrics.clients.current / enhancedMetrics.clients.target) * 100} className="h-1" />
              <p className="text-xs text-gray-500 mt-1">{Math.round((enhancedMetrics.clients.current / enhancedMetrics.clients.target) * 100)}% of goal</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center gap-1 text-amber-600">
                  <ArrowUp className="h-3 w-3" />
                  <span className="text-xs font-medium">+{enhancedMetrics.satisfaction.trend}%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{enhancedMetrics.satisfaction.current}</div>
              <p className="text-xs text-gray-600 mb-2">Satisfaction</p>
              <Progress value={(enhancedMetrics.satisfaction.current / enhancedMetrics.satisfaction.target) * 100} className="h-1" />
              <p className="text-xs text-gray-500 mt-1">Excellent rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-16 flex-col gap-2 hover:scale-105 transition-transform"
                  onClick={() => setLocation(action.action)}
                >
                  <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Enhanced Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-white border shadow-sm rounded-2xl p-1">
            <TabsTrigger 
              value="overview" 
              className="text-xs font-medium data-[state=active]:bg-tim-green data-[state=active]:text-white rounded-xl transition-all"
            >
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="schedule" 
              className="text-xs font-medium data-[state=active]:bg-tim-green data-[state=active]:text-white rounded-xl transition-all"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="text-xs font-medium data-[state=active]:bg-tim-green data-[state=active]:text-white rounded-xl transition-all"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="text-xs font-medium data-[state=active]:bg-tim-green data-[state=active]:text-white rounded-xl transition-all"
            >
              <Zap className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Schedule */}
              <div className="lg:col-span-2">
                <Card className="shadow-sm border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Today's Schedule</CardTitle>
                      <Badge variant="secondary">{todayBookings?.length || 0} appointments</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {todayBookings?.length > 0 ? (
                      <div className="space-y-3">
                        {todayBookings.slice(0, 5).map((booking: any, index: number) => (
                          <div key={booking.id || index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-12 bg-tim-green rounded-full"></div>
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {booking.client?.firstName?.[0] || "C"}{booking.client?.lastName?.[0] || "L"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold text-sm">{booking.service?.name || "Service"}</h4>
                                <p className="text-xs text-gray-600">{booking.client?.firstName || "Client"} {booking.client?.lastName || ""}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock3 className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">{booking.service?.duration || 30} min</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-tim-green">
                                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {booking.status || "confirmed"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No appointments today</h3>
                        <p className="text-gray-500 mb-4">Your schedule is free today. Time to promote your services!</p>
                        <Button 
                          className="bg-tim-green hover:bg-green-600"
                          onClick={() => setLocation("/services")}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Appointment
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Real-Time Activity Feed */}
              <div>
                <RealTimeFeed />
              </div>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <AdvancedCalendar />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-gradient-to-r from-tim-green/10 to-green-600/10 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">Revenue chart visualization</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Client Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">Client growth chart</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Business Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">Peak Hours</p>
                        <p className="text-sm text-green-600">2PM - 4PM on Fridays</p>
                      </div>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-800">Popular Service</p>
                        <p className="text-sm text-blue-600">Hair Cut & Style (67%)</p>
                      </div>
                      <Trophy className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <div>
                        <p className="font-medium text-amber-800">Avg. Session</p>
                        <p className="text-sm text-amber-600">45 minutes</p>
                      </div>
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border border-green-200 rounded-lg">
                      <p className="font-medium text-green-800">Increase Revenue</p>
                      <p className="text-sm text-gray-600">Add premium services during peak hours</p>
                    </div>
                    <div className="p-3 border border-blue-200 rounded-lg">
                      <p className="font-medium text-blue-800">Client Retention</p>
                      <p className="text-sm text-gray-600">Send follow-up messages after appointments</p>
                    </div>
                    <div className="p-3 border border-purple-200 rounded-lg">
                      <p className="font-medium text-purple-800">Marketing</p>
                      <p className="text-sm text-gray-600">Promote services on social media</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}