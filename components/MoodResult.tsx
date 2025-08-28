'use client';

import { useEffect, useState } from 'react';
import { Heart, TrendingUp, Lightbulb, Star, Zap, Target, BookOpen } from 'lucide-react';
import { MoodAnalysis } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface MoodResultProps {
  analysis: MoodAnalysis | null;
  isVisible: boolean;
}

export default function MoodResult({ analysis, isVisible }: MoodResultProps) {
  const [show, setShow] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    if (isVisible && analysis) {
      const timer = setTimeout(() => setShow(true), 200);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible, analysis]);

  useEffect(() => {
    if (analysis && analysis.tips.length > 1) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % analysis.tips.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [analysis]);

  if (!analysis || !isVisible) return null;

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      calm: '😌',
      excited: '🤩',
      angry: '😠',
      neutral: '😐',
      stressed: '😵',
    };
    return moodEmojis[mood.toLowerCase()] || '😐';
  };

  const getMoodColor = (mood: string) => {
    const moodColors: { [key: string]: string } = {
      happy: 'mood-happy',
      sad: 'mood-sad',
      anxious: 'mood-anxious',
      calm: 'mood-calm',
      excited: 'mood-excited',
      angry: 'mood-angry',
      neutral: 'mood-neutral',
      stressed: 'mood-stressed',
    };
    return moodColors[mood.toLowerCase()] || 'mood-neutral';
  };

  const confidencePercentage = Math.round(analysis.confidence * 100);

  return (
    <div className={`transition-all duration-700 transform ${
      show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
    }`}>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-100/50 space-y-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-200/20 to-blue-200/20 rounded-full translate-y-12 -translate-x-12"></div>

        {/* Header */}
        <div className="text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-4">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Analysis Complete</span>
            <Zap className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-6">Your Emotional Insights</h3>
        </div>

        {/* Mood Display */}
        <div className="text-center relative z-10">
          <div className="relative inline-block">
            <div className={`${getMoodColor(analysis.mood)} px-8 py-6 rounded-3xl border-2 shadow-lg transform hover:scale-105 transition-all duration-300`}>
              <div className="flex items-center justify-center space-x-4">
                <span className="text-6xl animate-bounce">{getMoodEmoji(analysis.mood)}</span>
                <div className="text-left">
                  <span className="font-bold capitalize text-2xl block">{analysis.mood}</span>
                  <span className="text-sm opacity-80">Current Mood</span>
                </div>
              </div>
            </div>
            
            {/* Confidence indicator */}
            <div className="mt-4 flex items-center justify-center space-x-3">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <span className="text-lg font-semibold text-gray-700">
                {confidencePercentage}% Confidence
              </span>
            </div>
            
            <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-3 mt-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-3 rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${confidencePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Personalized Tips */}
        <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-center space-x-3 text-gray-700">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <h4 className="font-bold text-xl">Personalized Wellness Tips</h4>
            <Target className="w-6 h-6 text-green-500" />
          </div>
          
          {/* Animated tip carousel */}
          <div className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl p-6 border-2 border-blue-100 min-h-[120px] flex items-center">
            <div className="w-full">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 leading-relaxed text-lg font-medium">
                    {analysis.tips[currentTipIndex]}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-2">
                      {analysis.tips.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentTipIndex ? 'bg-blue-500 w-6' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      Tip {currentTipIndex + 1} of {analysis.tips.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All tips grid */}
          <div className="grid gap-4">
            {analysis.tips.map((tip, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-r from-blue-50/80 to-green-50/80 rounded-xl p-4 border border-blue-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${
                  index === currentTipIndex ? 'ring-2 ring-blue-300 shadow-lg' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed flex-1">{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 relative z-10">
          <Button
            variant="outline"
            className="flex-1 py-3 rounded-xl border-2 border-blue-200 hover:bg-blue-50 transition-all duration-200"
          >
            <Heart className="w-4 h-4 mr-2" />
            Save to Journal
          </Button>
          <Button
            variant="outline"
            className="flex-1 py-3 rounded-xl border-2 border-green-200 hover:bg-green-50 transition-all duration-200"
          >
            <Target className="w-4 h-4 mr-2" />
            Set Mood Goal
          </Button>
        </div>
      </div>
    </div>
  );
}