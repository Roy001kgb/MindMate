'use client';

import Link from 'next/link';
import { Brain, Moon, Sun, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-100/50' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Brain className="h-10 w-10 text-blue-600 group-hover:text-blue-700 transition-all duration-300 float-animation" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full sparkle"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent gradient-shift">
                MindMate
              </span>
              <span className="text-xs text-gray-500 font-medium">AI Mental Health Companion</span>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/insights" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-all duration-200 hover:scale-105 relative group"
            >
              Insights
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/meditation" 
              className="text-gray-700 hover:text-green-600 font-medium transition-all duration-200 hover:scale-105 relative group"
            >
              Meditation
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 hover:bg-blue-50 transition-all duration-200"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-blue-50 transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}