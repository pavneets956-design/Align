# TalkingLight Deployment Guide

## 1. Supabase setup

1. Create a new Supabase project.
2. In Project Settings -> Database -> Connection string, copy the project URL.
3. Generate a service role key (Project Settings -> API).
4. From repo root, copy `.env.example` to `.env` and populate:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE`
   - `OPENAI_API_KEY`
   - `ALLOWED_ORIGINS`
5. Apply schema:
   ```bash
   cd server/ingest
   npm install
   npm run ingest:init
   ```

## 2. Bootstrap the corpus

Before running these commands, drop any approved Guru Granth Sahib Ji paraphrase CSV/JSON files into `server/ingest/data/gurbani/`.

```bash
cd server/ingest
npm run ingest:bootstrap          # download & chunk public-domain texts + load local Gurbani files
npm run ingest:embed -- --only=tao # optional: limit sources while testing
npm run ingest:embed               # full tag + embed pass
```

### Optional licensed imports

```bash
npm run ingest:import -- --file=admin_import_example.json
```

## 3. Deploy the Cloudflare Worker

```bash
cd server/worker
npm install
npx wrangler login
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE
# update wrangler.toml ALLOWED_ORIGINS before deploying
npm run deploy
```

Copy the resulting Worker URL (e.g., `https://talking-light-worker.your-domain.workers.dev`).

## 4. Configure the mobile app

1. Set `EXPO_PUBLIC_WORKER_URL` in the root `.env` (or directly in `apps/mobile/app.config.ts`).
2. Install dependencies and launch Expo:
   ```bash
   cd apps/mobile
   npm install
   npx expo start
   ```
3. When the dev server starts, press `a` to open the Android simulator or attach a Samsung device (see below).

## 5. Ship to a Samsung via USB debugging

```bash
adb devices                        # authorize phone
cd apps/mobile
npx expo run:android               # builds & installs debug build
```

For USB troubleshooting, see `apps/scripts/android-usb.md`.

## 6. Production checklist

- Set `ALLOWED_ORIGINS` to the Expo dev URI and production app bundle URLs.
- Configure Cloudflare IP firewall rules if stricter rate limits required.
- Monitor Worker logs via `npx wrangler tail`.
- Periodically refresh embeddings when new Gurbani or licensed paraphrases are added.
