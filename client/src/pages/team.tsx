import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTeamMemberSchema, type TeamMember } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar,
  Clock,
  Settings,
  Edit,
  Trash2,
  Star,
  Badge as BadgeIcon
} from "lucide-react";
import { z } from "zod";
import Navigation from "@/components/navigation";

type TeamMemberFormData = z.infer<typeof insertTeamMemberSchema>;

export default function TeamManagement() {
  const { toast } = useToast();
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Fetch team members
  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ["/api/team-members"],
  });

  // Add team member mutation
  const addMemberMutation = useMutation({
    mutationFn: async (data: TeamMemberFormData) => {
      return await apiRequest(`/api/team-members`, "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      setIsAddingMember(false);
      toast({
        title: "Success",
        description: "Team member added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update team member mutation
  const updateMemberMutation = useMutation({
    mutationFn: async (data: TeamMemberFormData & { id: number }) => {
      return await apiRequest(`/api/team-members/${data.id}`, "PATCH", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      setEditingMember(null);
      toast({
        title: "Success",
        description: "Team member updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete team member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/team-members/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      toast({
        title: "Success",
        description: "Team member removed successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(insertTeamMemberSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "staff",
      specialties: [],
    },
  });

  const onSubmit = (data: TeamMemberFormData) => {
    if (editingMember) {
      updateMemberMutation.mutate({ ...data, id: editingMember.id });
    } else {
      addMemberMutation.mutate(data);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    form.reset({
      name: member.name,
      email: member.email || "",
      phone: member.phone || "",
      role: member.role,
      specialties: member.specialties || [],
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      deleteMemberMutation.mutate(id);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner": return "bg-purple-100 text-purple-800";
      case "manager": return "bg-blue-100 text-blue-800";
      case "staff": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600 mt-1">Manage your team members and their schedules</p>
          </div>
          <Dialog open={isAddingMember || !!editingMember} onOpenChange={(open) => {
            if (!open) {
              setIsAddingMember(false);
              setEditingMember(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setIsAddingMember(true)}
                className="bg-tim-green hover:bg-green-600"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingMember ? "Edit Team Member" : "Add New Team Member"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email address" type="email" {...field} />
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specialties"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialties</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter specialties (comma-separated)"
                            value={field.value?.join(", ") || ""}
                            onChange={(e) => field.onChange(e.target.value.split(", ").filter(Boolean))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingMember(false);
                        setEditingMember(null);
                        form.reset();
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-tim-green hover:bg-green-600"
                      disabled={addMemberMutation.isPending || updateMemberMutation.isPending}
                    >
                      {editingMember ? "Update" : "Add"} Member
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : teamMembers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Team Members Yet</h3>
              <p className="text-gray-600 mb-4">Add your first team member to get started with scheduling</p>
              <Button 
                onClick={() => setIsAddingMember(true)}
                className="bg-tim-green hover:bg-green-600"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          ) : (
            teamMembers.map((member: TeamMember) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-tim-green text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <Badge className={`text-xs ${getRoleColor(member.role)}`}>
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {member.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  {member.specialties && member.specialties.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Availability
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}