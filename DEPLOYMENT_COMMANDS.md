# Deployment Commands - TalkingLight (Multilingual)

Exact command sequence to deploy and run TalkingLight on your Samsung device.

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier)
- Cloudflare account (free tier)
- OpenAI API key
- Android device with USB debugging enabled

---

## Step 1: Supabase Setup

```bash
# 1. Create project at https://supabase.com
# 2. Go to SQL Editor
# 3. Copy and paste contents of db/schema.sql
# 4. Run the SQL
# 5. Note your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from Settings → API
```

---

## Step 2: Environment Setup

Create `.env` file in project root:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-api-key
```

---

## Step 3: Run Ingestion

```bash
cd server/ingest
npm install
npm run ingest:bootstrap     # Downloads + chunks PD texts (~2-5 min)
npm run ingest:embed         # Tags + paraphrases + embeddings (~30-60 min)
```

**Verify**: In Supabase → Table editor → `passages` should have hundreds of rows.

---

## Step 4: Deploy Cloudflare Worker

```bash
cd server/worker
npm install
npx wrangler login
npx wrangler secret put OPENAI_API_KEY          # Paste API key when prompted
npx wrangler secret put SUPABASE_URL            # Paste Supabase URL
npx wrangler secret put SUPABASE_SERVICE_ROLE   # Paste service role key

# Edit wrangler.toml and set ALLOWED_ORIGINS (or set via env):
# ALLOWED_ORIGINS = "http://localhost:8081,http://localhost:19000,http://192.168.0.0/16,exp://192.168.0.0/16,https://your-worker.workers.dev"

npm run deploy
```

**Copy the Worker URL** (e.g., `https://talking-light.your-username.workers.dev`)

**Health check:**
```bash
curl https://your-worker.workers.dev/health
# Should return: {"status":"ok"}
```

---

## Step 5: Configure Mobile App

```bash
cd apps/mobile
npm install

# Edit app.config.ts and set:
#   EXPO_PUBLIC_WORKER_URL = "https://your-worker.workers.dev"
```

Or set via environment variable:
```bash
export EXPO_PUBLIC_WORKER_URL=https://your-worker.workers.dev
```

---

## Step 6: USB Install on Samsung

**On your phone:**
1. Settings → About Phone → tap "Build Number" 7 times (enables Developer Options)
2. Settings → Developer Options → USB Debugging (toggle ON)
3. Connect via USB cable

**On your computer:**
```bash
adb devices                    # Accept RSA prompt on phone if 'unauthorized'
cd apps/mobile
npx expo run:android          # Builds and installs debug app on device
```

**Alternative (EAS build):**
```bash
eas build -p android --profile preview
adb install -r path/to/app-debug.apk
```

---

## Step 7: Test (Voice-Only, Multilingual)

1. **Open app** → starfield + breathing Light shows
2. **Speak in Punjabi/Hindi/English**: "ਮੈਂ ਚਿੰਤਤ ਹਾਂ" / "मैं चिंतित हूँ" / "I feel anxious"
3. **Press & hold mic** → speak → release
4. **Listen** → response speaks in detected language (no text on screen)
5. **Test language override**: Tap globe icon (🌐) → select Punjabi/English/Hindi → speak again

---

## Complete Command Sequence (Copy-Paste)

```bash
# 1. Supabase: Create project → Run db/schema.sql in SQL Editor
# Note: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

# 2. Environment
echo "SUPABASE_URL=https://your-project.supabase.co" > .env
echo "SUPABASE_SERVICE_ROLE_KEY=your-key" >> .env
echo "OPENAI_API_KEY=sk-your-key" >> .env

# 3. Ingest
cd server/ingest && npm install && npm run ingest:bootstrap && npm run ingest:embed

# 4. Deploy Worker
cd ../../server/worker && npm install && npx wrangler login && \
npx wrangler secret put OPENAI_API_KEY && \
npx wrangler secret put SUPABASE_URL && \
npx wrangler secret put SUPABASE_SERVICE_ROLE && \
npm run deploy
# Copy Worker URL

# 5. Configure Mobile
cd ../../apps/mobile && npm install
# Edit app.config.ts: set EXPO_PUBLIC_WORKER_URL

# 6. USB Install
adb devices  # Accept RSA prompt on phone
npx expo run:android
```

---

## Troubleshooting

**Nothing happens after speaking:**
- Check Worker secrets: `npx wrangler secret list`
- Verify CORS in `wrangler.toml`
- Health check: `curl https://your-worker/health`

**TTS not speaking:**
- Install language packs: Settings → Text-to-Speech → Install voices
- App falls back to English if voice unavailable

**Language not detected:**
- Whisper auto-detects from audio
- Use globe icon (🌐) to manually select language

**USB device not listed:**
- Replug USB, try another cable/port
- `adb kill-server && adb start-server`
- Accept RSA prompt on device

---

## Worker URL Placeholder

After deployment:
```
https://talking-light.your-username.workers.dev
```

Replace `your-username` with your actual Cloudflare username.

---

## ADB Install Command

```bash
adb install -r path/to/app-debug.apk
```

---

## Success Indicators

✅ **Ingestion**: `passages` table has 500+ rows  
✅ **Worker**: `curl https://worker/health` returns `{"status":"ok"}`  
✅ **Mobile**: App shows starfield + breathing light  
✅ **Voice**: Speak → hear response in detected language  
✅ **Language Override**: Globe icon → select language → works  

---

**You're ready to test TalkingLight in Punjabi, Hindi, and English! 🌌✨**

