export interface MoodEntry {
  id: string;
  timestamp: Date;
  userInput: string;
  mood: string;
  confidence: number;
  tips: string[];
}

export interface MoodAnalysis {
  mood: string;
  confidence: number;
  tips: string[];
}

export interface ApiResponse {
  success: boolean;
  data?: MoodAnalysis;
  error?: string;
}