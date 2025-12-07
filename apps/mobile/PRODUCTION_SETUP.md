# 🚀 Production Setup - Quick Guide

## The Problem
Right now your app points to `localhost:3000`, which only works when `npm run dev` is running on your laptop.

## The Solution
Deploy backend to Vercel → Update one line in code → Rebuild app → Done!

---

## Step 1: Deploy Backend (5 minutes)

1. **Go to [vercel.com](https://vercel.com)** → Sign in with GitHub
2. **New Project** → Import your repo
3. **Settings:**
   - Root Directory: `apps/web`
   - Framework: Next.js
4. **Environment Variables:**
   - Add: `OPENAI_API_KEY`, `SUPABASE_URL`, etc.
5. **Deploy** → Get URL like: `https://talking-light.vercel.app`

---

## Step 2: Update Mobile App (30 seconds)

**Edit:** `apps/mobile/src/config/api.ts`

**Find this line:**
```typescript
const PROD_BACKEND_URL = 'https://your-app.vercel.app';
```

**Replace with your actual Vercel URL:**
```typescript
const PROD_BACKEND_URL = 'https://talking-light.vercel.app'; // Your actual URL
```

**Save the file.**

---

## Step 3: Build Release APK

```bash
cd apps/mobile/android
./gradlew assembleRelease
```

**APK location:** `app/build/outputs/apk/release/app-release.apk`

**Install on your Samsung** → Done! ✅

---

## How It Works

- **Development builds** (`npx react-native run-android`): Uses `localhost:3000` (needs `npm run dev`)
- **Release builds** (APK): Uses your Vercel URL (no local server needed)

The code automatically switches based on `__DEV__` flag.

---

## Test It

1. Install the release APK
2. **Turn off** USB debugging
3. **Stop** `npm run dev`
4. Open app → Send message → Should work! 🎉

---

**That's it!** Your app now works independently. See `DEPLOYMENT.md` for detailed instructions.

