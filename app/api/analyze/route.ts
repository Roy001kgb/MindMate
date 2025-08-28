// This API route is disabled for static export
// The app will use fallback analysis instead
export async function POST() {
  return new Response(JSON.stringify({
    success: true,
    data: {
      mood: 'neutral',
      confidence: 0.7,
      tips: [
        'Take a few deep breaths and practice mindfulness for 5 minutes.',
        'Consider going for a short walk or doing light exercise to boost your mood.',
        'Remember that every feeling is valid and temporary.',
        'Try journaling your thoughts to gain clarity and perspective.'
      ]
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}