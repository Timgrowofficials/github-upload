import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertBusinessSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Smartphone, 
  Bell, 
  Users, 
  TrendingUp, 
  Star,
  Scissors,
  Dumbbell,
  Camera,
  Briefcase,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Clock,
  Globe,
  Shield,
  Zap,
  ArrowRight,
  Play,
  CheckCircle,
  BarChart3,
  Heart,
  MessageSquare,
  Crown,
  Sparkles,
  ExternalLink,
  DollarSign,
  Palette,
  BarChart
} from "lucide-react";
import { z } from "zod";
import { Link as WouterLink, useLocation } from "wouter";


const businessRegistrationSchema = insertBusinessSchema.omit({ userId: true, slug: true });

type BusinessRegistrationData = z.infer<typeof businessRegistrationSchema>;

export default function Landing() {
  const [showRegister, setShowRegister] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const { toast } = useToast();

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(timer);
  }, []);

  // Handle touch swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % 2);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + 2) % 2);
    }
  };

  const heroSlides = [
    {
      badge: "#1 Booking Platform for Service Businesses",
      headline: "Book instantly, Grow faster",
      subheadline: "The most advanced booking platform that eliminates no-shows, automates scheduling, and grows your business by 40% on average.",
      primaryButton: "Start Free Trial",
      secondaryButton: "Watch Demo",
      trust: "10,000+ businesses trust us",
      visual: "booking-platform"
    },
    {
      badge: "Professional Website Development",
      headline: "Stunning websites that convert",
      subheadline: "Get a professional website that showcases your business perfectly. From concept to launch, we handle everything so you can focus on your customers.",
      primaryButton: "View Portfolio", 
      secondaryButton: "Get Quote",
      trust: "150+ websites delivered",
      visual: "website-building"
    }
  ];
  const queryClient = useQueryClient();

  const form = useForm<BusinessRegistrationData>({
    resolver: zodResolver(businessRegistrationSchema),
    defaultValues: {
      name: "",
      description: "",
      businessType: "",
      phone: "",
      email: "",
      address: "",
      isActive: true,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: BusinessRegistrationData) => {
      const response = await apiRequest("POST", "/api/register-business", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Business registered successfully!",
        description: "Welcome to Tim Grow. Start managing your appointments today.",
      });
      setShowRegister(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BusinessRegistrationData) => {
    registerMutation.mutate(data);
  };

  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Smart Scheduling",
      description: "AI-powered calendar that maximizes your bookings and reduces no-shows by 40%"
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Instant Notifications", 
      description: "Real-time alerts for bookings, cancellations, and customer messages across all devices"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics",
      description: "Deep insights into your business performance with revenue tracking and customer trends"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile-First Design",
      description: "Beautiful, fast mobile experience that your clients will love booking from"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Management",
      description: "Seamlessly manage multiple team members, their schedules, and permissions"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Reach",
      description: "Multi-language support and timezone handling for international businesses"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      business: "Elite Hair Studio",
      location: "Seattle, WA",
      review: "Tim Grow transformed our business completely. We went from managing 40 appointments per week manually to 120+ bookings with zero double-bookings. Our no-show rate dropped from 25% to just 3% thanks to the smart reminder system. Best investment we ever made.",
      metrics: "200% booking increase, 22% reduction in no-shows",
      timeframe: "First 3 months",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez", 
      business: "Urban Fitness Center",
      location: "Austin, TX",
      review: "We switched from three different apps to just Tim Grow. The mobile app means I can manage my business from anywhere - even while training clients. My members love the easy booking, and I love the revenue insights that helped me optimize class pricing.",
      metrics: "$15,000 monthly revenue increase",
      timeframe: "Within 6 months",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Jessica Park",
      business: "Zen Wellness Spa",
      location: "Portland, OR", 
      review: "The booking integration with our new website has been incredible. Clients can book directly from Google, our social media, anywhere. The automated reminders and follow-ups have increased our repeat bookings by 45%. Tim Grow basically runs itself.",
      metrics: "45% increase in repeat clients, 60% less admin time",
      timeframe: "Over 12 months",
      rating: 5,
      avatar: "JP"
    },
    {
      name: "David Kim",
      business: "Precision Auto Detail",
      location: "Miami, FL",
      review: "As a mobile service, scheduling was always chaos. Tim Grow's route optimization and real-time booking updates changed everything. I can handle 40% more appointments per day, and customers love tracking my arrival in real-time.",
      metrics: "40% more daily appointments, 95% customer satisfaction",
      timeframe: "First year",
      rating: 5,
      avatar: "DK"
    },
    {
      name: "Amanda Foster",
      business: "Foster Family Photography",
      location: "Nashville, TN",
      review: "The website + booking combo was perfect for my photography business. Clients can view my portfolio and book sessions instantly. The automated contract signing and deposit collection saved me 15 hours per week of admin work.",
      metrics: "15 hours/week saved, 80% faster booking process",
      timeframe: "Since launch",
      rating: 5,
      avatar: "AF"
    },
    {
      name: "Dr. Michael Torres",
      business: "Torres Dental Practice",
      location: "Phoenix, AZ",
      review: "Patient scheduling used to require two full-time staff members. Now it's completely automated. Patients can book, reschedule, and receive treatment reminders automatically. We've cut administrative costs by 60% while improving patient satisfaction.",
      metrics: "60% reduction in admin costs, 98% patient satisfaction",
      timeframe: "18 months",
      rating: 5,
      avatar: "MT"
    }
  ];

  const businessTypes = [
    { icon: <Scissors className="h-8 w-8" />, name: "Hair & Beauty", color: "from-pink-500 to-purple-600" },
    { icon: <Dumbbell className="h-8 w-8" />, name: "Fitness & Wellness", color: "from-blue-500 to-teal-600" },
    { icon: <Camera className="h-8 w-8" />, name: "Photography", color: "from-yellow-500 to-orange-600" },
    { icon: <Briefcase className="h-8 w-8" />, name: "Professional Services", color: "from-gray-600 to-slate-700" },
    { icon: <Heart className="h-8 w-8" />, name: "Healthcare", color: "from-red-500 to-pink-600" },
    { icon: <Star className="h-8 w-8" />, name: "Personal Services", color: "from-indigo-500 to-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                <span className="text-black">Tim</span>
                <span className="text-tim-green">Grow</span>
                <span className="text-red-500">.</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <WouterLink href="/features" className="text-gray-600 hover:text-tim-green transition-colors font-medium">Features</WouterLink>
              <WouterLink href="/pricing" className="text-gray-600 hover:text-tim-green transition-colors font-medium">Pricing</WouterLink>
              <WouterLink href="/color-generator" className="text-gray-600 hover:text-tim-green transition-colors font-medium">Color Generator</WouterLink>
              <WouterLink href="/book/demo" className="text-gray-600 hover:text-tim-green transition-colors font-medium">Demo</WouterLink>
              <Button variant="ghost" className="text-tim-navy hover:bg-tim-green/10">
                <a href="/api/login">Sign In</a>
              </Button>
              <Button 
                onClick={() => setShowRegister(true)}
                className="bg-gradient-to-r from-tim-green to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
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
              <WouterLink href="/features" className="block px-3 py-2 text-gray-600 hover:text-tim-green font-medium">Features</WouterLink>
              <WouterLink href="/pricing" className="block px-3 py-2 text-gray-600 hover:text-tim-green font-medium">Pricing</WouterLink>
              <WouterLink href="/color-generator" className="block px-3 py-2 text-gray-600 hover:text-tim-green font-medium">Color Generator</WouterLink>
              <WouterLink href="/book/demo" className="block px-3 py-2 text-gray-600 hover:text-tim-green font-medium">Demo</WouterLink>
              <div className="pt-2 space-y-2">
                <Button variant="ghost" className="w-full justify-start text-tim-navy">
                  <a href="/api/login">Sign In</a>
                </Button>
                <Button 
                  onClick={() => setShowRegister(true)}
                  className="w-full bg-gradient-to-r from-tim-green to-green-600 text-white font-semibold"
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* Hero Carousel Section */}
      <section className="relative pt-20 pb-8 md:pt-32 md:pb-20 overflow-hidden min-h-screen">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-tim-green/5 via-transparent to-tim-navy/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-tim-green/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-tim-navy/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Carousel Container */}
          <div className="relative">
            <div className="overflow-hidden relative">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {/* Slide 1: Booking Platform */}
