import { 
  Calendar, 
  Users, 
  Smartphone, 
  BarChart, 
  Bell, 
  Shield, 
  Globe, 
  Star, 
  Palette, 
  CheckCircle, 
  Clock, 
  Zap, 
  CreditCard,
  MessageSquare,
  MapPin,
  Video,
  Repeat,
  TrendingUp,
  FileText,
  Mail,
  Monitor,
  Link,
  Settings,
  ArrowRight,
  Sparkles,
  MousePointer,
  Layers,
  Eye,
  Target,
  Sliders,
  BarChart3,
  PieChart,
  LineChart,
  Award,
  Headphones,
  Wifi,
  RefreshCw,
  Database,
  Lock,
  Cloud,
  Tablet,
  Crown,
  ExternalLink,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link as WouterLink, useLocation } from "wouter";
import { useState } from "react";

export default function Features() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const featureSections = [
    {
      title: "Time to get seen",
      subtitle: "Build your online presence and make booking effortless for your clients",
      features: [
        {
          icon: <Calendar className="h-6 w-6" />,
          title: "All-in-one Calendar",
          description: "Book 1:1s or group classes in just a few clicks, on desktop, tablet or mobile.",
          href: "/features/calendar"
        },
        {
          icon: <Globe className="h-6 w-6" />,
          title: "Your Booking Page",
          description: "Empower your customers to self-book their appointments 24/7.",
          href: "/features/booking-page"
        },
        {
          icon: <Star className="h-6 w-6" />,
          title: "Reviews & Ratings",
          description: "Display testimonials from happy customers to encourage new bookings.",
          href: "/features/reviews"
        },
        {
          icon: <CreditCard className="h-6 w-6" />,
          title: "Secure Online Payments",
          description: "Take digital, credit and debit card payments ahead of appointments.",
          href: "/features/payments"
        }
      ]
    },
    {
      title: "Make the world your stage",
      subtitle: "Get yourself out there and create connections across channels",
      features: [
        {
          icon: <Link className="h-6 w-6" />,
          title: "Website Integration",
          description: "Enable people to book appointments independently from any site page.",
          href: "/features/website-widgets"
        },
        {
          icon: <Smartphone className="h-6 w-6" />,
          title: "Social Media Booking",
          description: "Add convenient 'Book now' buttons to Facebook, Instagram and social profiles.",
          href: "/features/social-booking"
        },
        {
          icon: <MapPin className="h-6 w-6" />,
          title: "QR Code Booking",
          description: "One scan with a smartphone camera and your booking page appears instantly.",
          href: "/features/qr-codes"
        },
        {
          icon: <Video className="h-6 w-6" />,
          title: "Virtual Meetings",
          description: "Reach a global audience with your services, no travel necessary.",
          href: "/features/virtual-meetings"
        },
        {
          icon: <Monitor className="h-6 w-6" />,
          title: "Your Branded App",
          description: "Let customers book appointments easily from their personalized mobile app.",
          href: "/features/branded-app"
        },
        {
          icon: <TrendingUp className="h-6 w-6" />,
          title: "Google My Business",
          description: "Appear in local searches and let customers book directly from Google.",
          href: "/features/google-booking"
        }
      ]
    },
    {
      title: "Nice knowin' ya, paperwork",
      subtitle: "Give customers your undivided attention while we handle the follow-ups",
      features: [
        {
          icon: <CheckCircle className="h-6 w-6" />,
          title: "Automatic Confirmations",
          description: "Enable instant email confirmations with all booking details, for staff and customers.",
          href: "/features/confirmations"
        },
        {
          icon: <Mail className="h-6 w-6" />,
          title: "Email Reminders",
          description: "Automate booking updates and reminders, straight to your customers' inboxes.",
          href: "/features/email-reminders"
        },
        {
          icon: <MessageSquare className="h-6 w-6" />,
          title: "SMS Notifications",
          description: "No more no-shows: Send customized SMS reminders for upcoming bookings.",
          href: "/features/sms-reminders"
        },
        {
          icon: <FileText className="h-6 w-6" />,
          title: "Automated Follow-ups",
          description: "Send thank you messages and feedback requests automatically after appointments.",
          href: "/features/follow-ups"
        }
      ]
    },
    {
      title: "Online scheduling for one-and-all",
      subtitle: "Let customers book multiple appointments and give your team full control",
      features: [
        {
          icon: <Repeat className="h-6 w-6" />,
          title: "Recurring Appointments",
          description: "Create appointment series to offer VIP clients priority spots in your calendar.",
          href: "/features/recurring"
        },
        {
          icon: <Users className="h-6 w-6" />,
          title: "Group Booking",
          description: "The more, the merrier: Take seat reservations for group events and classes.",
          href: "/features/group-booking"
        },
        {
          icon: <Settings className="h-6 w-6" />,
          title: "Staff Management",
          description: "Enable team members to manage their own bookings across locations.",
          href: "/features/staff-scheduling"
        },
        {
          icon: <Clock className="h-6 w-6" />,
          title: "Advanced Availability",
          description: "Set complex availability rules, buffer times, and break scheduling.",
          href: "/features/availability"
        }
      ]
    },
    {
      title: "Access your calendar anywhere",
      subtitle: "Keep multiple calendars in sync and connect with customers on-the-go",
      features: [
        {
          icon: <Calendar className="h-6 w-6" />,
          title: "Calendar Sync",
          description: "Align different calendars by importing events to Tim Grow and vice versa.",
          href: "/features/calendar-sync"
        },
        {
          icon: <Smartphone className="h-6 w-6" />,
          title: "Mobile Apps",
          description: "Manage all team calendars and customer details from iOS and Android apps.",
          href: "/features/mobile-apps"
        },
        {
          icon: <Monitor className="h-6 w-6" />,
          title: "Desktop Application",
          description: "Get the latest view of all team schedules - available for Windows and Mac.",
          href: "/features/desktop-app"
        },
        {
          icon: <Bell className="h-6 w-6" />,
          title: "Real-time Notifications",
          description: "Receive instant notifications on desktop, tablet and mobile devices.",
          href: "/features/notifications"
        }
      ]
    },
    {
      title: "Business intelligence & insights",
      subtitle: "Make data-driven decisions with powerful analytics and reporting",
      features: [
        {
          icon: <BarChart className="h-6 w-6" />,
          title: "Advanced Analytics",
          description: "Track revenue, booking trends, client behavior and business performance.",
          href: "/features/analytics"
        },
        {
          icon: <TrendingUp className="h-6 w-6" />,
          title: "Revenue Tracking",
          description: "Monitor income streams, popular services, and financial growth metrics.",
          href: "/features/revenue"
        },
        {
          icon: <Users className="h-6 w-6" />,
          title: "Client Insights",
          description: "Understand customer preferences, booking patterns, and lifetime value.",
          href: "/features/client-insights"
        },
        {
          icon: <Shield className="h-6 w-6" />,
          title: "Performance Reports",
          description: "Generate detailed reports for business optimization and tax purposes.",
          href: "/features/reports"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <WouterLink href="/">
              <div className="flex items-center cursor-pointer">
                <div className="text-2xl font-bold">
                  <span className="text-black">Tim</span>
                  <span className="text-tim-green">Grow</span>
                  <span className="text-red-500">.</span>
                </div>
              </div>
            </WouterLink>
            
            <div className="hidden md:flex items-center space-x-8">
              <WouterLink href="/features" className="text-tim-green font-semibold">Features</WouterLink>
              <WouterLink href="/pricing" className="text-gray-700 hover:text-tim-green transition-colors">Pricing</WouterLink>
              <WouterLink href="/color-generator" className="text-gray-700 hover:text-tim-green transition-colors">Color Generator</WouterLink>
              <WouterLink href="/book/demo" className="text-gray-700 hover:text-tim-green transition-colors">Demo</WouterLink>
              <Button variant="ghost" className="text-tim-navy hover:bg-tim-green/10">
                <a href="/api/login">Sign In</a>
              </Button>
              <Button 
                onClick={() => setLocation("/dashboard")}
                className="bg-gradient-to-r from-tim-green to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <WouterLink href="/features" className="block px-3 py-2 text-tim-green font-semibold">Features</WouterLink>
              <WouterLink href="/pricing" className="block px-3 py-2 text-gray-600 hover:text-tim-green font-medium">Pricing</WouterLink>
              <WouterLink href="/color-generator" className="block px-3 py-2 text-gray-600 hover:text-tim-green font-medium">Color Generator</WouterLink>
              <WouterLink href="/book/demo" className="block px-3 py-2 text-gray-600 hover:text-tim-green font-medium">Demo</WouterLink>
              <div className="pt-2 space-y-2">
                <Button variant="ghost" className="w-full justify-start text-tim-navy">
                  <a href="/api/login">Sign In</a>
                </Button>
                <Button 
                  onClick={() => setLocation("/dashboard")}
                  className="w-full bg-gradient-to-r from-tim-green to-green-600 text-white font-semibold"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 sm:pb-16 lg:pb-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Floating Feature Cards - Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Calendar Feature Card */}
            <div className="absolute top-20 left-4 sm:left-8 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center transform rotate-12 animate-pulse">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
            
            {/* Notification Card */}
            <div className="absolute top-32 right-6 sm:right-12 w-16 h-12 sm:w-20 sm:h-16 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center transform -rotate-6 animate-bounce">
              <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
            
            {/* Analytics Card */}
            <div className="absolute bottom-40 left-8 sm:left-16 w-14 h-14 sm:w-18 sm:h-18 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center transform rotate-6">
              <BarChart className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500" />
            </div>
            
            {/* Mobile Card */}
            <div className="absolute bottom-32 right-12 sm:right-20 w-12 h-16 sm:w-16 sm:h-20 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center transform -rotate-12">
              <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-500" />
            </div>

            {/* Payment Card - hidden on mobile */}
            <div className="hidden sm:block absolute top-40 left-1/3 w-14 h-14 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center transform rotate-3">
              <CreditCard className="h-6 w-6 text-emerald-500" />
            </div>
          </div>

          <div className="text-center relative z-10">
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full mb-8 shadow-lg">
              <Sparkles className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-sm font-semibold text-blue-900">Comprehensive Feature Suite</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight px-4">
              Features to make bookings{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                extraordinary
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
              A meaningful and memorable experience starts with a connection. Explore how Tim Grow's features help you reach a wider audience, share what you do best and keep customers coming back.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button 
                onClick={() => setLocation("/dashboard")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                Start Free Trial
                <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg transition-all duration-300 w-full sm:w-auto"
              >
                Watch Demo
                <Eye className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 pointer-events-none"></div>
      </section>

      {/* Calendar & Booking Visual Section */}
      <section className="py-12 sm:py-16 lg:py-20 xl:py-32 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-semibold text-blue-900">Smart Scheduling</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Time to get{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  seen
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Customize your online booking experience with intelligent scheduling, automated confirmations, and seamless payment processing that turns visitors into customers.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { icon: <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />, title: "Smart Calendar", desc: "AI-powered scheduling optimization" },
                  { icon: <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />, title: "Instant Payments", desc: "Secure payment processing" },
                  { icon: <Star className="h-5 w-5 sm:h-6 sm:w-6" />, title: "Review System", desc: "Build trust with testimonials" },
                  { icon: <Globe className="h-5 w-5 sm:h-6 sm:w-6" />, title: "24/7 Booking", desc: "Never miss an opportunity" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 sm:p-0">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Visual - Calendar Mockup */}
            <div className="relative mt-8 lg:mt-0">
              <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100 max-w-md mx-auto lg:max-w-none">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">March 2025</h3>
                  <div className="flex space-x-2">
                    <button className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-blue-600 transform rotate-180" />
                    </button>
                    <button className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                    </button>
                  </div>
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 6;
                    const isCurrentMonth = day > 0 && day <= 31;
                    const hasBooking = [10, 15, 22, 28].includes(day);
                    const isSelected = day === 15;
                    
                    return (
                      <div
                        key={i}
                        className={`aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer transition-all ${
                          isCurrentMonth
                            ? isSelected
                              ? 'bg-blue-600 text-white'
                              : hasBooking
                              ? 'bg-green-100 text-green-700 font-semibold'
                              : 'text-gray-700 hover:bg-gray-100'
                            : 'text-gray-300'
                        }`}
                      >
                        {isCurrentMonth ? day : ''}
                        {hasBooking && !isSelected && (
                          <div className="absolute w-1 h-1 bg-green-500 rounded-full mt-4"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Time Slots */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Available Times</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM', '5:00 PM'].map((time, index) => (
                      <button
                        key={time}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          index === 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Booking Cards - hidden on small screens */}
              <div className="hidden sm:block absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-3 sm:p-4 border border-gray-100 transform rotate-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Booking Confirmed</p>
                    <p className="text-xs text-gray-600">Sarah M. - 10:30 AM</p>
                  </div>
                </div>
              </div>
              
              <div className="hidden sm:block absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-3 sm:p-4 border border-gray-100 transform -rotate-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Reminder Sent</p>
                    <p className="text-xs text-gray-600">Next appointment in 2 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics & Insights Visual Section */}
      <section className="py-12 sm:py-16 lg:py-20 xl:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Visual - Analytics Dashboard */}
            <div className="relative order-2 lg:order-1">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-gray-900">Business Analytics</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { title: 'Revenue', value: '$12,450', change: '+23%', color: 'green' },
                    { title: 'Bookings', value: '89', change: '+12%', color: 'blue' },
                    { title: 'Clients', value: '156', change: '+8%', color: 'purple' }
                  ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-xs text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-xs font-semibold ${stat.color === 'green' ? 'text-green-600' : stat.color === 'blue' ? 'text-blue-600' : 'text-purple-600'}`}>
                        {stat.change}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Chart Visualization */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-900">Revenue Trend</h4>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">This Month</span>
                    </div>
                  </div>
                  <div className="h-32 relative">
                    {/* Simplified chart bars */}
                    <div className="flex items-end justify-between h-full space-x-1">
                      {[40, 65, 45, 80, 60, 90, 75].map((height, index) => (
                        <div key={index} className="flex-1 max-w-8">
                          <div 
                            className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Insight Cards */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Peak Hours</p>
                    <p className="text-xs text-gray-600">2PM - 4PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full">
                <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-sm font-semibold text-purple-900">Business Intelligence</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Data-driven{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  decisions
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Gain powerful insights into your business performance with real-time analytics, revenue tracking, and customer behavior patterns that help you optimize and grow.
              </p>
              
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {[
                  { icon: <PieChart className="h-5 w-5 sm:h-6 sm:w-6" />, title: "Revenue Analytics", desc: "Track income streams and identify your most profitable services" },
                  { icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />, title: "Client Insights", desc: "Understand booking patterns and customer lifetime value" },
                  { icon: <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />, title: "Growth Tracking", desc: "Monitor business performance and forecast trends" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-purple-600 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{item.title}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Sections */}
      {featureSections.slice(2).map((section, sectionIndex) => (
        <section key={sectionIndex} className={`py-16 lg:py-24 ${sectionIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                {section.title}
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                {section.subtitle}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {section.features.map((feature, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 cursor-pointer transform hover:scale-105"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Mobile App Showcase Section */}
      <section className="py-12 sm:py-16 lg:py-20 xl:py-32 bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full">
                <Smartphone className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="text-sm font-semibold text-indigo-900">Mobile Experience</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Access your calendar{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  anywhere
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Receive instant notifications on desktop, tablet and mobile. Keep multiple calendars in sync and connect with customers on-the-go with our native apps.
              </p>
              
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {[
                  { icon: <Smartphone className="h-5 w-5 sm:h-6 sm:w-6" />, title: "Native Mobile Apps", desc: "iOS and Android apps with full feature parity" },
                  { icon: <Wifi className="h-5 w-5 sm:h-6 sm:w-6" />, title: "Real-time Sync", desc: "Instant updates across all your devices" },
                  { icon: <Bell className="h-5 w-5 sm:h-6 sm:w-6" />, title: "Push Notifications", desc: "Never miss a booking or important update" },
                  { icon: <Cloud className="h-5 w-5 sm:h-6 sm:w-6" />, title: "Offline Access", desc: "View your schedule even without internet" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{item.title}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Visual - Mobile App Mockups */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative flex justify-center items-center space-x-4 sm:space-x-8">
                {/* iPhone Mockup */}
                <div className="relative">
                  <div className="w-48 h-96 sm:w-56 sm:h-[450px] lg:w-64 lg:h-[500px] bg-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-1.5 sm:p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden relative">
                      {/* iPhone Header */}
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-16 sm:h-20 lg:h-24 flex items-end pb-2 sm:pb-3 lg:pb-4 px-3 sm:px-4 lg:px-6">
                        <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg">Tim Grow</h3>
                      </div>
                      
                      {/* App Content */}
                      <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
                        {/* Today's Appointments */}
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-500 mb-2 sm:mb-3">TODAY'S APPOINTMENTS</h4>
                          <div className="space-y-2 sm:space-y-3">
                            {[
                              { time: '10:00 AM', client: 'Sarah Chen', service: 'Hair Cut & Style', status: 'confirmed' },
                              { time: '2:30 PM', client: 'Mike Rodriguez', service: 'Beard Trim', status: 'pending' },
                              { time: '4:00 PM', client: 'Emma Wilson', service: 'Color Treatment', status: 'confirmed' }
                            ].slice(0, 2).map((appointment, index) => (
                              <div key={index} className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-xs sm:text-sm font-semibold text-gray-900">{appointment.time}</span>
                                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${appointment.status === 'confirmed' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-900 font-medium">{appointment.client}</p>
                                <p className="text-xs text-gray-600">{appointment.service}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6">
                          <div className="bg-indigo-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                            <p className="text-sm sm:text-lg font-bold text-indigo-600">8</p>
                            <p className="text-xs text-indigo-600">Today</p>
                          </div>
                          <div className="bg-green-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                            <p className="text-sm sm:text-lg font-bold text-green-600">$540</p>
                            <p className="text-xs text-green-600">Revenue</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* iOS Badge */}
                  <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 sm:px-4 sm:py-2 shadow-lg border border-gray-200">
                    <span className="text-xs font-semibold text-gray-600">iOS App</span>
                  </div>
                </div>
                
                {/* Android Tablet Mockup */}
                <div className="relative hidden sm:block">
                  <div className="w-36 h-48 sm:w-40 sm:h-56 lg:w-48 lg:h-64 bg-gray-800 rounded-xl sm:rounded-2xl p-1 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-xl overflow-hidden">
                      {/* Tablet Header */}
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-12 sm:h-14 lg:h-16 flex items-center px-2 sm:px-3 lg:px-4">
                        <h3 className="text-white font-bold text-xs sm:text-sm">Dashboard</h3>
                      </div>
                      
                      {/* Tablet Content */}
                      <div className="p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { icon: '📅', label: 'Calendar' },
                            { icon: '👥', label: 'Clients' },
                            { icon: '📊', label: 'Analytics' }
                          ].map((item, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-2 text-center">
                              <div className="text-lg mb-1">{item.icon}</div>
                              <p className="text-xs font-medium text-gray-700">{item.label}</p>
                            </div>
                          ))}
                        </div>
                        
                        {/* Mini Chart */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h4 className="text-xs font-semibold text-gray-600 mb-2">This Week</h4>
                          <div className="flex items-end space-x-1 h-12">
                            {[60, 80, 40, 90, 70, 85, 65].map((height, index) => (
                              <div 
                                key={index} 
                                className="flex-1 bg-gradient-to-t from-purple-400 to-pink-400 rounded-sm"
                                style={{ height: `${height}%` }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Android Badge */}
                  <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 sm:px-4 sm:py-2 shadow-lg border border-gray-200">
                    <span className="text-xs font-semibold text-gray-600">Android</span>
                  </div>
                </div>
              </div>
              
              {/* Floating Features */}
              <div className="absolute -top-8 -left-8 bg-white rounded-xl shadow-xl p-3 border border-gray-100 transform rotate-6">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-900">Real-time Sync</span>
                </div>
              </div>
              
              <div className="absolute -bottom-8 -right-8 bg-white rounded-xl shadow-xl p-3 border border-gray-100 transform -rotate-6">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-semibold text-gray-900">App Store Featured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl"></div>
          </div>
          
          <div className="text-center relative z-10">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 border border-white/20 rounded-full mb-8">
              <Crown className="h-5 w-5 text-yellow-400 mr-3" />
              <span className="text-sm font-semibold">Enterprise Solutions</span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
              For business{" "}
              <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                big and small
              </span>
            </h2>
            
            <p className="text-xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed">
              Reach out to discuss Enterprise solutions for larger teams. We can tailor Tim Grow's features to meet your requirements, processes and strategic goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-10 py-5 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                Contact Sales
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-gray-900 px-10 py-5 rounded-2xl text-lg font-semibold transition-all duration-300"
              >
                View Enterprise Features
                <ExternalLink className="ml-3 h-6 w-6" />
              </Button>
            </div>
            
            {/* Enterprise Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
              {[
                { icon: <Shield className="h-8 w-8" />, title: "Advanced Security", desc: "SSO, SAML, advanced encryption" },
                { icon: <Database className="h-8 w-8" />, title: "Custom Integrations", desc: "API access, webhooks, custom connectors" },
                { icon: <Headphones className="h-8 w-8" />, title: "Dedicated Support", desc: "24/7 priority support and success manager" }
              ].map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/80 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Preview */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Speaking of{" "}
              <span className="bg-gradient-to-r from-tim-green to-green-600 bg-clip-text text-transparent">
                connecting
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Enhance your service by integrating Tim Grow with your favorite business apps. Video calling, engaging emails, social streaming – scheduling is just the beginning.
            </p>
            <WouterLink href="/dashboard">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-tim-green to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Explore All Integrations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </WouterLink>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-900 via-tim-navy to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Make time for what truly{" "}
            <span className="bg-gradient-to-r from-tim-green to-green-400 bg-clip-text text-transparent">
              matters
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of successful businesses. Start your free trial today and see the difference in 24 hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setLocation("/dashboard")}
              size="lg"
              className="bg-gradient-to-r from-tim-green to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            >
              Sign Me Up
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <WouterLink href="/pricing">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/20 text-white hover:bg-white hover:text-tim-navy px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300"
              >
                View Pricing
              </Button>
            </WouterLink>
          </div>
        </div>
      </section>
    </div>
  );
}