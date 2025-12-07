# Cloudflare Worker – TalkingLight Voice API

## Setup

1. Install dependencies
   `ash
   cd server/worker
   npm install
   `
2. Authenticate with Cloudflare
   `ash
   npx wrangler login
   `
3. Configure secrets
   `ash
   npx wrangler secret put OPENAI_API_KEY
   npx wrangler secret put SUPABASE_URL
   npx wrangler secret put SUPABASE_SERVICE_ROLE
   npx wrangler secret put ALLOWED_ORIGINS  # e.g. http://localhost:8081,exp://127.0.0.1:19000
   `
4. Publish the worker
   `ash
   npm run deploy
   `
5. Copy the deployed Worker URL and set it as EXPO_PUBLIC_WORKER_URL (or via .env) for the mobile app.

## Endpoints

- GET /health → returns 200 OK
- POST /voice → accepts udio/webm or udio/mp4 (press-and-hold mic input) with optional 	argetLang ("pa" | "hi" | "en").
  - Full pipeline: Whisper transcription, crisis short-circuit, English translation for retrieval if needed, state/theme detection, pgvector retrieval with Gurbani priority, constrained generation, SSE streaming with keep-alive pings every 10s.

Allowlisted CORS origins are controlled via the ALLOWED_ORIGINS secret (comma separated) and always include local http://localhost, http://127.0.0.1, and exp:// schemes for development.
