import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Copy, Download, RefreshCw, Sparkles, Eye, Check, Menu, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link as WouterLink, useLocation } from 'wouter';

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
}

interface BrandIdentity {
  businessType: string;
  mood: string;
  baseColor: string;
  industry: string;
}

const businessTypes = [
  { value: 'salon', label: 'Hair Salon & Beauty' },
  { value: 'spa', label: 'Spa & Wellness' },
  { value: 'fitness', label: 'Fitness & Gym' },
  { value: 'restaurant', label: 'Restaurant & Food' },
  { value: 'medical', label: 'Medical & Healthcare' },
  { value: 'automotive', label: 'Automotive Services' },
  { value: 'professional', label: 'Professional Services' },
  { value: 'retail', label: 'Retail & Shopping' },
  { value: 'photography', label: 'Photography & Creative' },
  { value: 'education', label: 'Education & Training' }
];

const moods = [
  { value: 'professional', label: 'Professional & Trustworthy' },
  { value: 'modern', label: 'Modern & Trendy' },
  { value: 'elegant', label: 'Elegant & Luxurious' },
  { value: 'vibrant', label: 'Vibrant & Energetic' },
  { value: 'calming', label: 'Calming & Peaceful' },
  { value: 'playful', label: 'Playful & Fun' },
  { value: 'minimalist', label: 'Minimalist & Clean' },
  { value: 'warm', label: 'Warm & Welcoming' }
];

const generatePalette = (identity: BrandIdentity): ColorPalette => {
  const { businessType, mood, baseColor, industry } = identity;
  
  // Convert hex to HSL for better color manipulation
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
  };
  
  // Convert HSL to hex
  const hslToHex = (h: number, s: number, l: number) => {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hue2rgb(p, q, h + 1/3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1/3);
    
    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  
  const [baseH, baseS, baseL] = hexToHsl(baseColor);
  
  // Generate palette based on business type and mood
  const adjustments = {
    salon: { hueShift: 15, satBoost: 10, lightness: 5 },
    spa: { hueShift: -20, satBoost: -15, lightness: 15 },
    fitness: { hueShift: 30, satBoost: 20, lightness: -5 },
    restaurant: { hueShift: -10, satBoost: 5, lightness: 10 },
    medical: { hueShift: 0, satBoost: -20, lightness: 20 },
    automotive: { hueShift: 45, satBoost: 15, lightness: -10 },
    professional: { hueShift: 0, satBoost: -10, lightness: 10 },
    retail: { hueShift: 25, satBoost: 15, lightness: 5 },
    photography: { hueShift: -30, satBoost: 10, lightness: 0 },
    education: { hueShift: 20, satBoost: -5, lightness: 15 }
  };
  
  const moodAdjustments = {
    professional: { satMod: -15, lightMod: 10 },
    modern: { satMod: 10, lightMod: -5 },
    elegant: { satMod: -10, lightMod: 15 },
    vibrant: { satMod: 25, lightMod: -10 },
    calming: { satMod: -20, lightMod: 20 },
    playful: { satMod: 30, lightMod: -5 },
    minimalist: { satMod: -25, lightMod: 25 },
    warm: { satMod: 5, lightMod: 5 }
  };
  
  const typeAdj = adjustments[businessType as keyof typeof adjustments] || adjustments.professional;
  const moodAdj = moodAdjustments[mood as keyof typeof moodAdjustments] || moodAdjustments.professional;
  
  return {
    primary: baseColor,
    secondary: hslToHex(
      (baseH + typeAdj.hueShift) % 360,
      Math.max(0, Math.min(100, baseS + typeAdj.satBoost + moodAdj.satMod)),
      Math.max(0, Math.min(100, baseL + typeAdj.lightness + moodAdj.lightMod))
    ),
    accent: hslToHex(
      (baseH + typeAdj.hueShift * 2) % 360,
      Math.max(0, Math.min(100, baseS + typeAdj.satBoost + moodAdj.satMod + 10)),
      Math.max(0, Math.min(100, baseL - 10))
    ),
    background: hslToHex(
      baseH,
      Math.max(0, Math.min(100, baseS - 40)),
      Math.max(0, Math.min(100, 95))
    ),
    text: hslToHex(
      baseH,
      Math.max(0, Math.min(100, baseS - 30)),
      Math.max(0, Math.min(100, 15))
    ),
    muted: hslToHex(
      baseH,
      Math.max(0, Math.min(100, baseS - 20)),
      Math.max(0, Math.min(100, 60))
    )
  };
};

