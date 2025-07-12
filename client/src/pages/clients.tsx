import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  Star,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  Eye
} from "lucide-react";
import Navigation from "@/components/navigation";
import { apiRequest } from "@/lib/queryClient";

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  
  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Sample data for demonstration
  const sampleClients = [
    {
      id: 1,
      firstName: "Sarah",
      lastName: "Johnson",
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@email.com",
      totalBookings: 12,
      lastVisit: "2025-01-02",
      status: "active",
      rating: 5,
      notes: "Prefers afternoon appointments"
    },
    {
      id: 2,
      firstName: "Michael",
      lastName: "Chen",
      phone: "+1 (555) 234-5678",
      email: "m.chen@email.com",
      totalBookings: 8,
      lastVisit: "2024-12-28",
      status: "active",
      rating: 4,
      notes: "Regular monthly massage client"
    },
    {
      id: 3,
      firstName: "Emma",
      lastName: "Wilson",
      phone: "+1 (555) 345-6789",
      email: "emma.w@email.com",
      totalBookings: 15,
      lastVisit: "2025-01-01",
      status: "active",
      rating: 5,
      notes: "VIP client, always books premium services"
    },
    {
      id: 4,
      firstName: "David",
      lastName: "Brown",
      phone: "+1 (555) 456-7890",
      email: "david.brown@email.com",
      totalBookings: 3,
      lastVisit: "2024-11-15",
      status: "inactive",
      rating: 4,
      notes: "Moved to different city"
    }
  ];

  const displayClients = clients || sampleClients;

  const filteredClients = displayClients.filter((client: any) => {
    const matchesSearch = searchTerm === "" || 
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);

    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getClientStats = () => {
    const total = displayClients.length;
    const active = displayClients.filter((c: any) => c.status === 'active').length;
    const avgRating = displayClients.reduce((sum: number, c: any) => sum + c.rating, 0) / total;
    const totalBookings = displayClients.reduce((sum: number, c: any) => sum + c.totalBookings, 0);

    return { total, active, avgRating: avgRating.toFixed(1), totalBookings };
  };

  const stats = getClientStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-tim-green to-green-600 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                Client Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your client relationships and booking history</p>
            </div>
            <Button className="bg-tim-green hover:bg-green-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <p className="text-xs text-blue-600">Total Clients</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <p className="text-xs text-green-600">Active Clients</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">{stats.avgRating}⭐</div>
                <p className="text-xs text-yellow-600">Avg Rating</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{stats.totalBookings}</div>
                <p className="text-xs text-purple-600">Total Bookings</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search clients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('active')}
                  size="sm"
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('inactive')}
                  size="sm"
                >
                  Inactive
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClients.map((client: any) => (
            <Card key={client.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-tim-green to-green-600 text-white">
                        {client.firstName[0]}{client.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {client.firstName} {client.lastName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={client.status === 'active' ? 'default' : 'secondary'}
                          className={client.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                        >
                          {client.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{client.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>Last visit: {new Date(client.lastVisit).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-tim-green">{client.totalBookings}</div>
                      <div className="text-xs text-gray-600">Bookings</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        ${(client.totalBookings * 65).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Revenue</div>
                    </div>
                  </div>
                </div>

                {client.notes && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 italic">"{client.notes}"</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Calendar className="h-3 w-3 mr-2" />
                    Book
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No clients found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? "Try adjusting your search or filters" 
                  : "Start building your client base by adding your first client"
                }
              </p>
              <Button className="bg-tim-green hover:bg-green-600">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Your First Client
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}