import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './SplashScreen';
import MobileAuthScreen from './MobileAuthScreen';
import MobileOnboarding from './MobileOnboarding';

interface MobileAppProps {
  onComplete: () => void;
}

export default function MobileApp({ onComplete }: MobileAppProps) {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'auth' | 'onboarding' | 'app'>('splash');
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    // Check if running in Capacitor (native app)
    const checkNativeApp = async () => {
      try {
        // @ts-ignore - Capacitor global variable
        if (typeof Capacitor !== 'undefined') {
          const { Capacitor } = await import('@capacitor/core');
          setIsNativeApp(Capacitor.isNativePlatform());
        }
      } catch (error) {
        console.log('Not running in Capacitor');
      }
    };

    checkNativeApp();
  }, []);

  // Only show mobile app interface if running as native app
  if (!isNativeApp) {
    return null;
  }

  const handleSplashComplete = () => {
    setCurrentScreen('auth');
  };

  const handleAuthBack = () => {
    setCurrentScreen('splash');
  };

  const handleAuthContinue = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('app');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SplashScreen onComplete={handleSplashComplete} />
          </motion.div>
        )}

        {currentScreen === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <MobileAuthScreen onBack={handleAuthBack} onContinue={handleAuthContinue} />
          </motion.div>
        )}

        {currentScreen === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <MobileOnboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}