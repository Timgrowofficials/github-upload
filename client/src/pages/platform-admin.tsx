import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Crown,
  BarChart3,
  Calendar,
  CreditCard,
  UserCheck,
  CheckCircle,
  Search,
  Filter,
  Download,
  Plus,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  PlayCircle,
  PauseCircle,
  Eye,
  Edit
} from "lucide-react";

interface PlatformStats {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  totalBusinesses: number;
  activeBusinesses: number;
  totalUsers: number;
  newSignupsThisMonth: number;
  websiteProjectsCompleted: number;
  totalCommissions: number;
  avgRevenuePerBusiness: number;
  churnRate: number;
}

interface BusinessAccount {
  id: number;
  name: string;
  businessType: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  subscriptionTier: string;
  monthlyRevenue: number;
  totalBookings: number;
  createdAt: string;
  lastLogin: string;
  websiteProjects: number;
  commissionGenerated: number;
}

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  humidity?: number;
  windSpeed?: number;
  feelsLike?: number;
}

export default function PlatformAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch real-time weather data using free wttr.in service
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Detect user's city from browser timezone
        let city = 'London';
        try {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (timezone.includes('New_York')) city = 'New York';
          else if (timezone.includes('Los_Angeles')) city = 'Los Angeles';
          else if (timezone.includes('Chicago')) city = 'Chicago';
          else if (timezone.includes('Toronto')) city = 'Toronto';
          else if (timezone.includes('Sydney')) city = 'Sydney';
          else if (timezone.includes('Tokyo')) city = 'Tokyo';
          else if (timezone.includes('Paris')) city = 'Paris';
          else if (timezone.includes('Berlin')) city = 'Berlin';
        } catch {
          // Use default if timezone detection fails
        }

        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeather({
          temperature: 22,
          description: 'partly cloudy',
          location: 'London'
        });
      }
    };

    fetchWeather();
    // Refresh weather every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Mock platform statistics (replace with real API when ready)
  const platformStats: PlatformStats = {
    totalRevenue: 48750,
    monthlyRecurringRevenue: 12500,
    totalBusinesses: 3,
    activeBusinesses: 2,
    totalUsers: 5,
    newSignupsThisMonth: 2,
    websiteProjectsCompleted: 1,
    totalCommissions: 150.50,
    avgRevenuePerBusiness: 16250,
    churnRate: 33.3
  };

  // Mock business data (replace with real API when ready)
  const businesses: BusinessAccount[] = [
    {
      id: 3,
      name: "SAHIL ANSARI",
      businessType: "Professional Services",
      email: "infotimgrow@gmail.com",
      phone: "Your phone number",
      address: "Your business address",
      status: "active",
      subscriptionTier: "Business",
      monthlyRevenue: 1500,
      totalBookings: 25,
      createdAt: "2025-01-01",
      lastLogin: "2025-01-04",
      websiteProjects: 1,
      commissionGenerated: 150.50
    },
    {
      id: 1,
      name: "Elite Barber Shop",
      businessType: "Professional Services", 
      email: "owner@elitebarber.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, New York, NY",
      status: "active",
      subscriptionTier: "Premium",
      monthlyRevenue: 2250,
      totalBookings: 186,
      createdAt: "2024-01-15",
      lastLogin: "2025-01-03",
      websiteProjects: 2,
      commissionGenerated: 3375.00
    },
    {
      id: 2,
      name: "Tech Repair Hub",
      businessType: "Professional Services",
      email: "support@techrepair.com", 
      phone: "+1 (555) 456-7890",
      address: "789 Tech Ave, Austin, TX",
      status: "suspended",
      subscriptionTier: "Starter",
      monthlyRevenue: 0,
      totalBookings: 45,
      createdAt: "2024-03-10",
      lastLogin: "2024-12-28",
      websiteProjects: 0,
      commissionGenerated: 125.00
    }
  ];

  const subscriptionPlans = [
    {
      id: "professional",
      name: "Professional",
      price: 5,
      priceUnit: "user/month",
      features: [
        "Unlimited services & bookings",
        "Advanced calendar & scheduling",
        "Client management & history",
        "Custom branding & booking pages",
        "Email notifications & reminders",
        "Business analytics & insights",
        "Mobile app included",
        "24/7 customer support",
        "Free setup & onboarding"
      ],
      maxServices: -1,
      maxBookings: -1,
      isPopular: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "suspended": return "bg-red-100 text-red-800";
      case "trial": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Premium": return "bg-purple-100 text-purple-800";
      case "Business": return "bg-blue-100 text-blue-800";
      case "Starter": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || business.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSuspendBusiness = (businessId: number) => {
    toast({
      title: "Business Suspended",
      description: "The business account has been suspended.",
    });
  };

  const handleActivateBusiness = (businessId: number) => {
    toast({
      title: "Business Activated", 
      description: "The business account has been activated.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Platform Admin</h1>
                <p className="text-gray-600">Tim Grow Platform Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {weather && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">{weather.temperature}°C</span>
                  <span className="text-gray-400">|</span>
                  <span className="capitalize">{weather.description}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-xs">{weather.location}</span>
                </div>
              )}
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${platformStats.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{platformStats.totalBusinesses}</div>
              <div className="text-sm text-gray-500">Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{platformStats.totalUsers}</div>
              <div className="text-sm text-gray-500">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">${platformStats.totalCommissions.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Commissions</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="businesses">Businesses</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${platformStats.monthlyRecurringRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      +12.5% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{platformStats.activeBusinesses}</div>
                  <p className="text-xs text-muted-foreground">
                    {((platformStats.activeBusinesses / platformStats.totalBusinesses) * 100).toFixed(1)}% active rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Signups</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{platformStats.newSignupsThisMonth}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{platformStats.churnRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <ArrowDown className="w-3 h-3 mr-1" />
                      -0.5% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Businesses</CardTitle>
                  <CardDescription>Businesses generating highest revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {businesses.slice(0, 3).map((business, index) => (
                      <div key={business.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{business.name}</p>
                            <p className="text-sm text-gray-500">{business.businessType}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${business.monthlyRevenue}</p>
                          <p className="text-sm text-gray-500">monthly</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                  <CardDescription>Key platform metrics and performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Revenue Goal</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="mt-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Customer Satisfaction</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="mt-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Business Retention</span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Businesses Tab */}
          <TabsContent value="businesses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Business Management</CardTitle>
                    <CardDescription>Manage all businesses on the platform</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Business
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search businesses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {filteredBusinesses.map((business) => (
                    <Card key={business.id} className="border">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback>{business.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-lg">{business.name}</h3>
                                <Badge className={getStatusColor(business.status)}>
                                  {business.status}
                                </Badge>
                                <Badge className={getTierColor(business.subscriptionTier)}>
                                  {business.subscriptionTier}
                                </Badge>
                              </div>
                              <p className="text-gray-600">{business.businessType}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Mail className="w-4 h-4 mr-1" />
                                  {business.email}
                                </span>
                                <span className="flex items-center">
                                  <Phone className="w-4 h-4 mr-1" />
                                  {business.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            {business.status === "active" ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSuspendBusiness(business.id)}
                              >
                                <PauseCircle className="w-4 h-4 mr-1" />
                                Suspend
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleActivateBusiness(business.id)}
                              >
                                <PlayCircle className="w-4 h-4 mr-1" />
                                Activate
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                          <div>
                            <p className="text-sm text-gray-500">Monthly Revenue</p>
                            <p className="font-semibold">${business.monthlyRevenue}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Bookings</p>
                            <p className="font-semibold">{business.totalBookings}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Commission Generated</p>
                            <p className="font-semibold">${business.commissionGenerated}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Last Login</p>
                            <p className="font-semibold">{new Date(business.lastLogin).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Platform Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">${platformStats.totalRevenue.toLocaleString()}</div>
                  <p className="text-sm text-gray-500 mt-2">All-time revenue</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Commission Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">${platformStats.totalCommissions.toLocaleString()}</div>
                  <p className="text-sm text-gray-500 mt-2">From website projects</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Avg Revenue per Business</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">${platformStats.avgRevenuePerBusiness.toFixed(2)}</div>
                  <p className="text-sm text-gray-500 mt-2">Monthly average</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className={plan.isPopular ? "border-tim-green border-2" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{plan.name}</CardTitle>
                        <div className="text-3xl font-bold mt-2">${plan.price}<span className="text-base font-normal">/{plan.priceUnit || "month"}</span></div>
                      </div>
                      {plan.isPopular && (
                        <Badge className="bg-tim-green text-white">Popular</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4" variant="outline">
                      Manage Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure platform-wide settings and policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="commission-rate">Website Builder Commission Rate</Label>
                      <p className="text-sm text-gray-500">Percentage commission on website projects</p>
                    </div>
                    <Input 
                      id="commission-rate"
                      type="number"
                      defaultValue="15"
                      className="w-20"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="trial-period">Free Trial Period</Label>
                      <p className="text-sm text-gray-500">Days of free trial for new businesses</p>
                    </div>
                    <Input 
                      id="trial-period"
                      type="number"
                      defaultValue="14"
                      className="w-20"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-suspend">Auto-suspend overdue accounts</Label>
                      <p className="text-sm text-gray-500">Automatically suspend accounts with overdue payments</p>
                    </div>
                    <Switch id="auto-suspend" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email notifications</Label>
                      <p className="text-sm text-gray-500">Send platform notifications via email</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                </div>
                
                <Button className="bg-tim-green hover:bg-tim-green/90">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}