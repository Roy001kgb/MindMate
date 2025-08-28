'use client';

import Header from '@/components/Header';
import { Brain, Shield, Heart, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              MindMate
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal AI companion for mental health awareness and emotional well-being.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Mission */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-8 h-8 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              MindMate makes mental health awareness accessible to everyone. We believe that understanding your emotional state is the first step toward better mental well-being. Our AI-powered platform provides instant mood analysis and personalized coping strategies to help you navigate life's ups and downs.
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">How It Works</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Simply share your thoughts or describe how you're feeling. Our advanced AI, powered by Google Gemini, analyzes your input to identify your mood and confidence level. You'll receive personalized coping tips and can track your emotional journey over time with our mood history feature.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Instant Analysis</h3>
              <p className="text-gray-600 text-sm">Get immediate insights into your emotional state with AI-powered mood analysis.</p>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 text-pink-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Personalized Tips</h3>
              <p className="text-gray-600 text-sm">Receive tailored coping strategies and mental health tips based on your current mood.</p>
            </div>
            <div className="text-center">
              <Brain className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Mood Tracking</h3>
              <p className="text-gray-600 text-sm">Monitor your emotional patterns over time with our comprehensive mood history.</p>
            </div>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">Privacy & Data Protection</h2>
          </div>
          
          <div className="space-y-6 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Data Storage</h3>
              <p>Your mood history is stored locally in your browser using localStorage. We do not store your personal data on our servers, ensuring complete privacy and control over your information.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">AI Processing</h3>
              <p>When you submit text for mood analysis, it is sent to our AI service (Google Gemini via OpenRouter) for processing. The text is used solely for mood analysis and is not stored or used for any other purpose.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">No Account Required</h3>
              <p>MindMate works completely anonymously. No registration, email, or personal information is required to use our service.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Third-Party Services</h3>
              <p>We use OpenRouter and Google Gemini for AI analysis. Their respective privacy policies apply to the processing of your submitted text.</p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Important Notice</h2>
          <div className="text-gray-700 space-y-3 text-center">
            <p className="font-medium">
              MindMate is a supportive tool designed to help with mood awareness and emotional well-being.
            </p>
            <p>
              <strong>This app is not a substitute for professional mental health care.</strong> If you are experiencing severe depression, anxiety, suicidal thoughts, or other serious mental health issues, please seek help from a qualified mental health professional immediately.
            </p>
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-semibold text-red-800">Crisis Resources:</p>
              <p className="text-red-700">
                If you're in crisis, contact the 988 Suicide & Crisis Lifeline (US) at 988 or visit your local emergency room.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}