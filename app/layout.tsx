import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MindMate - AI-Powered Mental Health Companion',
  description: 'Track your mood, get personalized insights, and improve your mental well-being with AI-powered analysis and coping strategies.',
  keywords: ['mental health', 'mood tracking', 'AI companion', 'emotional well-being', 'coping strategies'],
  authors: [{ name: 'MindMate Team' }],
  creator: 'MindMate',
  openGraph: {
    title: 'MindMate - AI-Powered Mental Health Companion',
    description: 'Your personal AI companion for mood tracking and mental health insights',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}