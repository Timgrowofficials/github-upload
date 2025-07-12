import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Menu,
  Camera,
  HelpCircle,
  Download,
  ChevronLeft,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function DesktopSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: business } = useQuery<any>({
    queryKey: ["/api/businesses/me"],
  });

  const navigationItems = [
    { icon: Sparkles, label: "Grow your brand", href: "/analytics", isSpecial: true },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: Menu, label: "Services", href: "/services" },
    { icon: CreditCard, label: "Payments", href: "/payments" },
    { icon: Users, label: "Customers", href: "/clients" },
    { icon: BarChart3, label: "Integrations", href: "/integrations" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const isActive = (href: string) => location === href || location.startsWith(href);

  return (
    <div className={`hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-full lg:bg-white lg:border-r lg:border-gray-200 lg:transition-all lg:duration-300 ${isCollapsed ? 'lg:w-16' : 'lg:w-64'} lg:z-50`}>
      {/* Header with User Profile */}
      <div className={`lg:p-4 lg:border-b lg:border-gray-100 ${isCollapsed ? 'lg:px-2' : ''}`}>
        <div className="lg:flex lg:items-center lg:gap-3">
          <Avatar className="lg:w-8 lg:h-8">
            <AvatarImage src={(user as any)?.profileImageUrl || undefined} />
            <AvatarFallback className="lg:text-sm lg:bg-gray-100">
              {(user as any)?.firstName?.[0] || (user as any)?.email?.[0] || "S"}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <>
              <div className="lg:flex-1">
                <p className="lg:font-medium lg:text-gray-900 lg:text-sm">
                  {(user as any)?.firstName || "Sahhil"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(true)}
                className="lg:p-1 lg:h-6 lg:w-6"
              >
                <ChevronLeft className="lg:h-4 lg:w-4" />
              </Button>
            </>
          )}
          {isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(false)}
              className="lg:p-1 lg:h-6 lg:w-6 lg:ml-1"
            >
              <Menu className="lg:h-4 lg:w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="lg:flex-1 lg:p-2">
        <div className="lg:space-y-1">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className={`lg:w-full lg:justify-start lg:h-10 lg:px-3 lg:text-sm lg:font-normal ${
                  isActive(item.href) 
                    ? 'lg:bg-gray-100 lg:text-gray-900' 
                    : 'lg:text-gray-600 lg:hover:text-gray-900 lg:hover:bg-gray-50'
                } ${
                  item.isSpecial 
                    ? 'lg:bg-gradient-to-r lg:from-tim-green lg:to-green-600 lg:text-white lg:hover:from-green-600 lg:hover:to-green-700' 
                    : ''
                } ${isCollapsed ? 'lg:px-2' : ''}`}
              >
                <item.icon className={`lg:h-4 lg:w-4 ${isCollapsed ? '' : 'lg:mr-3'} lg:flex-shrink-0`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className={`lg:p-2 lg:border-t lg:border-gray-100 lg:space-y-2 ${isCollapsed ? 'lg:px-1' : ''}`}>
        {/* Share Booking Page */}
        {!isCollapsed && business && (
          <div className="lg:p-3 lg:bg-gray-50 lg:rounded-lg">
            <div className="lg:flex lg:items-center lg:gap-2 lg:mb-2">
              <Download className="lg:h-4 lg:w-4 lg:text-gray-600" />
              <span className="lg:text-xs lg:text-gray-600 lg:font-medium">Share your Booking Page link</span>
            </div>
          </div>
        )}

        {/* Upgrade Section */}
        {!isCollapsed && (
          <div className="lg:p-3 lg:bg-gradient-to-br lg:from-green-50 lg:to-emerald-50 lg:rounded-lg lg:border lg:border-green-200">
            <div className="lg:text-center lg:space-y-2">
              <p className="lg:text-sm lg:font-medium lg:text-gray-900">Unlock next-level booking</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="lg:w-full lg:border-tim-green lg:text-tim-green lg:hover:bg-tim-green lg:hover:text-white"
              >
                <Sparkles className="lg:h-3 lg:w-3 lg:mr-1" />
                Get Pro
              </Button>
              <p className="lg:text-xs lg:text-gray-600 lg:underline lg:cursor-pointer">Learn more</p>
            </div>
          </div>
        )}

        {/* Help & Support */}
        <Button
          variant="ghost"
          className={`lg:w-full lg:justify-start lg:h-10 lg:px-3 lg:text-sm lg:text-gray-600 lg:hover:text-gray-900 lg:hover:bg-gray-50 ${isCollapsed ? 'lg:px-2' : ''}`}
        >
          <HelpCircle className={`lg:h-4 lg:w-4 ${isCollapsed ? '' : 'lg:mr-3'} lg:flex-shrink-0`} />
          {!isCollapsed && <span>Help & Support</span>}
        </Button>

        {/* User Profile */}
        <div className={`lg:flex lg:items-center lg:gap-3 lg:p-2 lg:rounded-lg lg:hover:bg-gray-50 lg:cursor-pointer ${isCollapsed ? 'lg:justify-center' : ''}`}>
          <div className="lg:flex lg:items-center lg:gap-2">
            <Avatar className="lg:w-6 lg:h-6">
              <AvatarImage src={(user as any)?.profileImageUrl || undefined} />
              <AvatarFallback className="lg:text-xs lg:bg-tim-green lg:text-white">
                {(user as any)?.firstName?.[0] || "S"}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <span className="lg:text-sm lg:font-medium lg:text-gray-900">
                {(user as any)?.firstName || "Sahil Ansari"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}