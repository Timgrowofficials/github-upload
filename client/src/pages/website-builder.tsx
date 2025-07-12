import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Globe, 
  Rocket, 
  Code, 
  Users, 
  TrendingUp, 
  Star, 
  Clock, 
  DollarSign,
  ExternalLink,
  Plus,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Monitor,
  Smartphone,
  Palette,
  Shield,
  Award,
  Target,
  Eye,
  ArrowRight,
  Sparkles,
  Crown,
  Play
} from "lucide-react";

interface WebsiteTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  features: string[];
  pricing: string;
  imageUrl: string;
}

interface WebsiteProject {
  id: number;
  title: string;
  description: string;
  businessType: string;
  requirements: string;
  status: string;
  replitUrl?: string;
  deployedUrl?: string;
  pricing: string;
  commission: string;
  createdAt: string;
  completedAt?: string;
}

export default function WebsiteBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteTemplate | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    title: "",
    description: "",
    businessType: "",
    requirements: "",
    pricing: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch website templates
  const { data: templates = [], isLoading: templatesLoading } = useQuery<WebsiteTemplate[]>({
    queryKey: ["/api/website-templates"],
    queryFn: async () => {
      const response = await fetch("/api/website-templates");
      return response.json();
    },
  });

  // Fetch user's website projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery<WebsiteProject[]>({
    queryKey: ["/api/website-projects"],
    queryFn: async () => {
      const response = await fetch("/api/website-projects");
      return response.json();
    },
  });

  // Create website project mutation
  const createProjectMutation = useMutation({
    mutationFn: (projectData: any) => {
      return fetch("/api/website-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      }).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Project Created!",
        description: "Your website project has been submitted. We'll start building it soon!",
      });
      setIsOrderDialogOpen(false);
      setOrderForm({
        title: "",
        description: "",
        businessType: "",
        requirements: "",
        pricing: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/website-projects"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTemplateSelect = (template: WebsiteTemplate) => {
    setSelectedTemplate(template);
    setOrderForm({
      ...orderForm,
      businessType: template.category,
      pricing: template.pricing
    });
    setIsOrderDialogOpen(true);
  };

  const handleSubmitOrder = () => {
    if (!orderForm.title || !orderForm.description || !orderForm.businessType || !orderForm.requirements) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createProjectMutation.mutate(orderForm);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <AlertCircle className="w-4 h-4" />;
      case "in_progress": return <Clock className="w-4 h-4" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "failed": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const portfolioProjects = [
    {
      title: "Elite Barber Shop",
      category: "Hair & Beauty",
      image: "from-red-500 to-orange-600",
      features: ["Online Booking", "Service Showcase", "Gallery", "Mobile Responsive"],
      description: "Modern barber shop with seamless booking system"
    },
    {
      title: "Yoga Studio Pro",
      category: "Fitness & Wellness",
      image: "from-green-500 to-emerald-600",
      features: ["Class Schedules", "Instructor Profiles", "Member Portal", "Payment Integration"],
      description: "Complete wellness platform with member management"
    },
    {
      title: "Smith Photography",
      category: "Creative Services",
      image: "from-purple-500 to-pink-600",
      features: ["Portfolio Gallery", "Client Booking", "Package Pricing", "Contact Forms"],
      description: "Stunning photography portfolio with client portal"
    },
    {
      title: "Downtown Dental",
      category: "Healthcare",
      image: "from-blue-500 to-indigo-600",
      features: ["Appointment Booking", "Service Info", "Insurance Details", "Patient Portal"],
      description: "Professional healthcare website with patient management"
    },
    {
      title: "Coastal Real Estate",
      category: "Real Estate",
      image: "from-yellow-500 to-orange-600",
      features: ["Property Listings", "Agent Profiles", "Search Filters", "Virtual Tours"],
      description: "Comprehensive real estate platform with advanced search"
    },
    {
      title: "The Corner Bistro",
      category: "Restaurant",
      image: "from-indigo-500 to-purple-600",
      features: ["Menu Display", "Reservation System", "Location Info", "Food Gallery"],
      description: "Elegant restaurant website with reservation system"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-tim-green to-green-600 text-white rounded-full mb-6 shadow-lg">
            <Globe className="h-5 w-5 mr-2" />
            <span className="font-semibold">Professional Website Development</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Transform Your Business 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tim-green to-green-600"> Online</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get a stunning, professional website that drives results. From concept to launch, we handle everything.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-tim-green">{projects.length}</div>
              <div className="text-sm text-gray-500">Active Projects</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-tim-green">
                {projects.filter((p: WebsiteProject) => p.status === "completed").length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-tim-green">$1,999</div>
              <div className="text-sm text-gray-500">Fixed Price</div>
            </div>
          </div>
        </div>

        {/* Featured Website Preview */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">See Our Work in Action</h2>
            <p className="text-lg text-gray-600">Experience the quality and functionality of our websites</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 font-medium">LIVE WEBSITE</span>
                </div>
                <h3 className="text-3xl font-bold text-white">Habibi Lounge</h3>
                <p className="text-white/90">Middle Eastern Cuisine & Hookah Bar</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">15+</div>
                  <div className="text-white/80 text-sm">Premium Flavors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-white/80 text-sm">Authentic Dishes</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-gray-900 px-6 py-3 flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1 bg-gray-800 rounded px-4 py-2 text-sm text-white">
                  restaurant-website-preview.com
                </div>
              </div>
              <iframe 
                src="https://hookahlounge.replit.app/"
                className="w-full h-96 border-none"
                title="Habibi Lounge Website"
              />
            </div>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Monitor className="h-4 w-4" />, text: "Responsive Design" },
                { icon: <Zap className="h-4 w-4" />, text: "Real Functionality" },
                { icon: <Crown className="h-4 w-4" />, text: "Premium Quality" },
                { icon: <Play className="h-4 w-4" />, text: "Live Experience" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                  <span className="text-white font-medium text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Showcase */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Portfolio</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore websites we've built for businesses across different industries
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioProjects.map((project, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <div className={`h-48 bg-gradient-to-br ${project.image} p-6 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  <div className="text-center relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-white/90 font-medium">{project.category}</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <Eye className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="space-y-2 mb-6">
                    {project.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-tim-green rounded-full flex items-center justify-center">
                          <CheckCircle className="h-2.5 w-2.5 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-tim-green to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 rounded-xl transition-all duration-200 group-hover:scale-105"
                    onClick={() => setIsOrderDialogOpen(true)}
                  >
                    Get Similar Website
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-tim-green to-green-600 rounded-3xl p-12 text-white shadow-2xl">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 mr-3" />
                <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
              </div>
              <p className="text-xl mb-8 text-white/90">
                Join hundreds of businesses that have transformed their online presence with our expert development
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setIsOrderDialogOpen(true)}
                  size="lg"
                  className="bg-white text-tim-green hover:bg-gray-100 font-bold px-8 py-4 rounded-xl text-lg shadow-lg"
                >
                  Start Your Project
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-tim-green font-bold px-8 py-4 rounded-xl text-lg"
                >
                  View All Templates
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* My Projects Section */}
        {projects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: WebsiteProject) => (
                <Card key={project.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusIcon(project.status)}
                        <span className="ml-1 capitalize">{project.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p><strong>Business Type:</strong> {project.businessType}</p>
                      <p><strong>Price:</strong> ${project.pricing}</p>
                      <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
                    </div>
                    {project.status === "completed" && project.deployedUrl && (
                      <div className="mt-4">
                        <Button 
                          onClick={() => window.open(project.deployedUrl, '_blank')}
                          className="w-full bg-tim-green hover:bg-tim-green/90"
                        >
                          View Website
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Order Dialog */}
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Rocket className="w-5 h-5 text-tim-green" />
                <span>Start Your Website Project</span>
              </DialogTitle>
              <DialogDescription>
                Tell us about your business and we'll create a professional website that drives results.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Website Title *</Label>
                <Input
                  id="title"
                  value={orderForm.title}
                  onChange={(e) => setOrderForm({...orderForm, title: e.target.value})}
                  placeholder="e.g., My Restaurant Website"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Brief Description *</Label>
                <Textarea
                  id="description"
                  value={orderForm.description}
                  onChange={(e) => setOrderForm({...orderForm, description: e.target.value})}
                  placeholder="Describe your business and what your website should accomplish..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="businessType">Business Type *</Label>
                <Select value={orderForm.businessType} onValueChange={(value) => setOrderForm({...orderForm, businessType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                    <SelectItem value="Professional Services">Professional Services</SelectItem>
                    <SelectItem value="Creative">Creative</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="requirements">Specific Requirements *</Label>
                <Textarea
                  id="requirements"
                  value={orderForm.requirements}
                  onChange={(e) => setOrderForm({...orderForm, requirements: e.target.value})}
                  placeholder="List specific features, integrations, or functionality you need..."
                  rows={4}
                />
              </div>
              
              <div className="bg-gradient-to-r from-tim-green/10 to-green-600/10 p-6 rounded-lg border border-tim-green/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">Total Investment:</span>
                  <span className="text-3xl font-bold text-tim-green">$1,999</span>
                </div>
                <p className="text-sm text-gray-600">
                  Fixed price includes design, development, testing, and deployment
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitOrder}
                  disabled={createProjectMutation.isPending}
                  className="bg-tim-green hover:bg-tim-green/90"
                >
                  {createProjectMutation.isPending ? "Creating..." : "Start Project"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}