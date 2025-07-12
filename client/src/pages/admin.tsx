import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Building2, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Activity,
  Settings,
  Shield,
  Database,
  BarChart3,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { format } from "date-fns";


interface AdminStats {
  totalUsers: number;
  totalBusinesses: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  newSignups: number;
  completedBookings: number;
  pendingBookings: number;
}

interface Business {
  id: number;
  name: string;
  businessType: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  createdAt: string;
  totalBookings: number;
  revenue: number;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  createdAt: string;
  lastLogin: string;
  status: string;
}

export default function AdminPanel() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock admin stats - in real app, these would come from API
  const adminStats: AdminStats = {
    totalUsers: 2847,
    totalBusinesses: 1429,
    totalBookings: 18543,
    totalRevenue: 284750,
    activeUsers: 1893,
    newSignups: 127,
    completedBookings: 16234,
    pendingBookings: 2309
  };

  // Mock businesses data - in real app, this would come from API
  const businesses: Business[] = [
    {
      id: 1,
      name: "Elite Barber Shop",
      businessType: "Salon & Spa",
      email: "contact@elitebarber.com",
      phone: "(555) 123-4567",
      address: "123 Main St, New York, NY",
      status: "active",
      createdAt: "2024-01-15",
      totalBookings: 234,
      revenue: 18750
    },
    {
      id: 2,
      name: "Zen Wellness Spa",
      businessType: "Wellness",
      email: "info@zenwellness.com",
      phone: "(555) 987-6543",
      address: "456 Health Ave, Los Angeles, CA",
      status: "active",
      createdAt: "2024-02-20",
      totalBookings: 189,
      revenue: 24600
    },
    {
      id: 3,
      name: "Tech Repair Pro",
      businessType: "Technology",
      email: "support@techrepair.com",
      phone: "(555) 456-7890",
      address: "789 Tech Blvd, San Francisco, CA",
      status: "pending",
      createdAt: "2024-12-01",
      totalBookings: 12,
      revenue: 1200
    }
  ];

  // Mock users data - in real app, this would come from API
  const users: User[] = [
    {
      id: "1",
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      profileImageUrl: "",
      createdAt: "2024-01-10",
      lastLogin: "2024-12-15",
      status: "active"
    },
    {
      id: "2",
      email: "jane.smith@example.com",
      firstName: "Jane",
      lastName: "Smith",
      profileImageUrl: "",
      createdAt: "2024-02-05",
      lastLogin: "2024-12-14",
      status: "active"
    },
    {
      id: "3",
      email: "mike.wilson@example.com",
      firstName: "Mike",
      lastName: "Wilson",
      profileImageUrl: "",
      createdAt: "2024-11-20",
      lastLogin: "2024-11-25",
      status: "inactive"
    }
  ];

  const navigation = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "businesses", label: "Businesses", icon: Building2 },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "system", label: "System", icon: Database }
  ];

  const statsCards = [
    {
      title: "Total Users",
      value: adminStats.totalUsers.toLocaleString(),
      change: "+12.5%",
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      changeColor: "text-green-600"
    },
    {
      title: "Active Businesses",
      value: adminStats.totalBusinesses.toLocaleString(),
      change: "+8.2%",
      icon: Building2,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      changeColor: "text-green-600"
    },
    {
      title: "Total Bookings",
      value: adminStats.totalBookings.toLocaleString(),
      change: "+15.3%",
      icon: Calendar,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      changeColor: "text-green-600"
    },
    {
      title: "Platform Revenue",
      value: `$${(adminStats.totalRevenue / 1000).toFixed(0)}K`,
      change: "+23.1%",
      icon: DollarSign,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      changeColor: "text-green-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">Admin panel requires authentication</p>
            <Button onClick={() => window.location.href = "/api/login"}>
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden mr-3 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
              <div className="flex items-center">
                <div className="text-2xl font-bold">
                  <span className="text-black">Tim</span>
                  <span className="text-tim-green">Grow</span>
                  <span className="text-red-500">.</span>
                </div>
                <span className="text-gray-500 text-sm ml-2">Admin</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-tim-green/10 text-tim-green hidden sm:block">
                Super Admin
              </Badge>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-tim-green rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <span className="text-sm font-medium hidden sm:block">{(user as any)?.email || 'Admin'}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
                className="hidden sm:flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">
                  <span className="text-black">Tim</span>
                  <span className="text-tim-green">Grow</span>
                  <span className="text-red-500">.</span>
                  <span className="text-gray-500 text-sm ml-2">Admin</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            <nav className="p-4">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-tim-green text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-tim-green rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{(user as any)?.email || 'Admin'}</div>
                    <Badge variant="secondary" className="bg-tim-green/10 text-tim-green text-xs">
                      Super Admin
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = "/api/logout"}
                  className="w-full justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="mt-8 px-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-tim-green text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Page Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-gray-600">Platform overview and key metrics</p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                  <Button size="sm" className="bg-tim-green hover:bg-green-600">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Data
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                          <p className={`text-sm font-medium ${stat.changeColor}`}>
                            {stat.change} from last month
                          </p>
                        </div>
                        <div className={`p-3 rounded-full ${stat.bgColor}`}>
                          <stat.icon className={`h-6 w-6 text-white`} style={{color: stat.color.replace('bg-', '')}} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add New Admin User
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Building2 className="mr-2 h-4 w-4" />
                      Review Pending Businesses
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      View System Alerts
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Platform Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Server Status</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Database</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">API Response</span>
                      <Badge className="bg-green-100 text-green-800">Fast</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Storage</span>
                      <Badge className="bg-yellow-100 text-yellow-800">75% Used</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "businesses" && (
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Business Management</h1>
                  <p className="text-gray-600">Manage and monitor all businesses on the platform</p>
                </div>
                <Button className="bg-tim-green hover:bg-green-600">
                  <Building2 className="mr-2 h-4 w-4" />
                  Add Business
                </Button>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search businesses..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Businesses Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Businesses ({businesses.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Business</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Bookings</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {businesses.map((business) => (
                          <tr key={business.id} className="hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium text-gray-900">{business.name}</div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {business.email}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-900">{business.businessType}</td>
                            <td className="py-4 px-4">
                              <Badge className={getStatusColor(business.status)}>
                                {business.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-900">{business.totalBookings}</td>
                            <td className="py-4 px-4 text-sm text-gray-900">${business.revenue.toLocaleString()}</td>
                            <td className="py-4 px-4 text-sm text-gray-900">
                              {format(new Date(business.createdAt), 'MMM dd, yyyy')}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                  <p className="text-gray-600">Manage platform users and their permissions</p>
                </div>
                <Button className="bg-tim-green hover:bg-green-600">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Users ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-tim-green rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-medium">
                                    {user.firstName?.[0] || 'U'}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">ID: {user.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-900">{user.email}</td>
                            <td className="py-4 px-4">
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-900">
                              {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-900">
                              {format(new Date(user.lastLogin), 'MMM dd, yyyy')}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-600">Comprehensive platform analytics and insights</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>New Users (This Month)</span>
                        <span className="font-semibold">+{adminStats.newSignups}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Active Users</span>
                        <span className="font-semibold">{adminStats.activeUsers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Completed Bookings</span>
                        <span className="font-semibold">{adminStats.completedBookings.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Total Platform Revenue</span>
                        <span className="font-semibold">${adminStats.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Average per Business</span>
                        <span className="font-semibold">${Math.round(adminStats.totalRevenue / adminStats.totalBusinesses).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Commission Earned</span>
                        <span className="font-semibold">${Math.round(adminStats.totalRevenue * 0.05).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
                <p className="text-gray-600">Configure global platform settings and preferences</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Platform Name</label>
                      <Input value="TimGrow" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Support Email</label>
                      <Input value="support@timgrow.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Commission Rate (%)</label>
                      <Input value="5" />
                    </div>
                    <Button className="bg-tim-green hover:bg-green-600">
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Feature Toggles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>New Business Registration</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Payment Processing</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SMS Notifications</span>
                      <Badge className="bg-red-100 text-red-800">Disabled</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}