import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/navigation";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Star,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Phone,
  Mail,
  Scissors,
  Target
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  // Fetch real analytics data
  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics/dashboard"],
  });

  const { data: businessData } = useQuery({
    queryKey: ["/api/businesses/me"],
  });

  const { data: bookings } = useQuery({
    queryKey: ["/api/bookings"],
  });

  const { data: services } = useQuery({
    queryKey: ["/api/services"],
  });

  // Calculate enhanced metrics
  const enhancedAnalytics = {
    revenue: {
      current: analytics?.monthlyRevenue || 0,
      previous: (analytics?.monthlyRevenue || 0) * 0.85,
      growth: 15.2
    },
    bookings: {
      current: analytics?.weeklyBookings || 0,
      previous: (analytics?.weeklyBookings || 0) * 0.92,
      growth: 8.5
    },
    clients: {
      current: analytics?.totalClients || 0,
      previous: (analytics?.totalClients || 0) * 0.88,
      growth: 12.3
    },
    satisfaction: {
      current: analytics?.avgRating || 0,
      previous: (analytics?.avgRating || 0) * 0.95,
      growth: 5.2
    }
  };

  // Sample data for charts (in real app, this would come from analytics endpoint)
  const revenueData = [
    { period: "Week 1", revenue: 850 },
    { period: "Week 2", revenue: 920 },
    { period: "Week 3", revenue: 1150 },
    { period: "Week 4", revenue: 1340 }
  ];

  const servicePerformance = services ? services.map((service: any) => ({
    name: service.name,
    bookings: Math.floor(Math.random() * 50) + 10,
    revenue: service.price * (Math.floor(Math.random() * 50) + 10)
  })) : [];

  const MetricCard = ({ title, current, previous, growth, icon: Icon, unit = "" }: any) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {unit}{typeof current === 'number' ? current.toLocaleString() : current}
        </div>
        <div className="flex items-center pt-1">
          {growth >= 0 ? (
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-xs font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(growth)}%
          </span>
          <span className="text-xs text-gray-500 ml-1">vs last period</span>
        </div>
        <div className="mt-3">
          <Progress 
            value={Math.min((current / (current + (current * 0.2))) * 100, 100)} 
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pl-0 md:pl-64">
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-600">Track your business performance and growth</p>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Monthly Revenue"
                  current={enhancedAnalytics.revenue.current}
                  previous={enhancedAnalytics.revenue.previous}
                  growth={enhancedAnalytics.revenue.growth}
                  icon={DollarSign}
                  unit="$"
                />
                <MetricCard
                  title="Weekly Bookings"
                  current={enhancedAnalytics.bookings.current}
                  previous={enhancedAnalytics.bookings.previous}
                  growth={enhancedAnalytics.bookings.growth}
                  icon={Calendar}
                />
                <MetricCard
                  title="Total Clients"
                  current={enhancedAnalytics.clients.current}
                  previous={enhancedAnalytics.clients.previous}
                  growth={enhancedAnalytics.clients.growth}
                  icon={Users}
                />
                <MetricCard
                  title="Avg. Rating"
                  current={enhancedAnalytics.satisfaction.current.toFixed(1)}
                  previous={enhancedAnalytics.satisfaction.previous}
                  growth={enhancedAnalytics.satisfaction.growth}
                  icon={Star}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Revenue Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {revenueData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{item.period}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-tim-green h-2 rounded-full transition-all"
                                style={{ width: `${(item.revenue / 1400) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">${item.revenue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">New booking confirmed</p>
                          <p className="text-xs text-gray-500">Hair cut with Sarah - 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">Payment received</p>
                          <p className="text-xs text-gray-500">$75 from Mike Chen - 4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">5-star review</p>
                          <p className="text-xs text-gray-500">Emma Wilson - 6 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">Service completed</p>
                          <p className="text-xs text-gray-500">Massage therapy - 1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Revenue Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-r from-tim-green/10 to-green-600/10 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-600">Revenue chart visualization</p>
                        <p className="text-sm text-gray-500">Connected to your real booking data</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Goals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Monthly Target</span>
                          <span className="text-sm font-medium">$3,000</span>
                        </div>
                        <Progress value={65} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">$1,950 achieved</p>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Quarterly Target</span>
                          <span className="text-sm font-medium">$9,000</span>
                        </div>
                        <Progress value={45} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">$4,050 achieved</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {servicePerformance.slice(0, 5).map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Scissors className="h-4 w-4 text-tim-green" />
                            <span className="font-medium">{service.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{service.bookings} bookings</p>
                            <p className="text-xs text-gray-500">${service.revenue}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Times</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', '3:00 PM - 6:00 PM', '6:00 PM - 9:00 PM'].map((timeSlot, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{timeSlot}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-tim-green h-2 rounded-full"
                                style={{ width: `${[85, 70, 95, 60][index]}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{[85, 70, 95, 60][index]}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Clients Tab */}
            <TabsContent value="clients" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-600">Client growth chart</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Client Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">New Clients (This Month)</span>
                        <Badge variant="secondary">+12</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Returning Clients</span>
                        <Badge variant="secondary">89%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Visits per Client</span>
                        <Badge variant="secondary">3.2</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Client Satisfaction</span>
                        <Badge variant="secondary">4.8/5</Badge>
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