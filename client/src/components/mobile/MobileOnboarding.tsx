import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface MobileOnboardingProps {
  onComplete: () => void;
}

const businessTypes = [
  'Barbershop', 'Beauty', 'Consulting', 'Customer success', 'Dentist', 
  'Hair salon', 'Legal', 'Medical', 'Personal use', 'Real estate', 
  'Recruiting', 'Sales', 'Spa', 'Sports'
];

export default function MobileOnboarding({ onComplete }: MobileOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    brandName: '',
    phoneNumber: '',
    industry: '',
    timezone: 'America - Toronto (EDT)',
    currency: 'Canadian dollar - CAD - $'
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.brandName.trim() !== '' && formData.phoneNumber.trim() !== '';
      case 2:
        return formData.industry !== '';
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center p-4 pt-12 relative">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">
            &lt; STEP {currentStep} OF 3
          </p>
          <h1 className="text-xl font-bold text-gray-900">
            {currentStep === 1 && "Let's start with your brand"}
            {currentStep === 2 && "What's your industry?"}
            {currentStep === 3 && "Confirm your time zone & currency"}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="brandName" className="text-gray-700">Brand name</Label>
                <Input
                  id="brandName"
                  placeholder="Enter your brand name"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="h-12 border-gray-300 focus:border-tim-green focus:ring-tim-green/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-gray-700">Phone number</Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                    <span className="text-2xl mr-2">🇨🇦</span>
                    <span className="text-gray-600">+1</span>
                  </div>
                  <Input
                    id="phoneNumber"
                    placeholder="Phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="h-12 border-gray-300 focus:border-tim-green focus:ring-tim-green/20 rounded-l-none"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-700">Search industries</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                  <SelectTrigger className="h-12 border-gray-300 focus:border-tim-green focus:ring-tim-green/20">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">Options</p>
                <div className="flex flex-wrap gap-2">
                  {businessTypes.map((type) => (
                    <Button
                      key={type}
                      variant={formData.industry === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, industry: type })}
                      className={`rounded-full ${
                        formData.industry === type 
                          ? 'bg-tim-green hover:bg-green-600' 
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-700">Time zone</Label>
                <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                  <SelectTrigger className="h-12 border-gray-300 focus:border-tim-green focus:ring-tim-green/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America - Toronto (EDT)">America - Toronto (EDT)</SelectItem>
                    <SelectItem value="America - New York (EST)">America - New York (EST)</SelectItem>
                    <SelectItem value="America - Los Angeles (PST)">America - Los Angeles (PST)</SelectItem>
                    <SelectItem value="Europe - London (GMT)">Europe - London (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger className="h-12 border-gray-300 focus:border-tim-green focus:ring-tim-green/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Canadian dollar - CAD - $">Canadian dollar - CAD - $</SelectItem>
                    <SelectItem value="US dollar - USD - $">US dollar - USD - $</SelectItem>
                    <SelectItem value="Euro - EUR - €">Euro - EUR - €</SelectItem>
                    <SelectItem value="British pound - GBP - £">British pound - GBP - £</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="p-6 pt-0">
        <Button
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`w-full h-12 rounded-full text-white font-semibold ${
            isStepValid() 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {currentStep === 3 ? 'Complete Setup' : 'Next'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}