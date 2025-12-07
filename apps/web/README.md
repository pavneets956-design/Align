# Talking Light Web

A web-based spiritual companion application built with Next.js, React, and TypeScript.

## Features

- **Beautiful Animated Themes**: Four immersive background themes (Under Stars, Mountain Summit, Above Clouds, Ocean Night)
- **Multi-language Support**: English, Hindi, and Punjabi with automatic language detection
- **Text-to-Speech**: Web Speech API integration for spoken guidance
- **Audio Feedback**: Chime sounds for interactions
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase project with the database schema set up (see `db/schema.sql`)
- OpenAI API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_URL` - Your Supabase project URL (for server-side)
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `OPENAI_API_KEY` - Your OpenAI API key

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

Make sure your Supabase database has:
1. The schema from `db/schema.sql` applied
2. Scriptures ingested using the ingestion pipeline (see `server/ingest/README.md`)
3. Embeddings generated for all passages

The app will fall back to demo responses if the database is not configured.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
apps/web/
├── app/              # Next.js app directory
│   ├── layout.tsx   # Root layout
│   ├── page.tsx     # Main page component
│   └── globals.css  # Global styles
├── src/
│   ├── components/  # React components
│   │   ├── Starfield.tsx
│   │   ├── SummitGlow.tsx
│   │   ├── AuroraSky.tsx
│   │   ├── OceanShimmer.tsx
│   │   ├── LevitatingLight.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── LangGlobe.tsx
│   └── lib/         # Utility libraries
│       ├── api.ts           # API client
│       ├── audio.ts         # Web Audio API wrapper
│       ├── theme.ts         # Theme configuration
│       └── tts.ts           # Text-to-speech utilities
└── public/
    └── audio/       # Audio assets
```

## Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library (for future enhancements)
- **Web Speech API**: Browser-native text-to-speech
- **Web Audio API**: Sound playback

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (iOS 14.5+)
- Mobile browsers with Web Speech API support

## Notes

- Text-to-speech requires browser support for the Web Speech API
- Audio playback requires user interaction on some browsers
- The app works best with modern browsers that support ES2020 features

