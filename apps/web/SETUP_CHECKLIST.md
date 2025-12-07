# Setup Checklist

Use this checklist to verify everything is ready to run.

## ✅ Code Files (All Created)

- [x] Next.js app structure (`app/`, `src/`)
- [x] All components (themes, UI elements)
- [x] API route (`app/api/guidance/route.ts`)
- [x] Audio assets copied to `public/audio/`
- [x] Configuration files (tsconfig, tailwind, next.config)

## 📦 Dependencies (Need to Install)

Run this command:
```bash
cd apps/web
npm install
```

This will install:
- Next.js, React, React DOM
- Supabase client
- OpenAI SDK
- Tailwind CSS
- TypeScript types

## 🔐 Environment Variables (Need to Create)

Create `.env.local` in `apps/web/`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# For API routes (server-side only)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-key
```

**Note**: Without these, the app will work but use demo responses instead of real scripture data.

## 🗄️ Database Setup (Optional but Recommended)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create a new project
   - Enable the `vector` extension in Database → Extensions

2. **Run Schema**
   - Copy contents of `db/schema.sql`
   - Run in Supabase SQL Editor

3. **Ingest Scriptures** (Optional)
   ```bash
   cd server/ingest
   npm install
   npm run ingest:bootstrap  # Downloads public domain texts
   npm run ingest:embed      # Tags, paraphrases, and embeds
   ```

## 🚀 Ready to Run?

Once dependencies are installed:

```bash
cd apps/web
npm run dev
```

Then open: http://localhost:3000

## ⚠️ What Happens Without Backend?

The app will:
- ✅ Work perfectly with demo responses
- ✅ Show all UI and animations
- ✅ Support all languages
- ⚠️ Use sample data instead of your scripture database
- ⚠️ Not use RAG + CAG (will use fallback demo responses)

## 🔍 Quick Status Check

Run these commands to check status:

```powershell
# Check if dependencies installed
cd apps/web
Test-Path node_modules

# Check if env file exists
Test-Path .env.local

# Check if audio files exist
Test-Path public/audio/chime_start.wav
```

## 📝 Next Steps

1. **Install dependencies**: `cd apps/web && npm install`
2. **Set up environment variables** (if you want real backend)
3. **Set up database** (if you want real scripture data)
4. **Run the app**: `npm run dev`

The app is **ready to run** with demo data. Backend connection is optional but recommended for the full experience!

