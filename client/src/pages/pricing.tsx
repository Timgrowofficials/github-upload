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
  ArrowRight,
  Sparkles,
  X,
  Check,
  Heart,
  TrendingUp,
  ExternalLink,
  Crown,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link as WouterLink, useLocation } from "wouter";
import { useState } from "react";

export default function Pricing() {
  const [, setLocation] = useLocation();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const bookingFeatures = [
    "Unlimited appointments",
    "Custom booking page with unique URL",
    "iOS and Android apps",
    "Email and SMS reminders",
    "Customized notifications",
    "Accept payments online",
    "Calendar sync (Google, Outlook)",
    "Remove Tim Grow branding",
    "Advanced analytics & reporting",
    "24/7 priority support",
    "Multi-location support",
    "Recurring appointments",
    "Group booking & classes",
    "Staff management",
    "Virtual meeting integration",
    "Social media booking",
    "QR code booking",
    "Automated follow-ups",
    "Client management (CRM)",
    "Review & rating system"
  ];

  const websiteFeatures = [
    {
      category: "Design & Development",
      items: [
        "6 industry-specific premium templates",
        "Mobile-responsive design (85%+ mobile optimized)",
        "Custom branding & color schemes",
        "Professional logo integration",
        "High-quality stock images included"
      ]
    },
    {
      category: "Booking Integration",
      items: [
        "Full Tim Grow booking system integration",
        "Real-time availability synchronization",
        "Online payment processing",
        "Automated confirmation emails",
        "Client portal access"
      ]
    },
    {
      category: "Performance & SEO",
      items: [
        "Google-optimized code (95+ speed scores)",
        "SSL security certificate",
        "CDN hosting for fast loading",
        "Search engine optimization",
        "Local SEO setup"
      ]
    },
    {
      category: "Support & Maintenance",
      items: [
        "Expert developer consultation",
        "7-14 day delivery timeline",
        "30 days of free revisions",
        "Ongoing technical support",
        "Content management training"
      ]
    }
  ];

  const faqs = [
    {
      question: "What's included in the Professional Plan?",
      answer: "Everything you need to run your booking business! Unlimited appointments, custom branding, mobile apps, advanced analytics, payment processing, and 24/7 support. No hidden fees or usage limits."
    },
    {
      question: "Is website development included in the $5/month plan?",
      answer: "No, website development is a separate service starting at $1,999. The Professional Plan covers all booking platform features, while website development is a one-time investment for a complete online presence."
    },
    {
      question: "How long does website development take?",
      answer: "Most websites are completed within 7-14 days. Timeline depends on complexity and revision rounds. We provide regular updates throughout the development process."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes! You can cancel your Professional Plan subscription at any time with no cancellation fees. Your data remains accessible for 30 days after cancellation."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee on your first month. For website development, we provide unlimited revisions during the first 30 days to ensure your complete satisfaction."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards. For website development, we offer flexible payment plans including 50% upfront and 50% upon completion."
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
              <WouterLink href="/features" className="text-gray-700 hover:text-tim-green transition-colors">Features</WouterLink>
              <WouterLink href="/pricing" className="text-tim-green font-semibold">Pricing</WouterLink>
              <WouterLink href="/color-generator" className="text-gray-700 hover:text-tim-green transition-colors">Color Generator</WouterLink>
              <WouterLink href="/book/demo" className="text-gray-700 hover:text-tim-green transition-colors">Demo</WouterLink>
              <Button variant="ghost" className="text-tim-navy hover:bg-tim-green/10">
                <a href="/api/login">Sign In</a>
              </Button>
              <Button 
                onClick={() => window.location.href = "/api/login"}
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
              <WouterLink href="/features" className="block px-3 py-2 text-gray-600 hover:text-tim-green font-medium">Features</WouterLink>
              <WouterLink href="/pricing" className="block px-3 py-2 text-tim-green font-semibold">Pricing</WouterLink>
              <WouterLink href="/color-generator" className="block px-3 py-2 text-gray-600 hover:text-tim-green font-medium">Color Generator</WouterLink>
              <WouterLink href="/book/demo" className="block px-3 py-2 text-gray-600 hover:text-tim-green font-medium">Demo</WouterLink>
              <div className="pt-2 space-y-2">
                <Button variant="ghost" className="w-full justify-start text-tim-navy">
                  <a href="/api/login">Sign In</a>
                </Button>
                <Button 
                  onClick={() => window.location.href = "/api/login"}
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
      <section className="pt-24 pb-12 sm:pb-16 lg:pb-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-tim-green/10 to-tim-navy/10 border border-tim-green/20 rounded-full mb-6">
              <CreditCard className="h-4 w-4 text-tim-green mr-2" />
              <span className="text-sm font-medium text-tim-navy">Simple, Transparent Pricing</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 px-4 leading-tight">
              Deliver your{" "}
              <span className="bg-gradient-to-r from-tim-green to-green-600 bg-clip-text text-transparent">
                magic
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 px-4 leading-relaxed">
              Start with our Professional booking platform or add a complete website. Choose what works best for your business growth.
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-8">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-tim-navy shadow-sm'
                    : 'text-gray-600 hover:text-tim-navy'
                }`}
              >
                Monthly billing
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  billingPeriod === 'annual'
                    ? 'bg-white text-tim-navy shadow-sm'
                    : 'text-gray-600 hover:text-tim-navy'
                }`}
              >
                Annual billing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Platform Pricing */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Booking Platform Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage appointments and grow your business
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-tim-green/20">
              {/* Popular Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-tim-green to-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg border-2 border-white">
                  Most Popular Choice
                </div>
              </div>

              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Professional Plan</h3>
                <p className="text-gray-600 text-sm sm:text-base">Everything you need to succeed</p>
              </div>

              <div className="text-center mb-6 sm:mb-8">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                    ${billingPeriod === 'monthly' ? '5' : '50'}
                  </span>
                  <div className="text-left ml-2">
                    <div className="text-gray-600 text-xs sm:text-sm">per user</div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      per {billingPeriod === 'monthly' ? 'month' : 'year'}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {billingPeriod === 'annual' && (
                    <span className="text-tim-green font-semibold">Save 17% • </span>
                  )}
                  Cancel anytime
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {bookingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-tim-green mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="w-full bg-gradient-to-r from-tim-green to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-4"
              >
                Start FREE Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="text-center text-gray-500 text-sm">
                14-day free trial • No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Website Development Pricing */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-tim-navy via-tim-navy/95 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-6">
              <Globe className="h-4 w-4 text-tim-green mr-2" />
              <span className="text-sm font-medium">Professional Website Development</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Complete Website Solutions
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Professional website development with full booking integration. Separate pricing from booking platform.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Pricing Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-3 py-1 bg-tim-green rounded-full text-xs font-bold text-white mb-4">
                  <Crown className="h-3 w-3 mr-1" />
                  PROFESSIONAL PACKAGE
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Website Development</h3>
                <p className="text-white/80">Complete online presence solution</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-5xl font-bold text-white">$1,999</span>
                  <div className="text-left ml-2">
                    <div className="text-white/70 text-sm">one-time</div>
                    <div className="text-white/70 text-sm">payment</div>
                  </div>
                </div>
                <p className="text-white/80 text-sm">7-14 day delivery • 30 days free revisions</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-tim-green mb-1">7-14</div>
                  <div className="text-white/70 text-xs">Days Delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">6</div>
                  <div className="text-white/70 text-xs">Templates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">24/7</div>
                  <div className="text-white/70 text-xs">Support</div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  size="lg"
                  className="bg-gradient-to-r from-tim-green to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Get Your Website
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-tim-navy px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300"
                >
                  View Portfolio
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features Breakdown */}
            <div className="space-y-6">
              {websiteFeatures.map((section, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h4 className="text-lg font-bold text-white mb-4">{section.category}</h4>
                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center">
                        <Check className="h-4 w-4 text-tim-green mr-3 flex-shrink-0" />
                        <span className="text-white/90 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Note */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Booking Platform + Website = Complete Solution
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Get the best of both worlds: Professional booking management for $5/month + a stunning website for $1,999 one-time.
              </p>
              <div className="flex items-center justify-center space-x-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-tim-green">$5/month</div>
                  <div className="text-gray-600">Booking Platform</div>
                </div>
                <div className="text-2xl text-gray-400">+</div>
                <div>
                  <div className="text-3xl font-bold text-tim-navy">$1,999</div>
                  <div className="text-gray-600">Professional Website</div>
                </div>
                <div className="text-2xl text-gray-400">=</div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">Complete</div>
                  <div className="text-gray-600">Business Solution</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <div className="w-6 h-6 bg-tim-green/10 rounded-full flex items-center justify-center text-tim-green mr-3">
                    <span className="text-sm font-bold">Q</span>
                  </div>
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed ml-9">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-900 via-tim-navy to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Empower your customers to book{" "}
            <span className="bg-gradient-to-r from-tim-green to-green-400 bg-clip-text text-transparent">
              24/7
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Start with a free trial of our booking platform, then add a professional website when you're ready to take your business to the next level.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = "/api/login"}
              size="lg"
              className="bg-gradient-to-r from-tim-green to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            >
              Get Your FREE Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <WouterLink href="/features">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/20 text-white hover:bg-white hover:text-tim-navy px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300"
              >
                Explore Features
              </Button>
            </WouterLink>
          </div>
        </div>
      </section>
    </div>
  );
}