import { useState } from "react";
import { Home, Calendar, User, MessageSquare, Star, Bell, Settings, LogOut } from "lucide-react";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ClientMobileNavProps {
  businessSlug: string;
}

export default function ClientMobileNavigation({ businessSlug }: ClientMobileNavProps) {
  const [location] = useLocation();
  
  const navItems = [
    {
      name: "Home",
      href: `/client/${businessSlug}`,
      icon: Home,
      active: location === `/client/${businessSlug}`
    },
    {
      name: "Bookings",
      href: `/client/${businessSlug}/bookings`,
      icon: Calendar,
      active: location === `/client/${businessSlug}/bookings`
    },
    {
      name: "Profile",
      href: `/client/${businessSlug}/profile`,
      icon: User,
      active: location === `/client/${businessSlug}/profile`
    },
    {
      name: "Reviews",
      href: `/client/${businessSlug}/reviews`,
      icon: Star,
      active: location === `/client/${businessSlug}/reviews`
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <button
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full",
                  item.active
                    ? "text-tim-green bg-green-50"
                    : "text-gray-500 hover:text-tim-green hover:bg-green-50"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.name}</span>
              </button>
            </Link>
          );
        })}
        
        {/* Quick Actions Button */}
        <div className="flex flex-col items-center gap-1 px-3 py-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full text-gray-500 hover:text-tim-green hover:bg-green-50"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <span className="text-xs text-gray-500">Alerts</span>
        </div>
      </div>
    </div>
  );
}