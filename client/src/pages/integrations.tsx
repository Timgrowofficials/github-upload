import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Zap, 
  CreditCard, 
  Mail, 
  MessageSquare, 
  Calendar,
  BarChart3,
  Users,
  Globe,
  Smartphone,
  Clock,
  Star,
  Settings,
  Plus,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Search
} from "lucide-react";
import Navigation from "@/components/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DatabaseIntegration {
  id: number;
  businessId: number;
  integrationId: string;
  integrationName: string;
  isConnected: boolean;
  configuration: any;
  connectedAt: string;
  lastSyncAt?: string;
  status: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  color: string;
  connected: boolean;
  popular: boolean;
  comingSoon?: boolean;
  features: string[];
  dbIntegration?: DatabaseIntegration;
}

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch connected integrations from database
  const { data: connectedIntegrations = [], isLoading } = useQuery<DatabaseIntegration[]>({
    queryKey: ["/api/integrations"],
  });

  // Connect integration mutation
  const connectMutation = useMutation({
    mutationFn: async ({ integrationId, integrationName }: { integrationId: string; integrationName: string }) => {
      return apiRequest("POST", "/api/integrations/connect", {
        integrationId,
        integrationName,
        configuration: {}
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      toast({
        title: "Integration connected",
        description: "The integration has been successfully connected.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection failed", 
        description: error.message || "Failed to connect the integration.",
        variant: "destructive",
      });
    },
  });

  // Disconnect integration mutation
  const disconnectMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      return apiRequest("POST", "/api/integrations/disconnect", { integrationId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      toast({
        title: "Integration disconnected",
        description: "The integration has been successfully disconnected.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Disconnection failed",
        description: error.message || "Failed to disconnect the integration.",
        variant: "destructive",
      });
    },
  });

  // Helper function to check if an integration is connected
  const isIntegrationConnected = (integrationId: string): DatabaseIntegration | undefined => {
    return connectedIntegrations.find(ci => ci.integrationId === integrationId && ci.isConnected);
  };

  const integrations: Integration[] = [
    // Payment Processing
    {
      id: "stripe",
      name: "Stripe",
      description: "Accept payments online with credit cards, bank transfers, and digital wallets",
      category: "payments",
      icon: CreditCard,
      color: "bg-purple-500",
      connected: !!isIntegrationConnected("stripe"),
      popular: true,
      features: ["Credit card processing", "Recurring payments", "Multi-currency support"],
      dbIntegration: isIntegrationConnected("stripe")
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Popular payment processor for online transactions",
      category: "payments",
      icon: CreditCard,
      color: "bg-blue-500",
      connected: !!isIntegrationConnected("paypal"),
      popular: true,
      features: ["PayPal payments", "PayPal Credit", "Express checkout"],
      dbIntegration: isIntegrationConnected("paypal")
    },
    {
      id: "square",
      name: "Square",
      description: "Point-of-sale and payment processing for in-person transactions",
      category: "payments",
      icon: CreditCard,
      color: "bg-black",
      connected: !!isIntegrationConnected("square"),
      popular: false,
      features: ["In-person payments", "Square POS", "Inventory management"],
      dbIntegration: isIntegrationConnected("square")
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Email marketing and automation platform for customer engagement",
      category: "marketing",
      icon: Mail,
      color: "bg-yellow-500",
      connected: !!isIntegrationConnected("mailchimp"),
      popular: true,
      features: ["Email campaigns", "Automation", "Analytics"],
      dbIntegration: isIntegrationConnected("mailchimp")
    },
    {
      id: "klaviyo",
      name: "Klaviyo",
      description: "Advanced email marketing with personalization and segmentation",
      category: "marketing",
      icon: Mail,
      color: "bg-green-600",
      connected: !!isIntegrationConnected("klaviyo"),
      popular: false,
      features: ["Personalized emails", "SMS marketing", "Advanced segmentation"],
      dbIntegration: isIntegrationConnected("klaviyo")
    },
    {
      id: "twiliosms",
      name: "Twilio SMS",
      description: "Send SMS notifications and reminders to your clients",
      category: "communication",
      icon: MessageSquare,
      color: "bg-red-500",
      connected: !!isIntegrationConnected("twiliosms"),
      popular: true,
      features: ["SMS notifications", "Two-way messaging", "Global delivery"],
      dbIntegration: isIntegrationConnected("twiliosms")
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      description: "Connect with clients through WhatsApp messaging",
      category: "communication",
      icon: MessageSquare,
      color: "bg-green-500",
      connected: !!isIntegrationConnected("whatsapp"),
      popular: true,
      comingSoon: true,
      features: ["WhatsApp messaging", "Rich media", "Business profiles"],
      dbIntegration: isIntegrationConnected("whatsapp")
    },
    {
      id: "googlecalendar",
      name: "Google Calendar",
      description: "Sync appointments with Google Calendar for better scheduling",
      category: "calendar",
      icon: Calendar,
      color: "bg-blue-600",
      connected: !!isIntegrationConnected("googlecalendar"),
      popular: true,
      features: ["Two-way sync", "Meeting links", "Availability sharing"],
      dbIntegration: isIntegrationConnected("googlecalendar")
    },
    {
      id: "outlook",
      name: "Outlook Calendar",
      description: "Integrate with Microsoft Outlook and Office 365",
      category: "calendar",
      icon: Calendar,
      color: "bg-blue-700",
      connected: !!isIntegrationConnected("outlook"),
      popular: false,
      features: ["Calendar sync", "Teams integration", "Office 365 compatibility"],
      dbIntegration: isIntegrationConnected("outlook")
    },
    {
      id: "zoom",
      name: "Zoom",
      description: "Automatically create Zoom meetings for virtual appointments",
      category: "meetings",
      icon: Globe,
      color: "bg-blue-500",
      connected: !!isIntegrationConnected("zoom"),
      popular: true,
      features: ["Auto meeting creation", "Calendar integration", "Recording"],
      dbIntegration: isIntegrationConnected("zoom")
    },
    {
      id: "googleanalytics",
      name: "Google Analytics",
      description: "Track website performance and client behavior",
      category: "analytics",
      icon: BarChart3,
      color: "bg-orange-500",
      connected: !!isIntegrationConnected("googleanalytics"),
      popular: true,
      features: ["Website analytics", "Conversion tracking", "Custom reports"]
    },
    {
      id: "facebook",
      name: "Facebook Business",
      description: "Manage Facebook page and advertising campaigns",
      category: "social",
      icon: Users,
      color: "bg-blue-600",
      connected: false,
      popular: true,
      features: ["Page management", "Facebook ads", "Messenger integration"]
    },
    {
      id: "instagram",
      name: "Instagram Business",
      description: "Connect your Instagram business account",
      category: "social",
      icon: Users,
      color: "bg-pink-500",
      connected: false,
      popular: true,
      features: ["Post scheduling", "Story management", "Instagram shopping"]
    },
    {
      id: "quickbooks",
      name: "QuickBooks",
      description: "Sync financial data with QuickBooks accounting software",
      category: "accounting",
      icon: BarChart3,
      color: "bg-green-600",
      connected: false,
      popular: false,
      features: ["Invoice sync", "Expense tracking", "Financial reporting"]
    },
    // Additional Payment Processors
    {
      id: "authorize-net",
      name: "Authorize.Net",
      description: "Secure payment gateway for credit card processing",
      category: "payments",
      icon: CreditCard,
      color: "bg-blue-700",
      connected: false,
      popular: false,
      features: ["Credit card processing", "Fraud protection", "Recurring billing"]
    },
    {
      id: "clover",
      name: "Clover",
      description: "All-in-one payment and point-of-sale system",
      category: "payments",
      icon: CreditCard,
      color: "bg-green-700",
      connected: false,
      popular: false,
      features: ["POS integration", "Inventory management", "Employee management"]
    },
    // More Communication Tools
    {
      id: "slack",
      name: "Slack",
      description: "Team communication and collaboration platform",
      category: "communication",
      icon: MessageSquare,
      color: "bg-purple-600",
      connected: false,
      popular: true,
      features: ["Team messaging", "File sharing", "Workflow automation"]
    },
    {
      id: "microsoft-teams",
      name: "Microsoft Teams",
      description: "Video meetings and team collaboration",
      category: "meetings",
      icon: Globe,
      color: "bg-purple-700",
      connected: false,
      popular: true,
      features: ["Video conferencing", "Screen sharing", "File collaboration"]
    },
    {
      id: "google-meet",
      name: "Google Meet",
      description: "Simple video conferencing from Google",
      category: "meetings",
      icon: Globe,
      color: "bg-red-600",
      connected: false,
      popular: true,
      features: ["HD video calls", "Screen sharing", "Live captions"]
    },
    // Marketing & CRM
    {
      id: "hubspot",
      name: "HubSpot",
      description: "Complete CRM and marketing automation platform",
      category: "marketing",
      icon: Users,
      color: "bg-orange-600",
      connected: false,
      popular: true,
      features: ["CRM integration", "Lead tracking", "Marketing automation"]
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "World's leading CRM platform",
      category: "marketing",
      icon: Users,
      color: "bg-blue-500",
      connected: false,
      popular: false,
      features: ["Customer management", "Sales pipeline", "Advanced analytics"]
    },
    {
      id: "constant-contact",
      name: "Constant Contact",
      description: "Email marketing for small businesses",
      category: "marketing",
      icon: Mail,
      color: "bg-blue-600",
      connected: false,
      popular: false,
      features: ["Email templates", "Contact management", "Event marketing"]
    },
    // More Accounting Software
    {
      id: "xero",
      name: "Xero",
      description: "Beautiful accounting software for small business",
      category: "accounting",
      icon: BarChart3,
      color: "bg-teal-600",
      connected: false,
      popular: true,
      features: ["Cloud accounting", "Bank reconciliation", "Expense claims"]
    },
    {
      id: "freshbooks",
      name: "FreshBooks",
      description: "Simple accounting and time tracking",
      category: "accounting",
      icon: BarChart3,
      color: "bg-green-500",
      connected: false,
      popular: false,
      features: ["Time tracking", "Project management", "Client portal"]
    },
    // Review Management
    {
      id: "google-reviews",
      name: "Google Reviews",
      description: "Manage and respond to Google Business reviews",
      category: "reviews",
      icon: Star,
      color: "bg-yellow-500",
      connected: false,
      popular: true,
      features: ["Review monitoring", "Response management", "Reputation tracking"]
    },
    {
      id: "yelp",
      name: "Yelp for Business",
      description: "Manage your Yelp business listing and reviews",
      category: "reviews",
      icon: Star,
      color: "bg-red-600",
      connected: false,
      popular: true,
      features: ["Business listing", "Review responses", "Customer insights"]
    },
    {
      id: "trustpilot",
      name: "Trustpilot",
      description: "Collect and manage customer reviews",
      category: "reviews",
      icon: Star,
      color: "bg-blue-500",
      connected: false,
      popular: false,
      features: ["Review collection", "Review widgets", "Business insights"]
    },
    // Automation & Productivity
    {
      id: "zapier",
      name: "Zapier",
      description: "Automate workflows between your favorite apps",
      category: "automation",
      icon: Zap,
      color: "bg-orange-500",
      connected: false,
      popular: true,
      features: ["Workflow automation", "App connections", "Custom triggers"]
    },
    {
      id: "ifttt",
      name: "IFTTT",
      description: "Connect your apps and devices with simple automation",
      category: "automation",
      icon: Zap,
      color: "bg-black",
      connected: false,
      popular: false,
      features: ["Simple automation", "Device integration", "Social media automation"]
    },
    // E-commerce
    {
      id: "shopify",
      name: "Shopify",
      description: "Complete e-commerce platform for online stores",
      category: "ecommerce",
      icon: Globe,
      color: "bg-green-600",
      connected: false,
      popular: true,
      features: ["Online store", "Product management", "Order processing"]
    },
    {
      id: "woocommerce",
      name: "WooCommerce",
      description: "Customizable e-commerce for WordPress",
      category: "ecommerce",
      icon: Globe,
      color: "bg-purple-600",
      connected: false,
      popular: false,
      features: ["WordPress integration", "Custom themes", "Flexible payments"]
    },
    // Industry-Specific
    {
      id: "mindbody",
      name: "MINDBODY",
      description: "Wellness and fitness business management",
      category: "industry",
      icon: Users,
      color: "bg-purple-500",
      connected: false,
      popular: false,
      comingSoon: true,
      features: ["Class scheduling", "Membership management", "Wellness focus"]
    },
    {
      id: "fresha",
      name: "Fresha",
      description: "Beauty and wellness marketplace",
      category: "industry",
      icon: Users,
      color: "bg-pink-600",
      connected: false,
      popular: false,
      features: ["Salon management", "Beauty booking", "Client records"]
    }
  ];

  const categories = [
    { id: "all", name: "All Integrations", count: integrations.length },
    { id: "payments", name: "Payments", count: integrations.filter(i => i.category === "payments").length },
    { id: "marketing", name: "Marketing", count: integrations.filter(i => i.category === "marketing").length },
    { id: "communication", name: "Communication", count: integrations.filter(i => i.category === "communication").length },
    { id: "calendar", name: "Calendar", count: integrations.filter(i => i.category === "calendar").length },
    { id: "meetings", name: "Video Meetings", count: integrations.filter(i => i.category === "meetings").length },
    { id: "analytics", name: "Analytics", count: integrations.filter(i => i.category === "analytics").length },
    { id: "social", name: "Social Media", count: integrations.filter(i => i.category === "social").length },
    { id: "accounting", name: "Accounting", count: integrations.filter(i => i.category === "accounting").length },
    { id: "reviews", name: "Reviews", count: integrations.filter(i => i.category === "reviews").length },
    { id: "automation", name: "Automation", count: integrations.filter(i => i.category === "automation").length },
    { id: "ecommerce", name: "E-commerce", count: integrations.filter(i => i.category === "ecommerce").length },
    { id: "industry", name: "Industry-Specific", count: integrations.filter(i => i.category === "industry").length },
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = searchTerm === "" || 
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const connectedCount = integrations.filter(i => i.connected).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-6">
        {/* Page Header */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-tim-green to-green-600 rounded-full flex items-center justify-center">
                  <Zap className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                Integrations
              </h1>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Connect your favorite tools and automate your workflow</p>
            </div>
            <div className="text-right">
              <div className="text-lg md:text-xl font-bold text-tim-green">{connectedCount}</div>
              <div className="text-xs text-gray-500">Connected</div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
              <CardContent className="p-3 md:p-4">
                <div className="text-lg md:text-xl font-bold text-green-600">{connectedCount}</div>
                <p className="text-xs text-green-600">Active</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200">
              <CardContent className="p-3 md:p-4">
                <div className="text-lg md:text-xl font-bold text-blue-600">{integrations.length - connectedCount}</div>
                <p className="text-xs text-blue-600">Available</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
              <CardContent className="p-3 md:p-4">
                <div className="text-lg md:text-xl font-bold text-purple-600">{categories.length - 1}</div>
                <p className="text-xs text-purple-600">Categories</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200">
              <CardContent className="p-3 md:p-4">
                <div className="text-lg md:text-xl font-bold text-orange-600">{integrations.filter(i => i.popular).length}</div>
                <p className="text-xs text-orange-600">Popular</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-4 md:mb-6">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                  className="text-xs"
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integrations Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="shadow-sm animate-pulse">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="w-16 h-5 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredIntegrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <Card key={integration.id} className="shadow-sm hover:shadow-md transition-shadow mobile-card">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 md:w-12 md:h-12 ${integration.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base flex items-center gap-2">
                          {integration.name}
                          {integration.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                          {integration.comingSoon && <Badge variant="outline" className="text-xs">Coming Soon</Badge>}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          {integration.connected ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              <span className="text-xs font-medium">Connected</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-500">
                              <AlertCircle className="h-3 w-3" />
                              <span className="text-xs">Not connected</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">{integration.description}</p>
                  
                  <div className="space-y-2 mb-3 md:mb-4">
                    <div className="text-xs font-medium text-gray-700">Key Features:</div>
                    <ul className="space-y-1">
                      {integration.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    {integration.connected ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="h-3 w-3 mr-2" />
                          Configure
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => disconnectMutation.mutate(integration.id)}
                          disabled={disconnectMutation.isPending}
                        >
                          {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
                        </Button>
                      </>
                    ) : integration.comingSoon ? (
                      <Button disabled size="sm" className="flex-1">
                        Coming Soon
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1 bg-tim-green hover:bg-green-600" 
                        size="sm"
                        onClick={() => connectMutation.mutate({ 
                          integrationId: integration.id, 
                          integrationName: integration.name 
                        })}
                        disabled={connectMutation.isPending}
                      >
                        {connectMutation.isPending ? (
                          "Connecting..."
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        )}

        {!isLoading && filteredIntegrations.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No integrations found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filters to find the integration you need
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Request Integration */}
        <Card className="mt-6 md:mt-8 bg-gradient-to-r from-tim-green/10 to-green-100 border-tim-green/20">
          <CardContent className="p-4 md:p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need a specific integration?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Don't see the tool you need? Let us know and we'll consider adding it to our roadmap.
            </p>
            <Button className="bg-tim-green hover:bg-green-600">
              <Plus className="h-4 w-4 mr-2" />
              Request Integration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}