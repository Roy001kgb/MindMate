# MindMate 🧠💚

An AI-powered mental health companion for quick mood tracking, analysis, and personalized coping tips.

![MindMate Preview](https://images.pexels.com/photos/3760790/pexels-photo-3760790.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## Features

- **Instant Mood Analysis**: AI-powered mood detection using Google Gemini
- **Personalized Coping Tips**: Get tailored mental health suggestions
- **Mood History Tracking**: Visualize your emotional journey over time
- **Privacy-First**: All data stored locally in your browser
- **Anonymous Usage**: No registration or personal information required
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 13+ with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **AI Integration**: OpenRouter API (Google Gemini)
- **State Management**: React Hooks
- **Data Persistence**: localStorage

## Getting Started

### Prerequisites

1. Node.js 18+ installed on your machine
2. An OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai/keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindmate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` and add your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Get an OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for a free account
3. Navigate to the [API Keys section](https://openrouter.ai/keys)
4. Generate a new API key
5. Copy the key and add it to your `.env.local` file

## Usage

1. **Share your thoughts**: Type how you're feeling in the text area
2. **Get analysis**: Click "Analyze Mood" to receive AI insights
3. **View results**: See your mood label, confidence level, and personalized tips
4. **Track progress**: Monitor your mood trends in the history chart

## Project Structure

```
mindmate/
├── app/
│   ├── api/analyze/route.ts    # OpenRouter API integration
│   ├── about/page.tsx          # About page
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   ├── Header.tsx              # Navigation header
│   ├── MoodInput.tsx           # Mood input form
│   ├── MoodResult.tsx          # Analysis results display
│   └── MoodHistory.tsx         # Mood tracking chart
├── lib/
│   ├── types.ts                # TypeScript definitions
│   └── utils.ts                # Utility functions
└── README.md
```

## Key Components

- **MoodInput**: Handles user text input and analysis requests
- **MoodResult**: Displays mood analysis with confidence levels and tips
- **MoodHistory**: Shows mood trends using Recharts visualization
- **API Route**: Processes requests to OpenRouter's Gemini API

## Privacy & Security

- **Local Storage**: All mood history is stored in your browser
- **No Registration**: Use the app completely anonymously
- **Secure API**: Text analysis processed through encrypted connections
- **No Data Mining**: We don't store or analyze your personal data

## Important Disclaimer

**MindMate is a supportive tool and not a replacement for professional mental health care.**

If you're experiencing severe mental health issues, please reach out to:
- **Crisis Text Line**: Text HOME to 741741
- **National Suicide Prevention Lifeline**: 988
- **Your local mental health professional**

## Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

## License

This project is open source and available under the MIT License.

## Deployment

### Netlify Deployment

This app is optimized for Netlify deployment:

1. **Connect to Netlify**:
   - Push your code to GitHub/GitLab
   - Connect your repository to Netlify

2. **Build Settings** (auto-configured via `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: 18

3. **Manual Deployment**:
   ```bash
   npm run build
   ```
   Then drag and drop the `out` folder to Netlify

### Other Static Hosts

The app can be deployed to any static hosting service:

```bash
npm run build

## Support

If you encounter any issues or have questions, please open an issue in the repository.

---

Built with ❤️ for mental health awareness and emotional well-being.