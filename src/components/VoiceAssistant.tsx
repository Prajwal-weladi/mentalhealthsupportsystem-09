import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VolumeX, Volume2, Mic, MicOff } from 'lucide-react';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';

interface VoiceAssistantProps {
  contextData?: any;
}

const VoiceAssistant = ({ contextData }: VoiceAssistantProps) => {
  const location = useLocation();
  const { isSupported, isSpeaking, isEnabled, speak, stop, toggle } = useVoiceAssistant();
  const [hasGreeted, setHasGreeted] = useState(false);

  // Context-aware messages based on current route and app state
  const getContextualMessage = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/auth':
        return "Welcome to Nirwaan, your mental wellness companion! I'm here to guide you through the platform. To get started, please sign in with your existing account or create a new one by clicking the Sign Up tab. If you're new here, I recommend choosing 'User' to access wellness resources and support.";
      
      case '/app':
        if (contextData?.isFirstTime) {
          return "Great! You've successfully signed in. I'll now guide you through setting up your profile and permissions. This helps us provide personalized mental health support tailored to your needs.";
        }
        return "Welcome back to your Nirwaan dashboard! From here you can access your wellness tools, take assessments, view your progress, or chat with counselors. Let me know if you need help navigating any features.";
      
      default:
        return "I'm here to help you navigate Nirwaan. Feel free to ask me about any features or if you need guidance on using the platform.";
    }
  };

  // Auto-greet when component mounts or route changes
  useEffect(() => {
    if (isSupported && isEnabled && !hasGreeted) {
      const timer = setTimeout(() => {
        speak(getContextualMessage());
        setHasGreeted(true);
      }, 1000); // Small delay for better UX

      return () => clearTimeout(timer);
    }
  }, [isSupported, isEnabled, hasGreeted, location.pathname]);

  // Reset greeting when route changes significantly
  useEffect(() => {
    setHasGreeted(false);
  }, [location.pathname]);

  const handleHelp = () => {
    const helpMessage = getHelpMessage();
    speak(helpMessage);
  };

  const getHelpMessage = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/auth':
        return "To sign in, enter your email and password, then click the Sign In button. If you don't have an account, click the Sign Up tab, fill in your details, choose your role as either User or Counselor, and provide emergency contact information if you're a user.";
      
      case '/app':
        return "You're now in your main dashboard. Here you can take mental health assessments, track your mood, access wellness resources, book counselor sessions, and view your progress over time. Use the navigation menu to explore different sections.";
      
      default:
        return "I can help you navigate through Nirwaan. Each section has specific tools for your mental wellness journey.";
    }
  };

  if (!isSupported) {
    return null; // Don't render if browser doesn't support speech synthesis
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg border-primary/20 bg-white/95 backdrop-blur-sm z-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium text-gray-700">
              AI Voice Assistant
            </span>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggle}
              className="h-8 w-8 p-0"
            >
              {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            {isSpeaking && (
              <Button
                size="sm"
                variant="ghost"
                onClick={stop}
                className="h-8 w-8 p-0"
              >
                <MicOff className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <p className="text-xs text-gray-600 mb-3">
          {isSpeaking 
            ? "Speaking... Click the mic-off button to stop." 
            : isEnabled 
              ? "I'm here to guide you through Nirwaan!"
              : "Voice assistance is disabled."
          }
        </p>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleHelp}
            disabled={!isEnabled || isSpeaking}
            className="flex-1 text-xs"
          >
            <Mic className="h-3 w-3 mr-1" />
            Get Help
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => speak(getContextualMessage())}
            disabled={!isEnabled || isSpeaking}
            className="flex-1 text-xs"
          >
            Repeat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAssistant;