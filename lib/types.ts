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
// Extend the Window interface to include our custom property
declare global {
  interface Window {
    handleMoodAnalysis?: (analysis: MoodAnalysis) => void;
  }
}

// This export is needed to make this file a module
export {};