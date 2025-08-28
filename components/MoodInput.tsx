'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader, Mic, MicOff, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MoodInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

export default function MoodInput({ onAnalyze, isLoading }: MoodInputProps) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = [
    "I'm feeling overwhelmed with work today...",
    "I had a great day and feel accomplished!",
    "I'm anxious about an upcoming presentation...",
    "I feel calm and peaceful after my morning walk",
    "I'm frustrated with how things are going lately",
    "I'm excited about new opportunities ahead"
  ];

  useEffect(() => {
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      // For static deployment, use local analysis
      handleLocalAnalysis(text.trim());
    }
  };

  const handleLocalAnalysis = (inputText: string) => {
    setShowSuggestions(false);
    
    // Simple local mood analysis based on keywords
    const happyWords = ['happy', 'joy', 'excited', 'great', 'amazing', 'wonderful', 'fantastic', 'good', 'love', 'awesome'];
    const sadWords = ['sad', 'depressed', 'down', 'upset', 'crying', 'hurt', 'lonely', 'empty', 'hopeless'];
    const anxiousWords = ['anxious', 'worried', 'nervous', 'scared', 'panic', 'stress', 'overwhelmed', 'fear'];
    const calmWords = ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'content', 'balanced'];
    const angryWords = ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'annoyed', 'rage'];
    
    const text = inputText.toLowerCase();
    let detectedMood = 'neutral';
    let confidence = 0.6;
    
    if (happyWords.some(word => text.includes(word))) {
      detectedMood = 'happy';
      confidence = 0.8;
    } else if (sadWords.some(word => text.includes(word))) {
      detectedMood = 'sad';
      confidence = 0.8;
    } else if (anxiousWords.some(word => text.includes(word))) {
      detectedMood = 'anxious';
      confidence = 0.8;
    } else if (calmWords.some(word => text.includes(word))) {
      detectedMood = 'calm';
      confidence = 0.8;
    } else if (angryWords.some(word => text.includes(word))) {
      detectedMood = 'angry';
      confidence = 0.8;
    }
    
    const moodTips: { [key: string]: string[] } = {
      happy: [
        'Keep nurturing the positive energy you\'re feeling today!',
        'Consider sharing your joy with someone you care about.',
        'Take a moment to appreciate what\'s bringing you happiness.'
      ],
      sad: [
        'It\'s okay to feel sad - allow yourself to process these emotions.',
        'Consider reaching out to a friend or loved one for support.',
        'Try gentle activities like listening to music or taking a warm bath.'
      ],
      anxious: [
        'Practice deep breathing: inhale for 4 counts, hold for 4, exhale for 6.',
        'Ground yourself by naming 5 things you can see, 4 you can touch, 3 you can hear.',
        'Remember that anxiety is temporary and you have overcome challenges before.'
      ],
      calm: [
        'Enjoy this peaceful moment and try to remember what brought you here.',
        'Consider practicing gratitude for the tranquility you\'re experiencing.',
        'This is a great time for reflection or creative activities.'
      ],
      angry: [
        'Take some deep breaths and give yourself space to cool down.',
        'Try physical exercise or movement to help release the tension.',
        'Consider what triggered this feeling and how you might address it constructively.'
      ],
      neutral: [
        'Take some time to check in with yourself and your needs.',
        'Consider trying a new activity or reaching out to someone you care about.',
        'Remember that neutral feelings are valid too - you don\'t always need to feel "up".'
      ]
    };
    
    const analysis = {
      mood: detectedMood,
      confidence: confidence,
      tips: moodTips[detectedMood] || moodTips.neutral
    };
    
    // Simulate the original onAnalyze behavior
    setTimeout(() => {
      onAnalyze(text.trim());
      setShowSuggestions(false);
      
      // Trigger the analysis result
      if (window.handleMoodAnalysis) {
        window.handleMoodAnalysis(analysis);
      }
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setText(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      if (!isListening) {
        recognition.start();
        setIsListening(true);
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setText(prev => prev + ' ' + transcript);
          setIsListening(false);
        };
        
        recognition.onerror = () => {
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        recognition.stop();
        setIsListening(false);
      }
    }
  };

  return (
    <div className="relative">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full sparkle opacity-60"></div>
        <div className="absolute top-12 right-8 w-1 h-1 bg-purple-400 rounded-full sparkle opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-green-400 rounded-full sparkle opacity-50" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-100/50 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-green-100 px-4 py-2 rounded-full mb-4">
              <Heart className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-gray-700">Share your feelings</span>
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">How are you feeling today?</h2>
            <p className="text-gray-600">Express your thoughts, emotions, or describe your current state of mind</p>
          </div>

          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="Take your time... share what's on your mind. I'm here to listen and help you understand your emotions better."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="min-h-[140px] resize-none border-2 border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-2xl text-lg leading-relaxed p-6 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              disabled={isLoading}
            />
            
            {/* Voice input button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleVoiceInput}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
                isListening 
                  ? 'bg-red-100 text-red-600 pulse-glow' 
                  : 'hover:bg-blue-100 text-gray-500 hover:text-blue-600'
              }`}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>

            {/* Word counter */}
            <div className="absolute bottom-4 right-4 text-xs text-gray-400">
              {wordCount} words
            </div>
          </div>

          {/* Suggestions */}
          {showSuggestions && !text && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-sm font-medium text-gray-700 mb-3">Need inspiration? Try one of these:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-white/80 p-3 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <Button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] gradient-shift"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 mr-3 animate-spin" />
                <span className="typing-animation">Analyzing your emotions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-3" />
                Analyze My Mood
                <Send className="w-5 h-5 ml-3" />
              </>
            )}
          </Button>

          {/* Encouragement message */}
          <div className="text-center">
            <p className="text-sm text-gray-500 italic">
              Remember: Every feeling is valid, and you're taking a positive step by checking in with yourself 💙
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}