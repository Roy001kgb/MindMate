'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Brain, TrendingUp, Calendar, Target, Award, Lightbulb, BarChart3, Heart } from 'lucide-react';
import { MoodEntry } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Insights() {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('mindmate-mood-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        const historyWithDates = parsedHistory.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setMoodHistory(historyWithDates);
        generateInsights(historyWithDates);
      } catch (error) {
        console.error('Failed to parse mood history:', error);
      }
    }
  }, []);

  const generateInsights = (entries: MoodEntry[]) => {
    if (entries.length === 0) return;

    const now = new Date();
    const last7Days = entries.filter(entry => {
      const daysDiff = Math.floor((now.getTime() - new Date(entry.timestamp).getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    });

    const last30Days = entries.filter(entry => {
      const daysDiff = Math.floor((now.getTime() - new Date(entry.timestamp).getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 30;
    });

    // Mood distribution
    const moodCounts: { [key: string]: number } = {};
    entries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) => 
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b
    )[0];

    // Weekly patterns
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i];
      const dayEntries = entries.filter(entry => new Date(entry.timestamp).getDay() === i);
      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + getMoodScore(entry.mood), 0) / dayEntries.length
        : 0;
      
      return {
        day: dayName,
        avgMood: Math.round(avgMood * 10) / 10,
        count: dayEntries.length
      };
    });

    // Trends
    const recentTrend = last7Days.length >= 2 
      ? getMoodScore(last7Days[last7Days.length - 1].mood) - getMoodScore(last7Days[0].mood)
      : 0;

    setInsights({
      totalEntries: entries.length,
      last7Days: last7Days.length,
      last30Days: last30Days.length,
      mostCommonMood,
      moodDistribution: Object.entries(moodCounts).map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / entries.length) * 100)
      })),
      weeklyPattern: weeklyData,
      trend: recentTrend > 0 ? 'improving' : recentTrend < 0 ? 'declining' : 'stable',
      trendValue: Math.abs(recentTrend),
      averageMood: entries.reduce((sum, entry) => sum + getMoodScore(entry.mood), 0) / entries.length
    });
  };

  const getMoodScore = (mood: string): number => {
    const scores: { [key: string]: number } = {
      happy: 9,
      excited: 8,
      calm: 7,
      neutral: 5,
      anxious: 3,
      sad: 2,
      angry: 2,
      stressed: 1,
    };
    return scores[mood.toLowerCase()] || 5;
  };

  const getMoodEmoji = (mood: string) => {
    const emojis: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      calm: '😌',
      excited: '🤩',
      angry: '😠',
      neutral: '😐',
      stressed: '😵',
    };
    return emojis[mood.toLowerCase()] || '😐';
  };

  if (!insights) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <Brain className="w-24 h-24 text-purple-400 mx-auto mb-6 float-animation" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">No Insights Yet</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Start tracking your mood to unlock personalized insights and discover patterns in your emotional well-being.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full mb-4">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Mental Health{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover patterns, track progress, and gain deeper understanding of your emotional journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium text-sm">Total Entries</p>
                <p className="text-3xl font-bold text-gray-800">{insights.totalEntries}</p>
              </div>
              <Calendar className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium text-sm">This Week</p>
                <p className="text-3xl font-bold text-gray-800">{insights.last7Days}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium text-sm">Average Mood</p>
                <p className="text-3xl font-bold text-gray-800">{insights.averageMood.toFixed(1)}/10</p>
              </div>
              <Heart className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-100 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 font-medium text-sm">Most Common</p>
                <p className="text-2xl font-bold text-gray-800 capitalize flex items-center">
                  {getMoodEmoji(insights.mostCommonMood)} {insights.mostCommonMood}
                </p>
              </div>
              <Award className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-purple-100 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Mood Trend</h3>
                <p className="text-gray-600">Your emotional trajectory</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full ${
                insights.trend === 'improving' ? 'bg-green-100 text-green-800' :
                insights.trend === 'declining' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                <span className="text-2xl">
                  {insights.trend === 'improving' ? '📈' : 
                   insights.trend === 'declining' ? '📉' : '➡️'}
                </span>
                <span className="font-bold capitalize">{insights.trend}</span>
              </div>
              <p className="text-gray-600 mt-2">
                {insights.trend === 'improving' && 'Great progress! Keep up the positive momentum.'}
                {insights.trend === 'declining' && 'Consider focusing on self-care and reaching out for support.'}
                {insights.trend === 'stable' && 'Your mood has been consistent lately.'}
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-100 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Weekly Pattern</h3>
                <p className="text-gray-600">Your mood by day of week</p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.weeklyPattern}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f9ff" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis 
                    domain={[0, 10]}
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value}/10`, 'Average Mood']}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="avgMood" 
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-green-100 shadow-lg mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <Target className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Mood Distribution</h3>
              <p className="text-gray-600">How often you experience different emotions</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {insights.moodDistribution.map((item: any, index: number) => (
              <div key={index} className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
                <div className="text-4xl mb-2">{getMoodEmoji(item.mood)}</div>
                <div className="font-bold text-gray-800 capitalize">{item.mood}</div>
                <div className="text-2xl font-bold text-blue-600">{item.percentage}%</div>
                <div className="text-sm text-gray-500">{item.count} times</div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-200 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <Lightbulb className="w-8 h-8 text-yellow-600" />
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Personalized Recommendations</h3>
              <p className="text-gray-600">Based on your mood patterns</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 rounded-2xl p-6 border border-yellow-200">
              <h4 className="font-bold text-gray-800 mb-3">🎯 Focus Areas</h4>
              <ul className="space-y-2 text-gray-700">
                {insights.trend === 'declining' && (
                  <>
                    <li>• Consider scheduling regular self-care activities</li>
                    <li>• Practice daily mindfulness or meditation</li>
                    <li>• Reach out to friends or family for support</li>
                  </>
                )}
                {insights.trend === 'improving' && (
                  <>
                    <li>• Continue your current positive practices</li>
                    <li>• Set new wellness goals to maintain momentum</li>
                    <li>• Share your success strategies with others</li>
                  </>
                )}
                {insights.trend === 'stable' && (
                  <>
                    <li>• Explore new activities to boost mood variety</li>
                    <li>• Set small challenges for personal growth</li>
                    <li>• Maintain your current healthy routines</li>
                  </>
                )}
              </ul>
            </div>

            <div className="bg-white/80 rounded-2xl p-6 border border-yellow-200">
              <h4 className="font-bold text-gray-800 mb-3">💡 Insights</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• You've been most active on {insights.weeklyPattern.reduce((a: any, b: any) => a.count > b.count ? a : b).day}s</li>
                <li>• Your mood tends to be highest on {insights.weeklyPattern.reduce((a: any, b: any) => a.avgMood > b.avgMood ? a : b).day}s</li>
                <li>• You've tracked {insights.totalEntries} mood entries - great consistency!</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}