# TalkingLight Monorepo

This repository hosts the Android-first Expo application **TalkingLight**—a single-screen, voice-only experience with ambient sacred themes.

## Structure

- `apps/mobile` – Expo (TypeScript) project for the TalkingLight app.

## Getting Started

```bash
cd apps/mobile
npm install
```

## Run on Android device via USB

1. Connect your Android device with USB debugging enabled.
2. Ensure it appears with `adb devices`.
3. From `apps/mobile`, run:

   ```bash
   npx expo run:android
   ```

This builds the native project and installs the debug build onto the connected device. If Gradle issues arise, open the generated Android project in Android Studio, build the APK, then install it with `adb install -r`.
# TalkingLight

TalkingLight is a voice-only spiritual guidance companion that breathes sacred calm through a single immersive screen. Press, speak, and receive a multilingual response grounded in public-domain wisdom.

## Highlights

- **One-screen** Expo app with animated starfield, levitating light orb, and press-hold mic control.
- **Voice-only UX** - no transcripts stored or displayed; sacred TTS in Punjabi, Hindi, or English.
- **Cloudflare Worker** backend performing Whisper transcription, safety checks, RAG retrieval, and streaming generation.
- **Supabase + pgvector** data layer seeded with priority passages from Guru Granth Sahib Ji plus curated public-domain wisdom.
- **Ingestion pipeline** to bootstrap, tag, embed, and extend the corpus with licensed paraphrases and Gurbani CSV/JSON drops.

## Monorepo layout

```
apps/mobile        # Expo React Native client
apps/scripts       # Android USB install guide
server/worker      # Cloudflare Worker (voice endpoint)
server/ingest      # Corpus ingestion + enrichment scripts
db/schema.sql      # Supabase schema (passages + embeddings)
```

## Getting started

1. Copy `.env.example` -> `.env` and fill in credentials.
2. Provision Supabase and run the schema (`npm run ingest:init` from `server/ingest`).
3. Place any approved Gurbani paraphrase files (CSV/JSON/JSONL) into `server/ingest/data/gurbani/`.
4. Bootstrap scriptures and embeddings (`npm run ingest:bootstrap` then `npm run ingest:embed`).
4. Deploy the Worker (`cd server/worker && npm run deploy`).
5. Configure the Worker URL in the mobile app (`EXPO_PUBLIC_WORKER_URL`).
6. Launch Expo: `cd apps/mobile && npm install && npx expo start`.

See `DEPLOYMENT.md` for the full production playbook.

## Safety & privacy

- No accounts, analytics, or message storage.
- Crisis cues short-circuit RAG and return localized helpline guidance.
- Responses always include a single micro-practice and avoid religious labeling or therapeutic claims.

## Extending the corpus

- Drop new Gurbani paraphrases inside `server/ingest/data/gurbani/` before running ingest steps.
- Import additional licensed paraphrases with `npm run ingest:import -- --file=your_file.json`.

## License

Public-domain texts remain public-domain. Custom paraphrases and code (c) TalkingLight, reserved for spiritual wellbeing applications.
