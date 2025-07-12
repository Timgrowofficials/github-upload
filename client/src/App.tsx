import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Features from "@/pages/features";
import Pricing from "@/pages/pricing";
import ColorPaletteGenerator from "@/pages/color-palette-generator";
import Dashboard from "@/pages/dashboard-clean";
import Services from "@/pages/services-new";
import BookingPage from "@/pages/booking";
import NotFound from "@/pages/not-found";
import RegisterBusiness from "@/pages/register-business";
import AdminPanel from "@/pages/admin";
import ClientsPage from "@/pages/clients";
import SettingsPage from "@/pages/settings";
import IntegrationsPage from "@/pages/integrations";
import CalendarPage from "@/pages/calendar";
import WebsiteBuilder from "@/pages/website-builder";
import PlatformAdmin from "@/pages/platform-admin";
import AnalyticsPage from "@/pages/analytics";
import PaymentsPage from "@/pages/payments";
import ClientCustomizationPage from "@/pages/client-customization";
import ClientDashboard from "@/pages/client-dashboard";
import ClientMobileNavigation from "@/components/client-mobile-nav";
import MobileNavigation from "@/components/mobile-nav";
import MobileApp from "@/components/mobile/MobileApp";
import { useState, useEffect } from "react";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  const [showMobileApp, setShowMobileApp] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    // Check if running in Capacitor (native app)
    const checkNativeApp = async () => {
      try {
        // @ts-ignore - Capacitor global variable
        if (typeof Capacitor !== 'undefined') {
          const { Capacitor } = await import('@capacitor/core');
          const isNative = Capacitor.isNativePlatform();
          setIsNativeApp(isNative);
          if (isNative && !isAuthenticated) {
            setShowMobileApp(true);
          }
        }
      } catch (error) {
        console.log('Not running in Capacitor');
      }
    };

    checkNativeApp();
  }, [isAuthenticated]);

  const handleMobileAppComplete = () => {
    setShowMobileApp(false);
  };

  // Show mobile app interface if native app and not authenticated
  if (isNativeApp && showMobileApp && !isAuthenticated) {
    return <MobileApp onComplete={handleMobileAppComplete} />;
  }

  return (
    <div className="min-h-screen">
      <Switch>
        {isLoading || !isAuthenticated ? (
          <>
            <Route path="/" component={Landing} />
            <Route path="/features" component={Features} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/color-generator" component={ColorPaletteGenerator} />
            <Route path="/book/:slug" component={BookingPage} />
            <Route path="/client/:slug" component={ClientDashboard} />
          </>
        ) : (
          <>
            <Route path="/" component={Dashboard} />
            <Route path="/features" component={Features} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/color-generator" component={ColorPaletteGenerator} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/register-business" component={RegisterBusiness} />
            <Route path="/services" component={Services} />
            <Route path="/clients" component={ClientsPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/integrations" component={IntegrationsPage} />
            <Route path="/payments" component={PaymentsPage} />
            <Route path="/calendar" component={CalendarPage} />
            <Route path="/analytics" component={AnalyticsPage} />
            <Route path="/website-builder" component={WebsiteBuilder} />
            <Route path="/client-customization" component={ClientCustomizationPage} />
            <Route path="/admin" component={AdminPanel} />
            <Route path="/platform-admin" component={PlatformAdmin} />
            <Route path="/book/:slug" component={BookingPage} />
            <Route path="/client/:slug" component={ClientDashboard} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
      
      {/* Mobile Bottom Navigation - Only show for authenticated users and not on admin or client pages */}
      {isAuthenticated && !isLoading && !location.startsWith('/admin') && !location.startsWith('/client') && !location.includes('/book/') && <MobileNavigation />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