export default function ColorPaletteGenerator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [identity, setIdentity] = useState<BrandIdentity>({
    businessType: 'salon',
    mood: 'professional',
    baseColor: '#10b981',
    industry: 'beauty'
  });
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newPalette = generatePalette(identity);
    setPalette(newPalette);
    setIsGenerating(false);
    toast({
      title: "Palette Generated!",
      description: "Your custom color palette is ready.",
    });
  };

  const copyToClipboard = async (color: string, colorName: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
      toast({
        title: "Copied!",
        description: `${colorName} color ${color} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy color to clipboard.",
        variant: "destructive"
      });
    }
  };

  const exportPalette = () => {
    if (!palette) return;
    
    const css = `
/* Generated Color Palette */
:root {
  --primary: ${palette.primary};
  --secondary: ${palette.secondary};
  --accent: ${palette.accent};
  --background: ${palette.background};
  --text: ${palette.text};
  --muted: ${palette.muted};
}
    `;
    
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.css';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported!",
      description: "Color palette exported as CSS file.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <WouterLink href="/">
              <div className="flex items-center cursor-pointer">
                <div className="text-2xl font-bold">
                  <span className="text-black">Tim</span>
                  <span className="text-tim-green">Grow</span>
                  <span className="text-red-500">.</span>
                </div>
              </div>
            </WouterLink>
            
            <div className="hidden md:flex items-center space-x-8">
              <WouterLink href="/features" className="text-gray-600 hover:text-tim-green transition-colors font-medium">Features</WouterLink>
              <WouterLink href="/pricing" className="text-gray-600 hover:text-tim-green transition-colors font-medium">Pricing</WouterLink>
              <WouterLink href="/color-generator" className="text-tim-green font-semibold">Color Generator</WouterLink>
              <WouterLink href="/book/demo" className="text-gray-600 hover:text-tim-green transition-colors font-medium">Demo</WouterLink>
              <Button variant="ghost" className="text-tim-navy hover:bg-tim-green/10">
                <a href="/api/login">Sign In</a>
              </Button>
              <Button 
                onClick={() => setLocation("/dashboard")}
                className="bg-gradient-to-r from-tim-green to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <WouterLink href="/features" className="block px-3 py-2 text-gray-600 hover:text-tim-green font-medium">Features</WouterLink>
              <WouterLink href="/pricing" className="block px-3 py-2 text-gray-600 hover:text-tim-green font-medium">Pricing</WouterLink>
              <WouterLink href="/color-generator" className="block px-3 py-2 text-tim-green font-semibold">Color Generator</WouterLink>
              <WouterLink href="/book/demo" className="block px-3 py-2 text-gray-600 hover:text-tim-green font-medium">Demo</WouterLink>
              <div className="pt-2 space-y-2">
                <Button variant="ghost" className="w-full justify-start text-tim-navy">
                  <a href="/api/login">Sign In</a>
                </Button>
                <Button 
                  onClick={() => setLocation("/dashboard")}
                  className="w-full bg-gradient-to-r from-tim-green to-green-600 text-white font-semibold"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full mb-6">
            <Palette className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-900">AI-Powered Design</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Smart Color{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Palette Generator
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate professional color palettes tailored to your brand identity and business type. 
            Perfect for booking pages, websites, and marketing materials.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                Brand Identity
              </CardTitle>
              <CardDescription>
                Tell us about your business to generate the perfect color palette
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business Type */}
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select 
                  value={identity.businessType} 
                  onValueChange={(value) => setIdentity({...identity, businessType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mood */}
              <div className="space-y-2">
                <Label htmlFor="mood">Brand Mood</Label>
                <Select 
                  value={identity.mood} 
                  onValueChange={(value) => setIdentity({...identity, mood: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select desired mood" />
                  </SelectTrigger>
                  <SelectContent>
                    {moods.map(mood => (
                      <SelectItem key={mood.value} value={mood.value}>
                        {mood.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Base Color */}
              <div className="space-y-2">
                <Label htmlFor="baseColor">Base Color</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={identity.baseColor}
                    onChange={(e) => setIdentity({...identity, baseColor: e.target.value})}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={identity.baseColor}
                    onChange={(e) => setIdentity({...identity, baseColor: e.target.value})}
                    placeholder="#10b981"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Palette
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 text-purple-600 mr-2" />
                Generated Palette
              </CardTitle>
              <CardDescription>
                Your custom color palette based on brand identity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {palette ? (
                <div className="space-y-6">
                  {/* Color Swatches */}
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(palette).map(([name, color]) => (
                      <div key={name} className="group">
                        <div 
                          className="w-full h-20 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
                          style={{ backgroundColor: color }}
                          onClick={() => copyToClipboard(color, name)}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900 capitalize">{name}</p>
                            <p className="text-xs text-gray-500">{color}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(color, name)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedColor === color ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Preview */}
                  <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: palette.background }}>
                    <h3 className="text-lg font-bold mb-3" style={{ color: palette.text }}>
                      Preview
                    </h3>
                    <div className="space-y-3">
                      <div 
                        className="px-4 py-2 rounded-lg font-medium"
                        style={{ backgroundColor: palette.primary, color: 'white' }}
                      >
                        Primary Button
                      </div>
                      <div 
                        className="px-4 py-2 rounded-lg font-medium"
                        style={{ backgroundColor: palette.secondary, color: 'white' }}
                      >
                        Secondary Button
                      </div>
                      <div 
                        className="px-4 py-2 rounded-lg font-medium"
                        style={{ backgroundColor: palette.accent, color: 'white' }}
                      >
                        Accent Element
                      </div>
                      <p style={{ color: palette.muted }}>
                        Sample text in muted color for descriptions and secondary content.
                      </p>
                    </div>
                  </div>

                  {/* Export Button */}
                  <Button 
                    onClick={exportPalette}
                    variant="outline"
                    className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export as CSS
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Generate a palette to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}