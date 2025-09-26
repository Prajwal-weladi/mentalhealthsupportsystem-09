import { useState, useEffect, useCallback } from 'react';

interface VoiceAssistantOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export const useVoiceAssistant = (options: VoiceAssistantOptions = {}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text: string, customOptions?: VoiceAssistantOptions) => {
    if (!isSupported || !isEnabled || !text.trim()) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply options
    const finalOptions = { ...options, ...customOptions };
    utterance.rate = finalOptions.rate || 0.9;
    utterance.pitch = finalOptions.pitch || 1;
    utterance.volume = finalOptions.volume || 0.8;

    // Set voice (prefer female voices for friendliness)
    if (voices.length > 0) {
      const preferredVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('susan')
      ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [isSupported, isEnabled, voices, options]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev);
    if (isSpeaking) {
      stop();
    }
  }, [isSpeaking, stop]);

  return {
    isSupported,
    isSpeaking,
    isEnabled,
    voices,
    speak,
    stop,
    toggle,
  };
};