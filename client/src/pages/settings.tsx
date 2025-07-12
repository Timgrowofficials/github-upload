import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Clock,
  Globe,
  CreditCard,
  LogOut,
  Save,
  Edit,
  Zap,
  ChevronRight,
  Share2
} from "lucide-react";
import Navigation from "@/components/navigation";
import { Link } from "wouter";

function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });

  const [businessHours, setBusinessHours] = useState({
    monday: { open: "09:00", close: "17:00", closed: false },
    tuesday: { open: "09:00", close: "17:00", closed: false },
    wednesday: { open: "09:00", close: "17:00", closed: false },
    thursday: { open: "09:00", close: "17:00", closed: false },
    friday: { open: "09:00", close: "17:00", closed: false },
    saturday: { open: "10:00", close: "16:00", closed: false },
    sunday: { open: "12:00", close: "16:00", closed: true }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16 md:pb-0">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-tim-green to-green-600 rounded-full flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your account and business preferences</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Header with Avatar and Status - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-16 sm:h-16 bg-gradient-to-br from-tim-green to-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white text-2xl sm:text-xl font-bold">S</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl sm:text-lg font-bold text-gray-900">SAHIL</h3>
                  <p className="text-sm text-gray-600 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <Shield className="h-3 w-3" />
                    Professional Dashboard
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Premium</span>
                  </p>
                </div>
                <Button size="sm" className="bg-tim-green hover:bg-green-600 w-full sm:w-auto min-h-[44px]">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              
              {/* Profile Information Form - Mobile Optimized */}
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-base font-medium">First Name</Label>
                    <Input id="firstName" defaultValue="Sahil" className="min-h-[48px] text-base" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-base font-medium">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" className="min-h-[48px] text-base" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                  <Input id="email" type="email" defaultValue="infotimgrow@gmail.com" className="min-h-[48px] text-base" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-base font-medium">Phone Number</Label>
                  <Input id="phone" placeholder="+1 (555) 123-4567" className="min-h-[48px] text-base" />
                </div>
                <div>
                  <Label htmlFor="business-name" className="text-base font-medium">Business Name</Label>
                  <Input id="business-name" defaultValue="SAHIL" className="min-h-[48px] text-base" />
                </div>
              </div>
              <Button className="bg-tim-green hover:bg-green-600 min-h-[48px] text-base font-medium">
                <Save className="h-5 w-5 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Business Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Business Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="businessName" className="text-base font-medium">Business Name</Label>
                <Input id="businessName" placeholder="Your Business Name" className="min-h-[48px] text-base" />
              </div>
              <div>
                <Label htmlFor="businessAddress" className="text-base font-medium">Business Address</Label>
                <Input id="businessAddress" placeholder="123 Business St, City, State" className="min-h-[48px] text-base" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessPhone" className="text-base font-medium">Business Phone</Label>
                  <Input id="businessPhone" placeholder="+1 (555) 123-4567" className="min-h-[48px] text-base" />
                </div>
                <div>
                  <Label htmlFor="businessEmail" className="text-base font-medium">Business Email</Label>
                  <Input id="businessEmail" type="email" placeholder="contact@business.com" className="min-h-[48px] text-base" />
                </div>
              </div>
              <Button className="bg-tim-green hover:bg-green-600 min-h-[48px] text-base font-medium">
                <Save className="h-5 w-5 mr-2" />
                Save Business Info
              </Button>
            </CardContent>
          </Card>

          {/* Client Dashboard Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Client Dashboard Customization
              </CardTitle>
              <p className="text-sm text-gray-600">
                Customize how your clients see their dashboard and booking experience
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-base">Client Portal Design</h4>
                    <p className="text-sm text-gray-600">Customize colors, layout, and branding for your client dashboard</p>
                  </div>
                  <div className="px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-full whitespace-nowrap">
                    Available
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <Link href="/client-customization">
                <Button className="w-full bg-tim-green hover:bg-green-600 text-white">
                  <Palette className="h-4 w-4 mr-2" />
                  Customize Client Dashboard
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(businessHours).map(([day, hours]) => (
                <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center justify-between sm:justify-start gap-4 flex-1">
                    <span className="w-24 text-sm font-medium capitalize">{day}</span>
                    <Switch
                      checked={!hours.closed}
                      onCheckedChange={(checked) =>
                        setBusinessHours(prev => ({
                          ...prev,
                          [day]: { ...prev[day as keyof typeof prev], closed: !checked }
                        }))
                      }
                      className="min-h-[24px]"
                    />
                  </div>
                  {!hours.closed && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Input
                        type="time"
                        value={hours.open}
                        className="w-32 sm:w-24 min-h-[44px] text-base"
                        onChange={(e) =>
                          setBusinessHours(prev => ({
                            ...prev,
                            [day]: { ...prev[day as keyof typeof prev], open: e.target.value }
                          }))
                        }
                      />
                      <span className="text-gray-400 text-sm px-1">to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        className="w-32 sm:w-24 min-h-[44px] text-base"
                        onChange={(e) =>
                          setBusinessHours(prev => ({
                            ...prev,
                            [day]: { ...prev[day as keyof typeof prev], close: e.target.value }
                          }))
                        }
                      />
                    </div>
                  )}
                  {hours.closed && (
                    <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">Closed</span>
                  )}
                </div>
              ))}
              <Button className="bg-tim-green hover:bg-green-600">
                <Save className="h-4 w-4 mr-2" />
                Save Hours
              </Button>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Integrations & Apps
              </CardTitle>
              <p className="text-sm text-gray-600">
                Connect your favorite business tools and apps to streamline your workflow
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {/* Popular Integrations Preview - Mobile Optimized */}
                <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center shrink-0">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-base">Payment Processing</h4>
                      <p className="text-sm text-gray-600">Stripe, PayPal, Square & more</p>
                    </div>
                    <div className="px-3 py-2 bg-green-100 text-green-800 text-sm rounded-full whitespace-nowrap">
                      2 Connected
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-base">Calendar & Meetings</h4>
                      <p className="text-sm text-gray-600">Google Calendar, Zoom, Teams</p>
                    </div>
                    <div className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-full whitespace-nowrap">
                      0 Connected
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-base">Marketing & CRM</h4>
                      <p className="text-sm text-gray-600">Mailchimp, HubSpot, Salesforce</p>
                    </div>
                    <div className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-full whitespace-nowrap">
                      0 Connected
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-base">Automation</h4>
                      <p className="text-sm text-gray-600">Zapier, IFTTT & workflows</p>
                    </div>
                    <div className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-full whitespace-nowrap">
                      0 Connected
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <Link href="/integrations">
                <Button className="w-full bg-tim-green hover:bg-green-600 text-white">
                  <Zap className="h-4 w-4 mr-2" />
                  View All Integrations (30+)
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-3">
                <div className="flex-1">
                  <Label htmlFor="email-notifications" className="text-base font-medium">Email Notifications</Label>
                  <p className="text-sm text-gray-600 mt-1">Receive booking confirmations and updates via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, email: checked }))
                  }
                  className="min-h-[24px] self-start"
                />
              </div>
              <Separator />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-3">
                <div className="flex-1">
                  <Label htmlFor="sms-notifications" className="text-base font-medium">SMS Notifications</Label>
                  <p className="text-sm text-gray-600 mt-1">Get text messages for urgent updates</p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, sms: checked }))
                  }
                  className="min-h-[24px] self-start"
                />
              </div>
              <Separator />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-3">
                <div className="flex-1">
                  <Label htmlFor="push-notifications" className="text-base font-medium">Push Notifications</Label>
                  <p className="text-sm text-gray-600 mt-1">Browser notifications for real-time updates</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, push: checked }))
                  }
                  className="min-h-[24px] self-start"
                />
              </div>
              <Separator />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-3">
                <div className="flex-1">
                  <Label htmlFor="marketing-notifications" className="text-base font-medium">Marketing Communications</Label>
                  <p className="text-sm text-gray-600 mt-1">Receive tips, updates, and promotional content</p>
                </div>
                <Switch
                  id="marketing-notifications"
                  checked={notifications.marketing}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, marketing: checked }))
                  }
                  className="min-h-[24px] self-start"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Edit className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                Privacy Settings
              </Button>
            </CardContent>
          </Card>

          {/* Billing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-tim-green/10 border border-tim-green/20 rounded-lg p-4">
                <h3 className="font-semibold text-tim-green mb-2">Professional Plan - $5/user/month</h3>
                <p className="text-sm text-gray-600">Unlimited bookings, advanced analytics, custom branding, and 24/7 support</p>
                <p className="text-sm text-gray-500 mt-1">Next billing: January 15, 2025</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  View Billing History
                </Button>
                <Button variant="outline" className="flex-1">
                  Update Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 flex-1">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 flex-1">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;