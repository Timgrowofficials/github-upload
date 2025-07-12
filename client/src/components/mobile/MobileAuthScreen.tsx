import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Apple, Mail } from 'lucide-react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

interface MobileAuthScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

export default function MobileAuthScreen({ onBack, onContinue }: MobileAuthScreenProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSocialAuth = (provider: string) => {
    // Handle social authentication
    console.log(`Authenticating with ${provider}`);
    // For demo purposes, continue to app
    setTimeout(() => onContinue(), 1000);
  };

  const handleEmailAuth = () => {
    // Handle email authentication
    console.log('Authenticating with email');
    // For demo purposes, continue to app
    setTimeout(() => onContinue(), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-800">
          {showEmailForm ? 'Login' : 'Welcome'}
        </h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 px-6 py-8">
        {!showEmailForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Logo */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto bg-tim-green rounded-full flex items-center justify-center shadow-lg mb-4">
                <svg viewBox="0 0 64 64" className="w-10 h-10">
                  <path d="M20 45 Q20 25 32 15 Q44 25 44 45 Q44 50 38 52 Q32 50 26 52 Q20 50 20 45 Z" 
                        fill="white" 
                        stroke="white" 
                        strokeWidth="1"/>
                  <rect x="30" y="45" width="4" height="12" fill="white" rx="2"/>
                  <text x="32" y="38" textAnchor="middle" 
                        fontFamily="Arial, sans-serif" 
                        fontSize="18" 
                        fontWeight="bold" 
                        fill="#16a34a">T</text>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Get started for free.</h2>
              <p className="text-gray-600 text-sm">
                Join thousands of businesses growing with Tim Grow
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-12 bg-white border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
                onClick={() => handleSocialAuth('Apple')}
              >
                <Apple className="w-5 h-5 mr-3" />
                Continue with Apple
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 bg-white border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
                onClick={() => handleSocialAuth('Google')}
              >
                <FaGoogle className="w-5 h-5 mr-3" />
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 bg-white border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
                onClick={() => handleSocialAuth('Facebook')}
              >
                <FaFacebook className="w-5 h-5 mr-3 text-blue-600" />
                Continue with Facebook
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-50 px-2 text-gray-500">or</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 bg-white border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
                onClick={() => setShowEmailForm(true)}
              >
                <Mail className="w-5 h-5 mr-3" />
                Continue with email
              </Button>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By signing up, you agree to our{' '}
              <a href="#" className="text-tim-green hover:underline">Terms of use</a>
              {' '}&{' '}
              <a href="#" className="text-tim-green hover:underline">Privacy policy</a>
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login to your account.</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-gray-300 focus:border-tim-green focus:ring-tim-green/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-gray-300 focus:border-tim-green focus:ring-tim-green/20"
                />
              </div>

              <div className="text-right">
                <a href="#" className="text-sm text-tim-green hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button
                className="w-full h-12 bg-tim-green hover:bg-green-600 text-white font-semibold"
                onClick={handleEmailAuth}
                disabled={!email || !password}
              >
                Log in
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}