import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/useAuth';
import { Brain, Heart, UserCheck, Stethoscope } from 'lucide-react';

export default function Auth() {
  const { user, signIn, signUp, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'patient' as 'patient' | 'counselor',
    parentPhone: '',
    emergencyContactName: '',
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/app" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      await signUp(formData.email, formData.password, formData.fullName, formData.role, formData.parentPhone, formData.emergencyContactName);
    } else {
      await signIn(formData.email, formData.password);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden animated-bg">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large floating orbs */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-kawaii-blue/20 rounded-full animate-float blur-2xl"></div>
        <div className="absolute top-40 right-32 w-32 h-32 bg-kawaii-pink/25 rounded-full animate-bounce-gentle blur-xl" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-48 h-48 bg-kawaii-purple/15 rounded-full animate-sparkle blur-3xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-36 h-36 bg-kawaii-green/20 rounded-full animate-heartbeat blur-xl" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-28 h-28 bg-kawaii-yellow/30 rounded-full animate-wiggle blur-lg" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Medium floating shapes */}
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-accent/25 rounded-full animate-bounce-gentle blur-md" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-24 h-24 bg-primary/20 rounded-full animate-float blur-lg" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-16 h-16 bg-secondary/30 rounded-full animate-sparkle blur-sm" style={{ animationDelay: '3s' }}></div>
        
        {/* Triangle shapes */}
        <div className="absolute top-60 left-1/2 animate-wiggle" style={{ animationDelay: '1.2s' }}>
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-kawaii-blue/40 blur-sm"></div>
        </div>
        <div className="absolute bottom-1/2 right-10 animate-bounce-gentle" style={{ animationDelay: '2.8s' }}>
          <div className="w-0 h-0 border-l-6 border-r-6 border-b-10 border-l-transparent border-r-transparent border-b-kawaii-pink/50 blur-sm"></div>
        </div>
        
        {/* Star shapes */}
        <div className="absolute top-1/3 left-10 animate-sparkle" style={{ animationDelay: '0.3s' }}>
          <div className="relative">
            <div className="w-3 h-3 bg-kawaii-yellow/60 transform rotate-45 blur-sm"></div>
            <div className="w-3 h-3 bg-kawaii-yellow/60 transform -rotate-45 absolute top-0 blur-sm"></div>
          </div>
        </div>
        <div className="absolute bottom-1/4 right-1/2 animate-rainbow-shift" style={{ animationDelay: '1.8s' }}>
          <div className="relative">
            <div className="w-2 h-2 bg-kawaii-purple/70 transform rotate-45 blur-sm"></div>
            <div className="w-2 h-2 bg-kawaii-purple/70 transform -rotate-45 absolute top-0 blur-sm"></div>
          </div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-10 right-1/3 w-2 h-2 bg-primary/50 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/2 left-10 w-1 h-1 bg-accent/60 rounded-full animate-sparkle" style={{ animationDelay: '2.2s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-secondary/40 rounded-full animate-bounce-gentle" style={{ animationDelay: '3.5s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Animated Header */}
          <div className="text-center mb-8 fade-in-up">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="floating-animation">
                <Brain className="h-10 w-10 text-primary animate-heartbeat" />
              </div>
              <h1 className="text-4xl font-bold text-gradient rainbow-text">Nirwaan</h1>
            </div>
            <p className="text-muted-foreground text-lg animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              A Journey to peace of mind ✨
            </p>
          </div>

          {/* Animated Card */}
          <Card className="shadow-anime border-0 card-anime fade-in-up backdrop-blur-sm bg-white/90" style={{ animationDelay: '0.8s' }}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gradient fade-in" style={{ animationDelay: '1s' }}>
                {isSignUp ? '✨ Create Account ✨' : '💕 Welcome Back! 💕'}
              </CardTitle>
              <CardDescription className="animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                {isSignUp 
                  ? 'Join Nirwaan to start your kawaii wellness journey! (｡◕‿◕｡)' 
                  : 'Sign in to continue your wellness adventure! ヽ(´▽`)/'}
              </CardDescription>
            </CardHeader>
            <CardContent className="animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
              <Tabs value={isSignUp ? 'signup' : 'signin'} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-kawaii-pink/10 p-1">
                  <TabsTrigger 
                    value="signin" 
                    onClick={() => setIsSignUp(false)}
                    className="kawaii-button transition-all duration-300 hover:scale-105"
                  >
                    <Heart className="w-4 h-4 mr-2 animate-heartbeat" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    onClick={() => setIsSignUp(true)}
                    className="kawaii-button transition-all duration-300 hover:scale-105"
                  >
                    <UserCheck className="w-4 h-4 mr-2 animate-sparkle" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4 slide-up">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2 fade-in" style={{ animationDelay: '1.6s' }}>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <span>✉️ Email</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email (◕‿◕)"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="transition-all duration-300 hover:shadow-kawaii focus:shadow-glow-primary border-kawaii-pink/30"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 fade-in" style={{ animationDelay: '1.8s' }}>
                      <Label htmlFor="password" className="flex items-center gap-2">
                        <span>🔒 Password</span>
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password ヾ(＾-＾)ノ"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="transition-all duration-300 hover:shadow-kawaii focus:shadow-glow-primary border-kawaii-pink/30"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full kawaii-button hover:animate-wiggle transition-all duration-300 hover:scale-105 fade-in" 
                      style={{ animationDelay: '2s' }}
                    >
                      <Heart className="w-4 h-4 mr-2 animate-heartbeat" />
                      Sign In ✨
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 slide-up">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2 fade-in" style={{ animationDelay: '1.6s' }}>
                      <Label htmlFor="fullName" className="flex items-center gap-2">
                        <span>👤 Full Name</span>
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your kawaii name (◕‿◕)♡"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="transition-all duration-300 hover:shadow-kawaii focus:shadow-glow-primary border-kawaii-blue/30"
                        required
                      />
                    </div>

                    <div className="space-y-2 fade-in" style={{ animationDelay: '1.8s' }}>
                      <Label htmlFor="signup-email" className="flex items-center gap-2">
                        <span>✉️ Email</span>
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email (´∀｀)♡"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="transition-all duration-300 hover:shadow-kawaii focus:shadow-glow-primary border-kawaii-blue/30"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 fade-in" style={{ animationDelay: '2s' }}>
                      <Label htmlFor="signup-password" className="flex items-center gap-2">
                        <span>🔒 Password</span>
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a strong password ٩(◕‿◕)۶"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="transition-all duration-300 hover:shadow-kawaii focus:shadow-glow-primary border-kawaii-blue/30"
                        required
                      />
                    </div>

                    <div className="space-y-3 fade-in" style={{ animationDelay: '2.2s' }}>
                      <Label className="flex items-center gap-2">
                        <span>🎭 Account Type</span>
                      </Label>
                      <RadioGroup 
                        value={formData.role} 
                        onValueChange={(value) => handleInputChange('role', value)}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-kawaii-pink/10 transition-all duration-300 hover:shadow-kawaii hover:scale-102 card-hover">
                          <RadioGroupItem value="patient" id="patient" />
                          <Label htmlFor="patient" className="flex items-center gap-2 cursor-pointer flex-1">
                            <UserCheck className="w-4 h-4 text-kawaii-blue animate-bounce-gentle" />
                            <div>
                              <div className="font-medium">User 💙</div>
                              <div className="text-sm text-muted-foreground">Seek mental wellness support (◕‿◕)</div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-kawaii-green/10 transition-all duration-300 hover:shadow-kawaii hover:scale-102 card-hover">
                          <RadioGroupItem value="counselor" id="counselor" />
                          <Label htmlFor="counselor" className="flex items-center gap-2 cursor-pointer flex-1">
                            <Stethoscope className="w-4 h-4 text-kawaii-green animate-sparkle" />
                            <div>
                              <div className="font-medium">Counselor 💚</div>
                              <div className="text-sm text-muted-foreground">Provide mental health support ヽ(´▽`)/</div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Emergency Contact Information - Only for users */}
                    {formData.role === 'patient' && (
                      <>
                        <div className="space-y-2 fade-in" style={{ animationDelay: '2.4s' }}>
                          <Label htmlFor="emergencyContactName" className="flex items-center gap-2">
                            <span>👨‍👩‍👧‍👦 Emergency Contact Name</span>
                          </Label>
                          <Input
                            id="emergencyContactName"
                            type="text"
                            placeholder="Parent/Guardian name (◕‿◕)♡"
                            value={formData.emergencyContactName}
                            onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                            className="transition-all duration-300 hover:shadow-kawaii focus:shadow-glow-primary border-kawaii-purple/30"
                            required
                          />
                        </div>

                        <div className="space-y-2 fade-in" style={{ animationDelay: '2.6s' }}>
                          <Label htmlFor="parentPhone" className="flex items-center gap-2">
                            <span>📞 Emergency Contact Phone</span>
                          </Label>
                          <Input
                            id="parentPhone"
                            type="tel"
                            placeholder="Parent/Guardian phone ヾ(＾-＾)ノ"
                            value={formData.parentPhone}
                            onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                            className="transition-all duration-300 hover:shadow-kawaii focus:shadow-glow-primary border-kawaii-purple/30"
                            required
                          />
                        </div>
                      </>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full kawaii-button hover:animate-wiggle transition-all duration-300 hover:scale-105 fade-in"
                      style={{ animationDelay: '2.8s' }}
                    >
                      <Heart className="w-4 h-4 mr-2 animate-heartbeat" />
                      Create Account ✨
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Animated Footer */}
          <div className="text-center mt-6 text-sm text-muted-foreground fade-in-up" style={{ animationDelay: '3s' }}>
            <p className="flex items-center justify-center gap-2">
              <span>✨</span>
              By continuing, you agree to our 
              <button className="text-primary hover:underline transition-colors duration-300">Terms of Service</button> 
              and 
              <button className="text-primary hover:underline transition-colors duration-300">Privacy Policy</button>
              <span>✨</span>
            </p>
            <div className="mt-2 flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 text-kawaii-pink animate-heartbeat" />
              <span className="text-xs">Made with love for your wellness journey</span>
              <Heart className="w-3 h-3 text-kawaii-pink animate-heartbeat" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}