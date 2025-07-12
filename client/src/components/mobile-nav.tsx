import { useState } from "react";
import { Home, Scissors, Users, Settings, Calendar, Plus, Zap, Globe } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QuickBookingForm from "@/components/quick-booking-form";

export default function MobileNavigation() {
  const [location] = useLocation();
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
      active: location === "/"
    },
    {
      name: "Services",
      href: "/services",
      icon: Scissors,
      active: location === "/services"
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: Calendar,
      active: location === "/calendar"
    },
    {
      name: "Clients",
      href: "/clients",
      icon: Users,
      active: location === "/clients"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      active: location === "/settings"
    }
  ];

  return (
    <>
      {/* Floating Action Button - Quick Booking */}
      <div className="fixed bottom-20 right-4 z-50 md:hidden">
        <Dialog open={isQuickBookingOpen} onOpenChange={setIsQuickBookingOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="h-14 w-14 rounded-full bg-tim-green hover:bg-green-600 mobile-fab border-4 border-white shadow-lg"
            >
              <Plus className="h-6 w-6 text-white" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Quick Booking</DialogTitle>
              <DialogDescription>
                Quickly add a new appointment to your schedule
              </DialogDescription>
            </DialogHeader>
            <QuickBookingForm onSuccess={() => setIsQuickBookingOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <button
                  className={cn(
                    "flex flex-col items-center justify-center h-full w-full transition-all duration-200 tap-highlight-none active:scale-95",
                    item.active
                      ? "text-tim-green"
                      : "text-gray-500 hover:text-gray-700 active:bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "p-1 rounded-lg transition-all duration-200",
                    item.active ? "bg-green-50" : ""
                  )}>
                    <Icon className={cn(
                      "h-5 w-5 mb-1",
                      item.active ? "text-tim-green" : "text-gray-500"
                    )} />
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    item.active ? "text-tim-green font-semibold" : "text-gray-500"
                  )}>
                    {item.name}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}