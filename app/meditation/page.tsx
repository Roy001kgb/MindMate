'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import { Play, Pause, RotateCcw, Heart, Leaf, Sun, Moon, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Meditation() {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(300); // 5 minutes default
  const [selectedDuration, setSelectedDuration] = useState(300);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [selectedTheme, setSelectedTheme] = useState('calm');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const themes = {
    calm: {
      name: 'Ocean Calm',
      icon: Cloud,
      gradient: 'from-blue-400 to-cyan-300',
      breathColor: 'bg-blue-500',
      description: 'Gentle waves and peaceful breathing'
    },
    forest: {
      name: 'Forest Peace',
      icon: Leaf,
      gradient: 'from-green-400 to-emerald-300',
      breathColor: 'bg-green-500',
      description: 'Connect with nature\'s tranquility'
    },
    sunrise: {
      name: 'Golden Dawn',
      icon: Sun,
      gradient: 'from-yellow-400 to-orange-300',
      breathColor: 'bg-yellow-500',
      description: 'Start fresh with morning energy'
    },
    night: {
      name: 'Starry Night',
      icon: Moon,
      gradient: 'from-purple-400 to-indigo-300',
      breathColor: 'bg-purple-500',
      description: 'Wind down with evening serenity'
    }
  };

  const durations = [
    { value: 180, label: '3 min' },
    { value: 300, label: '5 min' },
    { value: 600, label: '10 min' },
    { value: 900, label: '15 min' },
    { value: 1200, label: '20 min' }
  ];

  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      // Meditation completed
      playCompletionSound();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, time]);

  useEffect(() => {
    if (isActive) {
      startBreathingCycle();
    } else {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
    }

    return () => {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
    };
  }, [isActive]);

  const startBreathingCycle = () => {
    let phase: 'inhale' | 'hold' | 'exhale' = 'inhale';
    let phaseTime = 0;
    
    breathIntervalRef.current = setInterval(() => {
      phaseTime++;
      
      if (phase === 'inhale' && phaseTime >= 4) {
        phase = 'hold';
        phaseTime = 0;
        setBreathPhase('hold');
      } else if (phase === 'hold' && phaseTime >= 2) {
        phase = 'exhale';
        phaseTime = 0;
        setBreathPhase('exhale');
      } else if (phase === 'exhale' && phaseTime >= 6) {
        phase = 'inhale';
        phaseTime = 0;
        setBreathPhase('inhale');
      }
    }, 1000);
  };

  const playCompletionSound = () => {
    // Create a simple completion tone
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(selectedDuration);
    setBreathPhase('inhale');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe In...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
    }
  };

  const currentTheme = themes[selectedTheme as keyof typeof themes];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} transition-all duration-1000`}>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Heart className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">Mindful Meditation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Find Your Inner{' '}
            <span className="text-white/90">
              Peace
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Take a moment to breathe, relax, and reconnect with yourself through guided meditation
          </p>
        </div>

        {/* Theme Selector */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-white/20">
          <h3 className="text-white font-bold text-lg mb-4 text-center">Choose Your Atmosphere</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(themes).map(([key, theme]) => {
              const Icon = theme.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedTheme(key)}
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    selectedTheme === key 
                      ? 'bg-white/30 border-2 border-white/50 scale-105' 
                      : 'bg-white/10 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white font-medium text-sm">{theme.name}</div>
                  <div className="text-white/70 text-xs mt-1">{theme.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Meditation Interface */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-white/20 text-center">
          {/* Breathing Circle */}
          <div className="relative mb-8">
            <div className={`w-64 h-64 mx-auto rounded-full ${currentTheme.breathColor} opacity-20 transition-all duration-1000 ${
              isActive ? (breathPhase === 'inhale' ? 'scale-110' : breathPhase === 'exhale' ? 'scale-90' : 'scale-100') : 'scale-100'
            } breathe`}></div>
            <div className={`absolute inset-0 w-48 h-48 m-auto rounded-full ${currentTheme.breathColor} opacity-40 transition-all duration-1000 ${
              isActive ? (breathPhase === 'inhale' ? 'scale-110' : breathPhase === 'exhale' ? 'scale-90' : 'scale-100') : 'scale-100'
            }`}></div>
            <div className={`absolute inset-0 w-32 h-32 m-auto rounded-full ${currentTheme.breathColor} opacity-60 transition-all duration-1000 ${
              isActive ? (breathPhase === 'inhale' ? 'scale-110' : breathPhase === 'exhale' ? 'scale-90' : 'scale-100') : 'scale-100'
            }`}></div>
            
            {/* Timer Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{formatTime(time)}</div>
                {isActive && (
                  <div className="text-white/80 text-lg font-medium animate-pulse">
                    {getBreathInstruction()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Duration Selector */}
          {!isActive && (
            <div className="mb-8">
              <h4 className="text-white font-medium mb-4">Select Duration</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {durations.map(duration => (
                  <button
                    key={duration.value}
                    onClick={() => {
                      setSelectedDuration(duration.value);
                      setTime(duration.value);
                    }}
                    className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                      selectedDuration === duration.value
                        ? 'bg-white/30 text-white border-2 border-white/50'
                        : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={toggleTimer}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                isActive 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </>
              )}
            </Button>
            
            <Button
              onClick={resetTimer}
              className="px-8 py-4 rounded-2xl font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/30 transition-all duration-300"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Meditation Tips */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <h3 className="text-white font-bold text-xl mb-6 text-center">Meditation Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Find Your Position</h4>
                  <p className="text-white/80 text-sm">Sit comfortably with your back straight. You can sit on a chair, cushion, or cross-legged on the floor.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Focus on Breathing</h4>
                  <p className="text-white/80 text-sm">Follow the breathing guide. Inhale slowly, hold briefly, then exhale completely. Let your breath be natural.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Gentle Awareness</h4>
                  <p className="text-white/80 text-sm">When your mind wanders, gently bring your attention back to your breath. This is normal and part of the practice.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Be Patient</h4>
                  <p className="text-white/80 text-sm">Meditation is a practice. Be kind to yourself and remember that every session is beneficial, regardless of how it feels.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}