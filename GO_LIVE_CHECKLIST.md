# Go-Live Checklist

Quick reference for deploying and testing TalkingLight on your Samsung device.

## ✅ Step 1: Supabase → Ingest Corpus

```bash
# A) In Supabase SQL Editor:
# Paste contents of db/schema.sql and run it (enables pgvector + tables)

# B) In your project:
cd server/ingest
npm i
npm run ingest:bootstrap     # downloads + chunks PD texts
npm run ingest:embed         # tags + paraphrases + embeddings into Supabase
```

**Quick check:** In Supabase → Table editor → `passages` should have rows (hundreds+). `embeddings` should be populated.

## ✅ Step 2: Deploy Cloudflare Worker

```bash
cd server/worker
npm i
npx wrangler login
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE

# Verify secrets are set:
npx wrangler secret list

# Deploy:
npm run deploy
```

**Copy your URL** (e.g. `https://talking-light.<name>.workers.dev`).

**Health test:**
```bash
curl -i https://talking-light.<name>.workers.dev/health
# should return 200 OK with {"status":"ok"}
```

## ✅ Step 3: Point Mobile App at Worker

```bash
cd apps/mobile
npm i

# Edit app.config.ts and set:
#   EXPO_PUBLIC_WORKER_URL = "https://talking-light.<name>.workers.dev"

npx expo start
```

Press **a** to run on Android emulator **or** follow USB steps below.

## ✅ Step 4: USB-Install on Samsung (Debug Build)

On your phone: **Settings → Developer options → USB debugging ON**.

Then:
```bash
adb devices            # accept the RSA prompt on phone if 'unauthorized'
cd apps/mobile
npx expo run:android   # builds and installs the debug app on your device
```

## ✅ Step 5: Smoke Test (End-to-End)

1. Open the app → starfield + breathing Light shows.
2. **Press & hold** the mic → speak: "I feel anxious; help me calm down."
3. Release → you should see text **stream** in, then hear **TTS**.
4. Background the app, reopen → conversation **is gone** (ephemeral ✅).

---

## 🚨 Quick Troubleshooting

### Nothing happens after speaking

**Check Worker secrets:**
```bash
cd server/worker
npx wrangler secret list
```

**Check CORS:** Add dev origins in `wrangler.toml`:
```toml
ALLOWED_ORIGINS = "http://localhost:8081,http://localhost:19000,http://192.168.0.0/16,exp://192.168.0.0/16,https://your-worker.workers.dev"
```

**Health check:**
```bash
curl https://your-worker.workers.dev/health
```

### "Upstream error" from Worker

- **Billing:** Ensure your OpenAI key is active and has credits
- **Supabase vars:** `SUPABASE_URL` + **Service Role** key present
- **Ingest ran?** `passages` table not empty

### Audio upload / Whisper fails

The app uses `expo-av` which outputs AAC/MP4 or WebM. The Worker now accepts:
- `audio/webm`
- `audio/mpeg` / `audio/mp3`
- `audio/mp4` / `audio/m4a`
- `audio/wav`

If issues persist, check the Content-Type header in the request.

### Text shows but TTS silent

- **Android TTS engine** may need a voice download
- Open system **Text-to-Speech settings** and install a voice (English to start)
- Check device volume is up

### USB device not listed

- Replug USB, try another cable/port
- `adb kill-server && adb start-server`
- Accept RSA prompt on device
- See `scripts/android-usb.md` for detailed troubleshooting

---

## 🔍 Verify RAG is Scripture-Grounded

**Console test (optional):**

1. Temporarily add debug logging in Worker `handleVoice` function:
   ```typescript
   console.log('Selected passages:', passages.map(p => p.scripture));
   ```

2. Ask varied prompts:
   - "I'm afraid of failing"
   - "I feel alone"
   - "My mind is racing"

3. In Worker logs (`npx wrangler tail`), you should see passages pulled from:
   - **Tao Te Ching**
   - **Dhammapada**
   - **Bhagavad Gita**
   - **Meditations**
   - **Bible KJV** (Psalms/Proverbs)

4. The on-device reply should be:
   - Short (≤6 lines)
   - Embodied (includes micro-practice)
   - Grounded (from scripture paraphrases, not generic)

---

## 🛡️ Production Hygiene (Implemented)

✅ **Rate limiting** - 10 requests/minute per IP (in-memory)  
✅ **Timeouts** - 25s transcription, 20s generation  
✅ **Minimal logging** - No content, only error types  
✅ **No PII storage** - Mobile stores nothing by design  
✅ **CORS configured** - Dev origins + production URL  

---

## ✨ Polish Features (Implemented)

✅ **Haptic feedback** - Light tick on press, medium on release  
✅ **Glow intensifies** - Mic button shadow/glow increases while recording  
✅ **Crisis footer** - Prominent gold-colored footer in Pricing sheet  

---

## 🎯 Next Steps

1. Test all voice interactions
2. Verify responses are scripture-grounded
3. Test crisis detection ("I want to kill myself")
4. Monitor Worker logs for any errors
5. Check Supabase usage (stay within free tier limits)

---

## 📝 Notes

- **Rate limiting** is per-worker instance (in-memory). For production scale, consider Cloudflare KV or Durable Objects.
- **Timeouts** prevent hanging requests but may need tuning based on your corpus size.
- **CORS** patterns support localhost, 192.168.*.* (local network), and production URLs.

---

If any step throws an error, paste the exact message and we'll troubleshoot! 🚀

