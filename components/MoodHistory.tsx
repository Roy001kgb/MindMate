'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, BarChart3, PieChart as PieChartIcon, Activity, Award } from 'lucide-react';
import { MoodEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface MoodHistoryProps {
  entries: MoodEntry[];
}

export default function MoodHistory({ entries }: MoodHistoryProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [moodDistribution, setMoodDistribution] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'line' | 'area' | 'pie'>('area');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  const moodColors: { [key: string]: string } = {
    happy: '#fbbf24',
    sad: '#3b82f6',
    anxious: '#f97316',
    calm: '#10b981',
    excited: '#ec4899',
    angry: '#ef4444',
    neutral: '#6b7280',
    stressed: '#8b5cf6',
  };

  useEffect(() => {
    if (entries.length === 0) return;

    // Filter entries based on time range
    const now = new Date();
    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const daysDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (timeRange) {
        case '7d': return daysDiff <= 7;
        case '30d': return daysDiff <= 30;
        default: return true;
      }
    });

    // Prepare chart data
    const chartEntries = filteredEntries.slice(-14).map((entry, index) => {
      const date = new Date(entry.timestamp);
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: entry.mood,
        confidence: entry.confidence,
        moodScore: getMoodScore(entry.mood),
        displayDate: date.toLocaleDateString(),
        color: moodColors[entry.mood.toLowerCase()] || moodColors.neutral
      };
    });
    setChartData(chartEntries);

    // Calculate mood distribution
    const moodCounts: { [key: string]: number } = {};
    filteredEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const distribution = Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      percentage: Math.round((count / filteredEntries.length) * 100),
      color: moodColors[mood.toLowerCase()] || moodColors.neutral
    }));

    setMoodDistribution(distribution);
  }, [entries, timeRange]);

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

  const getAverageMoodScore = () => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, entry) => acc + entry.moodScore, 0);
    return (sum / chartData.length).toFixed(1);
  };

  const getMoodStreak = () => {
    if (entries.length < 2) return 0;
    let streak = 1;
    const recentEntries = entries.slice(-7);
    
    for (let i = recentEntries.length - 2; i >= 0; i--) {
      const currentScore = getMoodScore(recentEntries[i + 1].mood);
      const prevScore = getMoodScore(recentEntries[i].mood);
      
      if (currentScore >= prevScore) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-100/50">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Start Your Mood Journey</h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            Begin tracking your emotions to discover patterns, celebrate progress, and gain valuable insights into your mental well-being.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-100/50 space-y-8">
      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Your Mood Journey</h3>
            <p className="text-gray-600">Track your emotional patterns and progress</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Time range selector */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            {[
              { key: '7d', label: '7 Days' },
              { key: '30d', label: '30 Days' },
              { key: 'all', label: 'All Time' }
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={timeRange === key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(key as any)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  timeRange === key 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Chart type selector */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            {[
              { key: 'area', icon: Activity },
              { key: 'line', icon: BarChart3 },
              { key: 'pie', icon: PieChartIcon }
            ].map(({ key, icon: Icon }) => (
              <Button
                key={key}
                variant={viewMode === key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode(key as any)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === key 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium text-sm">Average Mood</p>
              <p className="text-2xl font-bold text-blue-800">{getAverageMoodScore()}/10</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-medium text-sm">Positive Streak</p>
              <p className="text-2xl font-bold text-green-800">{getMoodStreak()} days</p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-medium text-sm">Total Entries</p>
              <p className="text-2xl font-bold text-purple-800">{entries.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Chart display */}
      {chartData.length > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {(() => {
                if (viewMode === 'area') {
                  return (
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f9ff" />
                      <XAxis 
                        dataKey="day" 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        domain={[0, 10]}
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          `${value}/10`,
                          'Mood Score'
                        ]}
                        labelFormatter={(label, payload: any[]) => {
                          if (payload && payload[0]) {
                            return `${payload[0].payload.mood} - ${payload[0].payload.displayDate}`;
                          }
                          return label;
                        }}
                        contentStyle={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="moodScore" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fill="url(#moodGradient)"
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  );
                } else if (viewMode === 'line') {
                  return (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f9ff" />
                      <XAxis 
                        dataKey="day" 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        domain={[0, 10]}
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value}/10`, 'Mood Score']}
                        labelFormatter={(label, payload: any[]) => {
                          if (payload && payload[0]) {
                            return `${payload[0].payload.mood} - ${payload[0].payload.displayDate}`;
                          }
                          return label;
                        }}
                        contentStyle={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="moodScore" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  );
                } else {
                  return (
                    <PieChart>
                      <Pie
                        data={moodDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ mood, percentage }) => `${mood} (${percentage}%)`}
                      >
                        {moodDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number, name: string, props: any) => [
                          `${value} entries (${props.payload.percentage}%)`,
                          props.payload.mood
                        ]}
                        contentStyle={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                      />
                    </PieChart>
                  );
                }
              })()}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent moods summary */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          Recent Mood Pattern
        </h4>
        <div className="flex flex-wrap gap-3">
          {entries.slice(-10).reverse().map((entry, index) => (
            <div 
              key={entry.id}
              className="group relative"
            >
              <div 
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 hover:scale-110 cursor-pointer ${getMoodColor(entry.mood)}`}
                title={`${entry.mood} - ${new Date(entry.timestamp).toLocaleDateString()}`}
              >
                {entry.mood}
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {new Date(entry.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const getMoodColor = (mood: string) => {
  const moodColors: { [key: string]: string } = {
    happy: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    sad: 'bg-blue-100 text-blue-800 border-blue-300',
    anxious: 'bg-orange-100 text-orange-800 border-orange-300',
    calm: 'bg-green-100 text-green-800 border-green-300',
    excited: 'bg-pink-100 text-pink-800 border-pink-300',
    angry: 'bg-red-100 text-red-800 border-red-300',
    neutral: 'bg-gray-100 text-gray-800 border-gray-300',
    stressed: 'bg-purple-100 text-purple-800 border-purple-300',
  };
  return moodColors[mood.toLowerCase()] || moodColors.neutral;
};