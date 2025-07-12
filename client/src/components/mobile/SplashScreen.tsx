import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-tim-green via-green-600 to-green-700 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16"
            >
              <svg viewBox="0 0 64 64" className="w-full h-full">
                <defs>
                  <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#16a34a', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#15803d', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                
                {/* Leaf shape representing growth */}
                <path d="M20 45 Q20 25 32 15 Q44 25 44 45 Q44 50 38 52 Q32 50 26 52 Q20 50 20 45 Z" 
                      fill="url(#leafGradient)" 
                      stroke="#15803d" 
                      strokeWidth="1"/>
                
                {/* Stem */}
                <rect x="30" y="45" width="4" height="12" fill="#15803d" rx="2"/>
                
                {/* Letter T for Tim */}
                <text x="32" y="38" textAnchor="middle" 
                      fontFamily="Arial, sans-serif" 
                      fontSize="20" 
                      fontWeight="bold" 
                      fill="white">T</text>
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* App Name */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl font-bold text-white mb-2"
        >
          Tim Grow
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/90 text-lg mb-12"
        >
          Time to Grow Your Business
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '12rem', opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mx-auto bg-white/30 rounded-full h-1 overflow-hidden"
        >
          <motion.div
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-white/80 text-sm mt-4"
        >
          Loading your business dashboard...
        </motion.p>
      </div>
    </div>
  );
}