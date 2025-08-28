'use client';

import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import Header from '@/components/Header';
import MoodInput from '@/components/MoodInput';
import MoodResult from '@/components/MoodResult';
import MoodHistory from '@/components/MoodHistory';
import { MoodEntry, MoodAnalysis, ApiResponse } from '@/lib/types';
import { Sparkles, Heart, Brain, TrendingUp, Target, Award } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);

  // Load mood history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('mindmate-mood-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsedHistory.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setMoodHistory(historyWithDates);
      } catch (error) {
        console.error('Failed to parse mood history:', error);
      }
    }
  }, []);

  // Save mood history to localStorage whenever it changes
  useEffect(() => {
    if (moodHistory.length > 0) {
      localStorage.setItem('mindmate-mood-history', JSON.stringify(moodHistory));
    }
  }, [moodHistory]);

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setShowResult(false);
    setAnalysis(null);

    // Set up global handler for mood analysis results
    window.handleMoodAnalysis = (analysisResult: MoodAnalysis) => {
      setAnalysis(analysisResult);
      setShowResult(true);

      // Add to mood history
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        userInput: text,
        mood: analysisResult.mood,
        confidence: analysisResult.confidence,
        tips: analysisResult.tips,
      };

      setMoodHistory(prev => [...prev, newEntry]);
      toast.success('Mood analyzed successfully! 🎉');
      setIsLoading(false);
    };

    // The actual analysis will be handled by MoodInput component
  };

  const getQuickStats = () => {
    if (moodHistory.length === 0) return null;
    
    const last7Days = moodHistory.filter(entry => {
      const daysDiff = Math.floor((new Date().getTime() - new Date(entry.timestamp).getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    });

    const moodCounts: { [key: string]: number } = {};
    moodHistory.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) => 
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b
    )[0];

    return {
      totalEntries: moodHistory.length,
      thisWeek: last7Days.length,
      mostCommon: mostCommonMood
    };
  };

  const stats = getQuickStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl float-animation"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-green-200/20 rounded-full blur-3xl float-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-purple-200/20 rounded-full blur-3xl float-animation" style={{animationDelay: '4s'}}></div>
      </div>

      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-green-100 px-6 py-3 rounded-full mb-6 shadow-lg">
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">AI-Powered Mental Health Companion</span>
            <Sparkles className="w-5 h-5 text-green-600" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent gradient-shift">
              MindMate
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Your personal AI companion for understanding emotions, tracking mental wellness, and discovering personalized strategies for better mental health.
          </p>

          {/* Quick stats */}
          {stats && (
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-blue-100 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-gray-800">{stats.totalEntries}</span>
                  <span className="text-gray-600 text-sm">total entries</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-green-100 shadow-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-gray-800">{stats.thisWeek}</span>
                  <span className="text-gray-600 text-sm">this week</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-purple-100 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-gray-800 capitalize">{stats.mostCommon}</span>
                  <span className="text-gray-600 text-sm">most common</span>
                </div>
              </div>
            </div>
          )}

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link href="/insights" className="group">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-gray-800 mb-2">Smart Insights</h3>
                <p className="text-gray-600 text-sm">Discover patterns and trends in your emotional journey</p>
              </div>
            </Link>
            
            <Link href="/meditation" className="group">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Brain className="w-12 h-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-gray-800 mb-2">Guided Meditation</h3>
                <p className="text-gray-600 text-sm">Find peace with personalized meditation sessions</p>
              </div>
            </Link>
            
            <div className="group">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Target className="w-12 h-12 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-gray-800 mb-2">Personalized Tips</h3>
                <p className="text-gray-600 text-sm">Get AI-powered coping strategies tailored to you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Mood Input Section */}
          <section>
            <MoodInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          </section>

          {/* Mood Result Section */}
          {analysis && (
            <section>
              <MoodResult analysis={analysis} isVisible={showResult} />
            </section>
          )}

          {/* Mood History Section */}
          <section>
            <MoodHistory entries={moodHistory} />
          </section>
        </div>

        {/* Call to Action */}
        {moodHistory.length === 0 && (
          <div className="text-center mt-16 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 border border-blue-100 shadow-lg">
              <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4 float-animation" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Start Your Wellness Journey Today</h3>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                Take the first step towards better mental health. Share how you're feeling and discover personalized insights to support your emotional well-being.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="bg-white px-4 py-2 rounded-full text-sm text-gray-600 border border-gray-200">✨ AI-Powered Analysis</span>
                <span className="bg-white px-4 py-2 rounded-full text-sm text-gray-600 border border-gray-200">🔒 Privacy First</span>
                <span className="bg-white px-4 py-2 rounded-full text-sm text-gray-600 border border-gray-200">📊 Track Progress</span>
                <span className="bg-white px-4 py-2 rounded-full text-sm text-gray-600 border border-gray-200">💡 Personalized Tips</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-gray-200 text-center">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200 mb-8">
            <h4 className="font-bold text-gray-800 mb-2">Important Notice</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              MindMate is a supportive tool designed to help with mood awareness and emotional well-being. 
              <strong className="text-red-700"> This app is not a substitute for professional mental health care.</strong> 
              If you are experiencing severe depression, anxiety, suicidal thoughts, or other serious mental health issues, 
              please seek help from a qualified mental health professional immediately.
            </p>
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="font-semibold text-red-800 text-sm">Crisis Resources:</p>
              <p className="text-red-700 text-sm">
                If you're in crisis, contact the 988 Suicide & Crisis Lifeline (US) at 988 or visit your local emergency room.
              </p>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mb-2">
            Built with ❤️ for mental health awareness and emotional well-being
          </p>
          <p className="text-gray-400 text-xs">
            © 2024 MindMate. Empowering minds, one conversation at a time.
          </p>
        </footer>
      </main>

      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          },
        }}
      />
    </div>
  );
}