import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const VoiceChatInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for browser support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionClass();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Please try speaking again.",
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      // Get available voices and prefer female voices for friendliness
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen')
      ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getMentalHealthResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Mental health support responses
    if (input.includes('anxious') || input.includes('anxiety') || input.includes('worried')) {
      return "I understand you're feeling anxious. Try taking slow, deep breaths. Breathe in for 4 counts, hold for 4, and exhale for 6. Remember, anxiety is temporary and you have the strength to get through this. Would you like to try a breathing exercise together?";
    }
    
    if (input.includes('sad') || input.includes('depressed') || input.includes('down')) {
      return "I'm sorry you're feeling this way. Your feelings are valid, and it's okay to have difficult days. Sometimes talking about what's bothering you can help. Have you been able to do any activities that usually bring you joy recently?";
    }
    
    if (input.includes('stress') || input.includes('overwhelmed')) {
      return "Feeling stressed can be really challenging. Let's break things down into smaller, manageable pieces. What's the most pressing thing on your mind right now? Sometimes focusing on just one thing at a time can make everything feel more manageable.";
    }
    
    if (input.includes('sleep') || input.includes('tired') || input.includes('insomnia')) {
      return "Sleep is so important for mental health. Try establishing a bedtime routine: no screens 1 hour before bed, keep your room cool and dark, and try some gentle stretching or meditation. Good sleep hygiene can really improve how you feel during the day.";
    }
    
    if (input.includes('anger') || input.includes('angry') || input.includes('frustrated')) {
      return "It's natural to feel angry sometimes. When anger comes up, try the 5-4-3-2-1 grounding technique: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This can help bring you back to the present moment.";
    }
    
    if (input.includes('help') || input.includes('support')) {
      return "I'm here to support you. Remember that seeking help is a sign of strength, not weakness. If you're having thoughts of self-harm, please reach out to a crisis helpline immediately. For ongoing support, consider speaking with a counselor or therapist.";
    }
    
    if (input.includes('breathing') || input.includes('breathe')) {
      return "Let's do a breathing exercise together. I'll guide you: Breathe in slowly for 4 counts... 1, 2, 3, 4. Hold for 4 counts... 1, 2, 3, 4. Now breathe out slowly for 6 counts... 1, 2, 3, 4, 5, 6. Great job! How do you feel?";
    }
    
    if (input.includes('meditation') || input.includes('mindfulness')) {
      return "Mindfulness can be very helpful for mental wellness. Try this: Focus on your breath, and when your mind wanders, gently bring your attention back. Even 5 minutes a day can make a difference. There are also great apps like Headspace or Calm that can guide you.";
    }
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! I'm your AI mental wellness companion. I'm here to provide support, coping strategies, and a listening ear. How are you feeling today? Remember, this is a safe space to share whatever is on your mind.";
    }
    
    if (input.includes('thank')) {
      return "You're very welcome. I'm glad I could help. Remember, taking care of your mental health is an ongoing journey, and every small step counts. Is there anything else you'd like to talk about?";
    }
    
    // Default supportive response
    return "I hear you, and I want you to know that your feelings matter. Sometimes just talking about what's on your mind can be helpful. Can you tell me more about what you're experiencing? Remember, you don't have to go through this alone.";
  };

  const handleUserMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate AI response
    const aiResponse = getMentalHealthResponse(text);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      isUser: false,
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages(prev => [...prev, aiMessage]);
      speak(aiResponse);
    }, 500);
  };

  if (!isSupported) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Voice chat is not supported in this browser. Please use a modern browser like Chrome or Edge.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8 h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          AI Mental Health Voice Chat
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Speak with your AI wellness companion. Click the microphone to start talking.
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-96">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation by clicking the microphone button below.</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Voice Controls */}
        <div className="flex justify-center items-center gap-4 pt-4 border-t">
          <Button
            size="lg"
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
            className={`rounded-full h-16 w-16 ${
              isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
          
          {isSpeaking && (
            <Button
              size="lg"
              onClick={stopSpeaking}
              variant="outline"
              className="rounded-full h-12 w-12"
            >
              <VolumeX className="h-5 w-5" />
            </Button>
          )}
          
          <div className="text-sm text-muted-foreground">
            {isListening && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Listening...
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Speaking...
              </div>
            )}
            {!isListening && !isSpeaking && (
              <span>Click microphone to speak</span>
            )}
          </div>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-2">
          This is an AI assistant and not a replacement for professional mental health care.
          If you're in crisis, please contact emergency services or a crisis helpline.
        </p>
      </CardContent>
    </Card>
  );
};

export default VoiceChatInterface;