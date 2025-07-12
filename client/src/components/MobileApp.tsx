import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { App } from '@capacitor/app';

interface MobileAppProps {
  children: React.ReactNode;
}

export function MobileApp({ children }: MobileAppProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Set status bar style
          await StatusBar.setStyle({ style: 'light' });
          await StatusBar.setBackgroundColor({ color: '#10B981' });
          
          // Hide splash screen after delay
          setTimeout(async () => {
            await SplashScreen.hide();
            setIsReady(true);
          }, 3000);

          // Handle app state changes
          App.addListener('appStateChange', ({ isActive }) => {
            console.log('App state changed. Is active?', isActive);
          });

        } catch (error) {
          console.error('Error initializing mobile app:', error);
          setIsReady(true);
        }
      } else {
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  // Show loading screen while splash is displayed
  if (Capacitor.isNativePlatform() && !isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-tim-grow-green">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Tim Grow</h1>
          <p className="text-white/80">Loading your business platform...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}