<div className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center min-h-[80vh] lg:min-h-[70vh]">
                    {/* Hero Content */}
                    <div className="space-y-6 lg:space-y-8 text-center lg:text-left lg:pl-32">
                      {/* Badge */}
                      <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-tim-green/10 to-tim-navy/10 border border-tim-green/20 rounded-full">
                        <Crown className="h-4 w-4 text-tim-green mr-2" />
                        <span className="text-xs md:text-sm font-medium text-tim-navy">{heroSlides[0].badge}</span>
                      </div>

                      {/* Main Headline */}
                      <div className="space-y-3 md:space-y-4">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                          <span className="text-gray-900">Book</span>{" "}
                          <span className="bg-gradient-to-r from-tim-green to-green-600 bg-clip-text text-transparent">instantly</span>
                          <br />
                          <span className="text-gray-900">Grow</span>{" "}
                          <span className="bg-gradient-to-r from-tim-navy to-blue-600 bg-clip-text text-transparent">faster</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto lg:mx-0">
                          {heroSlides[0].subheadline}
                        </p>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                        <Button 
                          onClick={() => setShowRegister(true)}
                          size="lg"
                          className="bg-gradient-to-r from-tim-green to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-3 md:px-8 md:py-4 rounded-2xl text-base md:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                        >
                          {heroSlides[0].primaryButton}
                          <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg"
                          className="border-2 border-tim-navy/20 text-tim-navy hover:bg-tim-navy hover:text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl text-base md:text-lg font-semibold transition-all duration-300"
                        >
                          <Play className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                          {heroSlides[0].secondaryButton}
                        </Button>
                      </div>


                    </div>

                    {/* Hero Visual - Booking Platform */}
                    <div className="relative lg:pl-8 lg:order-last">
                      <div className="relative">
                        {/* Phone Mockup Background */}
                        <div className="relative mx-auto w-48 h-[360px] sm:w-80 sm:h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] sm:rounded-[3rem] p-2 shadow-2xl">
                          <div className="w-full h-full bg-white rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden">
                            {/* Phone Screen Content */}
                            <div className="bg-gradient-to-br from-tim-green via-tim-green/90 to-tim-navy p-3 sm:p-6 text-white">
                              <div className="flex items-center justify-between mb-2 sm:mb-4">
                                <div className="font-bold text-sm sm:text-lg">TimGrow</div>
                                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-white/20 rounded-full"></div>
                              </div>
                              <div className="space-y-1 sm:space-y-2">
                                <h3 className="text-base sm:text-xl font-bold">Book Your Service</h3>
                                <p className="text-white/80 text-xs sm:text-base">Elite Barber Shop</p>
                              </div>
                            </div>
                            
                            <div className="p-3 sm:p-6 space-y-2 sm:space-y-4">
                              {/* Service Cards */}
                              {[
                                { name: "Haircut & Style", price: "$45", time: "30 min" },
                                { name: "Beard Trim", price: "$25", time: "15 min" },
                                { name: "Full Service", price: "$65", time: "45 min" }
                              ].map((service, index) => (
                                <div key={index} className={`p-2 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${index === 0 ? 'border-tim-green bg-tim-green/5' : 'border-gray-200'}`}>
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h4 className="font-semibold text-gray-900 text-xs sm:text-base">{service.name}</h4>
                                      <p className="text-gray-600 text-xs sm:text-sm">{service.time}</p>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-bold text-tim-green text-sm sm:text-lg">{service.price}</div>
                                      {index === 0 && <CheckCircle className="h-3 w-3 sm:h-5 sm:w-5 text-tim-green ml-auto" />}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {/* Calendar Preview */}
                              <div className="mt-3 sm:mt-6 p-2 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                                <h4 className="font-semibold mb-2 sm:mb-3 text-xs sm:text-base">Available Times</h4>
                                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                                  {["9:00", "10:30", "2:00", "3:30", "4:00", "5:30"].map((time, index) => (
                                    <div key={index} className={`p-1 sm:p-2 text-center rounded text-xs sm:text-sm font-medium ${index === 1 ? 'bg-tim-green text-white' : 'bg-white text-gray-700'}`}>
                                      {time}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Floating Elements - Hidden on mobile */}
                        <div className="hidden sm:block absolute -top-2 -right-2 bg-white rounded-2xl shadow-xl p-4 animate-bounce z-10 ml-[14px] mr-[14px] mt-[10px] mb-[10px]">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                            <span className="font-semibold text-gray-900">Booking Confirmed!</span>
                          </div>
                        </div>
                        
                        <div className="hidden sm:block absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-pulse z-10">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-tim-green to-green-600 rounded-full flex items-center justify-center">
                              <Bell className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">Reminder</div>
                              <div className="text-sm text-gray-600">Appointment in 1 hour</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Trust Indicators - Below Frame */}
                      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 pt-4 mt-6">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 md:h-5 md:w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-gray-600 font-medium ml-2 text-sm md:text-base">5.0 rating</span>
                        </div>
                        <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
                        <div className="text-gray-600 font-medium text-sm md:text-base">{heroSlides[0].trust}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide 2: Website Building */}
<div className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center min-h-[80vh] lg:min-h-[70vh]">
                    {/* Hero Content */}
                    <div className="space-y-6 lg:space-y-8 text-center lg:text-left lg:pl-32">
                      {/* Badge */}
                      <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full">
                        <Globe className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-xs md:text-sm font-medium text-purple-900">{heroSlides[1].badge}</span>
                      </div>

                      {/* Main Headline */}
                      <div className="space-y-3 md:space-y-4">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                          <span className="text-gray-900">Stunning</span>{" "}
                          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">websites</span>
                          <br />
                          <span className="text-gray-900">that</span>{" "}
                          <span className="bg-gradient-to-r from-tim-green to-green-600 bg-clip-text text-transparent">convert</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto lg:mx-0">
                          {heroSlides[1].subheadline}
                        </p>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                        <Button 
                          onClick={() => setShowPortfolio(true)}
                          size="lg"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-3 md:px-8 md:py-4 rounded-2xl text-base md:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                        >
                          {heroSlides[1].primaryButton}
                          <ExternalLink className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={() => setShowRegister(true)}
                          className="border-2 border-purple-600/20 text-purple-600 hover:bg-purple-600 hover:text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl text-base md:text-lg font-semibold transition-all duration-300"
                        >
                          <DollarSign className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                          {heroSlides[1].secondaryButton}
                        </Button>
                      </div>


                    </div>

                    {/* Hero Visual - Website Building */}
                    <div className="relative lg:pl-8 lg:order-last">
                      <div className="relative">
                        {/* Laptop Mockup */}
                        <div className="relative mx-auto w-80 h-[320px] sm:w-96 sm:h-[400px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-t-2xl p-2 sm:p-3 shadow-2xl">
                          <div className="w-full h-full bg-white rounded-t-xl overflow-hidden">
                            {/* Browser Bar */}
                            <div className="bg-gray-100 px-3 py-2 sm:px-4 sm:py-3 border-b flex items-center space-x-2">
                              <div className="flex space-x-2">
                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                              </div>
                              <div className="flex-1 bg-white rounded px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm text-gray-600">
                                restaurant-website-preview.com
                              </div>
                            </div>
                            
                            {/* Website Content */}
                            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 sm:p-6 text-white text-center">
                              <div className="space-y-3 sm:space-y-4">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                                  <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold">Your Business</h3>
                                <p className="text-white/90 text-sm sm:text-base">Professional. Beautiful. Effective.</p>
                                <div className="grid grid-cols-3 gap-2 mt-3 sm:mt-4">
                                  <div className="bg-white/10 rounded p-1 sm:p-2 text-xs">Home</div>
                                  <div className="bg-white/10 rounded p-1 sm:p-2 text-xs">Services</div>
                                  <div className="bg-white/10 rounded p-1 sm:p-2 text-xs">Contact</div>
                                </div>
                                <button className="bg-white text-purple-600 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold">
                                  Book Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Laptop Base */}
                        <div className="w-80 h-5 sm:w-96 sm:h-6 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-2xl mx-auto"></div>

                        {/* Floating Elements - Hidden on mobile */}
                        <div className="hidden sm:block absolute -top-2 -right-2 bg-white rounded-2xl shadow-xl p-4 animate-bounce z-10 ml-[14px] mr-[14px] mt-[10px] mb-[10px]">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-6 w-6 text-green-500" />
                            <span className="font-semibold text-gray-900">SEO Optimized!</span>
                          </div>
                        </div>
                        
                        <div className="hidden sm:block absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-pulse z-10">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                              <Smartphone className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">Mobile Ready</div>
                              <div className="text-sm text-gray-600">Responsive Design</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Trust Indicators - Below Frame */}
                      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 pt-4 mt-6">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 md:h-5 md:w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-gray-600 font-medium ml-2 text-sm md:text-base">5.0 rating</span>
                        </div>
                        <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
                        <div className="text-gray-600 font-medium text-sm md:text-base">{heroSlides[1].trust}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow Controls - Hidden on mobile */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="hidden sm:block absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-200"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
              className="hidden sm:block absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-200"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </section>
      
      
      
      {/* Website Builder Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-tim-navy via-tim-navy/95 to-purple-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white/10 border border-white/20 rounded-full mb-4 sm:mb-6">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-tim-green mr-2 sm:mr-3" />
              <span className="text-xs sm:text-sm font-medium">Professional Website Development</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 px-4">
              Professional websites built by{" "}
              <span className="bg-gradient-to-r from-tim-green to-green-400 bg-clip-text text-transparent">expert developers</span>
            </h2>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-4xl mx-auto px-4">
              Get a stunning, fully customized website that perfectly represents your business. Professional development with competitive pricing and fast delivery.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Content - Features & Benefits */}
            <div className="space-y-8 sm:space-y-12">
              {/* Key Features Grid */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  {
                    icon: <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />,
                    title: "Premium Templates",
                    description: "6 industry-specific designs: Restaurant, E-commerce, Service Business, Portfolio, Real Estate & Healthcare"
                  },
                  {
                    icon: <Zap className="h-5 w-5 sm:h-6 sm:w-6" />,
                    title: "Full Booking Integration",
                    description: "Your website seamlessly connects to Tim Grow booking system with synchronized availability"
                  },
                  {
                    icon: <Smartphone className="h-5 w-5 sm:h-6 sm:w-6" />,
                    title: "Mobile-First Design",
                    description: "Responsive layouts optimized for 85%+ mobile visitors with fast loading times"
                  },
                  {
                    icon: <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />,
                    title: "SEO & Performance",
                    description: "Google-optimized code, SSL security, CDN hosting, and 95+ speed scores"
                  },
                  {
                    icon: <Palette className="h-5 w-5 sm:h-6 sm:w-6" />,
                    title: "Custom Branding",
                    description: "Complete brand consistency with your logo, colors, fonts, and business messaging"
                  },
                  {
                    icon: <Globe className="h-5 w-5 sm:h-6 sm:w-6" />,
                    title: "Professional Development",
                    description: "Expert developers create custom features, payment integration, and ongoing maintenance"
                  }
                ].map((feature, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-tim-green rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Pricing Section */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/30">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Investment & Timeline</h3>
                  <p className="text-white/80 text-sm sm:text-base">Professional development that fits your budget</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-tim-green mb-1 sm:mb-2">$1,999</div>
                    <div className="text-white/70 text-xs sm:text-sm">Starting Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">7-14</div>
                    <div className="text-white/70 text-xs sm:text-sm">Days Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Free</div>
                    <div className="text-white/70 text-xs sm:text-sm">Consultation</div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 space-y-1 sm:space-y-0">
                    <span className="text-white font-medium text-sm sm:text-base">Professional Package</span>
                    <span className="text-tim-green font-bold text-base sm:text-lg">Best Value</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 sm:h-3 mb-3">
                    <div className="bg-gradient-to-r from-tim-green to-green-400 h-2 sm:h-3 rounded-full" style={{width: '100%'}}></div>
                  </div>
                  <p className="text-white/80 text-xs sm:text-sm">Complete website solution with all features included</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setShowRegister(true)}
                  size="lg"
                  className="bg-gradient-to-r from-tim-green to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex-1"
                >
                  Get Your Website
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => setShowPortfolio(true)}
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white/60 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-tim-navy px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 flex-1 shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  View Portfolio
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Right Content - Template Showcase */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-[2rem] p-8 border border-white/30 shadow-2xl">
                <div className="space-y-8">
                  {/* Templates Header */}
                  <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-tim-green/20 border border-tim-green/30 rounded-full mb-4">
                      <Sparkles className="h-4 w-4 text-tim-green mr-2" />
                      <span className="text-sm font-medium text-white">Premium Templates</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3">Professional Designs</h3>
                    <p className="text-white/90">Choose from expertly crafted templates</p>
                  </div>
                  
                  {/* Featured Template */}
                  <div className="bg-white/15 rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-white">Featured Template</h4>
                      <div className="px-3 py-1 bg-tim-green rounded-full text-xs font-bold text-white">POPULAR</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-4">
                      <div className="bg-white/20 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                          <div className="h-2 bg-white/40 rounded flex-1"></div>
                        </div>
                        <div className="space-y-1">
                          <div className="h-2 bg-white/50 rounded w-3/4"></div>
                          <div className="h-2 bg-white/30 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="text-white text-sm font-semibold">Service Business Pro</div>
                    </div>
                  </div>

                  {/* Template Categories */}
                  <div>
                    <h4 className="text-white font-bold mb-4 text-center">All Categories</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: "Restaurant", color: "from-red-500 to-orange-600", icon: <Heart className="h-4 w-4" /> },
                        { name: "E-commerce", color: "from-blue-500 to-indigo-600", icon: <TrendingUp className="h-4 w-4" /> },
                        { name: "Service", color: "from-green-500 to-emerald-600", icon: <Zap className="h-4 w-4" /> },
                        { name: "Portfolio", color: "from-purple-500 to-pink-600", icon: <Star className="h-4 w-4" /> },
                        { name: "Real Estate", color: "from-yellow-500 to-orange-600", icon: <Shield className="h-4 w-4" /> },
                        { name: "Healthcare", color: "from-teal-500 to-cyan-600", icon: <Users className="h-4 w-4" /> }
                      ].map((template, index) => (
                        <div key={index} className={`bg-gradient-to-br ${template.color} rounded-xl p-3 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group`}>
                          <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg mb-2 group-hover:bg-white/30 transition-colors">
                            {template.icon}
                          </div>
                          <div className="font-semibold text-xs leading-tight">{template.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Included Features */}
                  <div className="space-y-3">
                    <h4 className="text-white font-bold text-center">What's Included</h4>
                    {[
                      "Mobile-responsive design",
                      "SEO optimization included", 
                      "Booking system integration",
                      "Free SSL & hosting setup"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 text-white/90">
                        <div className="w-5 h-5 bg-tim-green rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Badges */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-tim-green to-green-600 rounded-2xl shadow-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-white">
                    <div className="font-bold text-sm">Professional</div>
                    <div className="text-xs opacity-90">Expert Built</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white/15 backdrop-blur-lg rounded-xl shadow-xl p-3 border border-white/30">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <Crown className="h-3 w-3 text-white" />
                  </div>
                  <div className="text-white text-xs">
                    <div className="font-bold">Premium Support</div>
                    <div className="opacity-80">24/7 Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Business Types Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Perfect for <span className="bg-gradient-to-r from-tim-green to-tim-navy bg-clip-text text-transparent">every business</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Whether you're a solo entrepreneur or manage a team of 50, Tim Grow scales with your business
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {businessTypes.map((type, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${type.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    {type.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-center text-xs sm:text-sm leading-tight">{type.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-tim-green/10 to-tim-navy/10 border border-tim-green/20 rounded-full mb-4">
              <Sparkles className="h-4 w-4 text-tim-green mr-2" />
              <span className="text-xs sm:text-sm font-medium text-tim-navy">Advanced Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-tim-green to-green-600 bg-clip-text text-transparent">dominate</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Advanced tools and automation that put you ahead of the competition. Built for the modern service business.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-tim-green/20 h-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-tim-green to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Statistics Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-tim-green via-tim-green/95 to-tim-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4">
              Trusted by businesses worldwide
            </h2>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto px-4">
              Join thousands of successful businesses that have transformed their operations with Tim Grow
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: "10,000+", label: "Active Businesses" },
              { number: "2M+", label: "Bookings Processed" },
              { number: "40%", label: "Average Revenue Growth" },
              { number: "99.9%", label: "Uptime Guarantee" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80 font-medium text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
              Loved by business owners{" "}
              <span className="bg-gradient-to-r from-tim-green to-tim-navy bg-clip-text text-transparent">everywhere</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Don't just take our word for it. Here's what real business owners say about Tim Grow.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 italic">
                  "{testimonial.review}"
                </p>
                
                {/* Results Badge */}
                <div className="bg-gradient-to-r from-tim-green/10 to-green-100 border border-tim-green/20 rounded-xl p-3 mb-4">
                  <div className="text-tim-green font-semibold text-sm mb-1">Results: {testimonial.timeframe}</div>
                  <div className="text-gray-700 text-sm">{testimonial.metrics}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-tim-green to-tim-navy rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {testimonial.avatar}
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                      <div className="text-gray-600 text-xs sm:text-sm">{testimonial.business}</div>
                      <div className="text-gray-500 text-xs">{testimonial.location}</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-tim-green/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-tim-green" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-tim-green to-tim-navy bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Everything you need to know about Tim Grow's booking platform and website services
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {[
              {
                question: "How quickly can I get started with Tim Grow?",
                answer: "You can be up and running in under 5 minutes! Simply sign up for your free trial, add your business information, and your booking page is ready to share with clients. No credit card required for the 14-day trial."
              },
              {
                question: "What's included in the $5/month Professional Plan?",
                answer: "Everything! Unlimited bookings, custom branding, native mobile apps, advanced analytics, complete CRM, 24/7 priority support, smart notifications, secure payment processing, and multi-location support. No hidden fees or usage limits."
              },
              {
                question: "Can I customize my booking page to match my brand?",
                answer: "Absolutely! You can customize colors, upload your logo, add your business description, and create a completely branded experience. Your booking page will look like it was built specifically for your business."
              },
              {
                question: "How do the smart notifications work?",
                answer: "Our automated system sends SMS and email reminders to clients 24 hours and 2 hours before their appointment. This reduces no-shows by up to 80%. You can customize the message content and timing to match your business needs."
              },
              {
                question: "What about website development services?",
                answer: "Our expert developers create professional websites starting at $1,999. This includes mobile-responsive design, SEO optimization, booking system integration, SSL security, and ongoing support. Delivery typically takes 7-14 days."
              },
              {
                question: "Do you offer mobile apps for my business?",
                answer: "Yes! Every Professional Plan includes native iOS and Android apps where you can manage bookings, view analytics, communicate with clients, and run your business from anywhere. Your clients can also download your branded app."
              },
              {
                question: "Is my data secure and backed up?",
                answer: "Security is our top priority. All data is encrypted, stored on secure servers, and automatically backed up. We're PCI-compliant for payment processing and maintain 99.9% uptime with enterprise-grade infrastructure."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Yes, you can cancel your subscription at any time with no cancellation fees. Your data remains accessible for 30 days after cancellation, giving you time to export if needed."
              },
              {
                question: "What kind of support do you provide?",
                answer: "Professional Plan users get 24/7 priority support via chat, email, and phone. Our team responds within 2 hours and includes setup assistance, training, and ongoing technical support. We're here to ensure your success."
              },
              {
                question: "How does the booking integration work with my website?",
                answer: "Seamlessly! Clients can book directly from your website, Google listings, social media, or anywhere you share your booking link. All appointments sync automatically across all platforms in real-time."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-tim-green/10 rounded-full flex items-center justify-center text-tim-green mr-3">
                    <span className="text-sm sm:text-base font-bold">Q</span>
                  </div>
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base ml-9 sm:ml-11">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-900 via-tim-navy to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4">
            Ready to{" "}
            <span className="bg-gradient-to-r from-tim-green to-green-400 bg-clip-text text-transparent">
              transform
            </span>{" "}
            your business?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of successful businesses. Start your free trial today and see the difference in 24 hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              onClick={() => setShowRegister(true)}
              size="lg"
              className="bg-gradient-to-r from-tim-green to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 sm:px-10 sm:py-6 rounded-2xl text-lg sm:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white/20 text-white hover:bg-white hover:text-tim-navy px-8 py-4 sm:px-10 sm:py-6 rounded-2xl text-lg sm:text-xl font-semibold transition-all duration-300"
            >
              Talk to Sales
            </Button>
          </div>

          <div className="mt-6 sm:mt-8 text-gray-400 text-sm sm:text-base px-4">
            No credit card required • Cancel anytime • 30-day money-back guarantee
          </div>
        </div>
      </section>
      {/* Portfolio Modal */}
      <Dialog open={showPortfolio} onOpenChange={setShowPortfolio}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center text-gray-900 mb-2">
              Our Portfolio
            </DialogTitle>
            <p className="text-center text-gray-600 text-lg">
              Professional websites we've built for businesses like yours
            </p>
          </DialogHeader>
          
          {/* Featured Website Preview */}
          <div className="mb-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">Featured Project</h3>
                <p className="text-white/90">Habibi Lounge - Middle Eastern Cuisine & Hookah</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-sm font-bold text-white">LIVE WEBSITE</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-xl">
              <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="ml-4 text-gray-400 text-sm flex-1">restaurant-website-preview.com</div>
                <div className="bg-green-500 w-2 h-2 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs">LIVE</span>
              </div>
              
              <div className="relative bg-white h-[600px] overflow-hidden">
                <iframe 
                  src="https://hookahlounge.replit.app/" 
                  className="w-full h-full border-0"
                  title="Habibi Lounge Website Preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
                
                {/* Overlay info */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">Live Website</span>
                  </div>
                </div>
                
                
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Responsive Design",
                "Real Functionality", 
                "Professional Quality",
                "Live Experience"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <CheckCircle className="h-2.5 w-2.5 text-purple-600" />
                  </div>
                  <span className="text-sm text-white font-medium">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-white/90 text-sm">
                <strong>Live Website Preview:</strong> This is the actual Habibi Lounge website embedded directly here. Navigate through the real website to experience the professional quality and functionality that builds customer confidence!
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">More Portfolio Examples</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[
              {
                title: "Elite Barber Shop",
                category: "Hair & Beauty",
                image: "from-red-500 to-orange-600",
                features: ["Online Booking", "Service Showcase", "Gallery", "Mobile Responsive"]
              },
              {
                title: "Yoga Studio Pro",
                category: "Fitness & Wellness", 
                image: "from-green-500 to-emerald-600",
                features: ["Class Schedules", "Instructor Profiles", "Member Portal", "Payment Integration"]
              },
              {
                title: "Smith Photography",
                category: "Creative Services",
                image: "from-purple-500 to-pink-600",
                features: ["Portfolio Gallery", "Client Booking", "Package Pricing", "Contact Forms"]
              },
              {
                title: "Downtown Dental",
                category: "Healthcare",
                image: "from-blue-500 to-indigo-600",
                features: ["Appointment Booking", "Service Info", "Insurance Details", "Patient Portal"]
              },
              {
                title: "Coastal Real Estate",
                category: "Real Estate",
                image: "from-yellow-500 to-orange-600",
                features: ["Property Listings", "Agent Profiles", "Search Filters", "Virtual Tours"]
              },
              {
                title: "Gourmet Bistro",
                category: "Restaurant",
                image: "from-teal-500 to-cyan-600",
                features: ["Menu Display", "Online Reservations", "Order System", "Location Info"]
              }
            ].map((project, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className={`h-48 bg-gradient-to-br ${project.image} relative`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className="text-sm font-semibold text-gray-800">{project.category}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-tim-green rounded-full p-2">
                      <ExternalLink className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  <div className="space-y-2">
                    {project.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-tim-green rounded-full flex items-center justify-center">
                          <CheckCircle className="h-2.5 w-2.5 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-tim-green to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 rounded-xl transition-all duration-200"
                    onClick={() => {
                      setShowPortfolio(false);
                      setShowRegister(true);
                    }}
                  >
                    Get Similar Website
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 p-6 bg-gray-50 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Join Our Portfolio?</h3>
            <p className="text-gray-600 mb-4">
              Let's create a stunning website that represents your business perfectly
            </p>
            <Button 
              onClick={() => {
                setShowPortfolio(false);
                setShowRegister(true);
              }}
              className="bg-gradient-to-r from-tim-green to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-3 rounded-xl text-lg"
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Registration Modal */}
      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-900">Time to Grow</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Business Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your Business Name" 
                        {...field}
                        className="border-gray-300 focus:border-tim-green focus:ring-tim-green/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Business Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-tim-green focus:ring-tim-green/20">
                          <SelectValue placeholder="Select your business type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Hair & Beauty">Hair & Beauty</SelectItem>
                        <SelectItem value="Fitness & Wellness">Fitness & Wellness</SelectItem>
                        <SelectItem value="Photography">Photography</SelectItem>
                        <SelectItem value="Professional Services">Professional Services</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Personal Services">Personal Services</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Description</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Brief description of your business" 
                        {...field}
                        value={field.value || ""}
                        className="border-gray-300 focus:border-tim-green focus:ring-tim-green/20"
                      />
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
                    <FormLabel className="text-gray-900 font-medium">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="your@email.com" 
                        {...field}
                        value={field.value || ""}
                        className="border-gray-300 focus:border-tim-green focus:ring-tim-green/20"
                      />
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
                    <FormLabel className="text-gray-900 font-medium">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="(555) 123-4567" 
                        {...field}
                        value={field.value || ""}
                        className="border-gray-300 focus:border-tim-green focus:ring-tim-green/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-tim-green to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Creating Account..." : "Get a Quote"}
              </Button>
            </form>
          </Form>
          
          <div className="text-center text-sm text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}