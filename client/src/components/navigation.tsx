import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, Bell } from "lucide-react";
import { Link } from "wouter";
import NotificationsPanel from "@/components/notifications-panel";

interface NavigationProps {
  businessName?: string;
}

export default function Navigation({ businessName }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-black">Tim</span>
              <span className="text-tim-green">Grow</span>
              <span className="text-red-500">.</span>
            </Link>
            {businessName && (
              <div className="ml-6 text-sm text-muted-foreground">
                {businessName}
              </div>
            )}
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NotificationsPanel>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                  </Button>
                </NotificationsPanel>
                <Avatar>
                  <AvatarImage src={(user as any)?.profileImageUrl || undefined} />
                  <AvatarFallback>
                    {(user as any)?.firstName?.[0] || (user as any)?.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" onClick={() => window.location.href = "/api/logout"}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => window.location.href = "/api/login"}>
                  Sign In
                </Button>
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  className="bg-tim-green hover:bg-green-600"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Header Actions */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && (
              <NotificationsPanel>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                </Button>
              </NotificationsPanel>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="px-4 py-2 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 py-2">
                  <Avatar>
                    <AvatarImage src={(user as any)?.profileImageUrl || undefined} />
                    <AvatarFallback>
                      {(user as any)?.firstName?.[0] || (user as any)?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {(user as any)?.firstName || (user as any)?.email}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => window.location.href = "/api/login"}
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  className="w-full bg-tim-green hover:bg-green-600 mt-2"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
