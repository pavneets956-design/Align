# 📱 Mobile App Deployment Guide

## 🎯 Goal

Deploy your backend to production so the mobile app works **anywhere, anytime** without needing `npm run dev` running on your laptop.

---

## 📋 Step 1: Deploy Backend to Vercel

### Prerequisites
- GitHub repository with your code
- Vercel account (free tier works)

### Steps

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click **"New Project"** → **"Import Git Repository"**
   - Select your repository

3. **Configure Project**:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web` (or wherever your Next.js backend is)
   - **Build Command:** `npm run build` (or `cd apps/web && npm run build`)
   - **Output Directory:** `.next` (default for Next.js)

4. **Set Environment Variables**:
   Click **"Environment Variables"** and add:
   ```
   OPENAI_API_KEY=your_openai_key_here
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   STRIPE_SECRET_KEY=your_stripe_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
   ```
   (Add all the env vars your backend needs)

5. **Deploy**:
   - Click **"Deploy"**
   - Wait 2-3 minutes
   - You'll get a URL like: `https://talking-light.vercel.app`

6. **Test the Deployment**:
   - Open: `https://your-app.vercel.app/api/align/chat` in browser
   - Should return an error (needs POST), but confirms the route exists
   - Or test: `https://your-app.vercel.app/api/health` if you have one

---

## 📋 Step 2: Update Mobile App Config

### Option A: Using Environment Variables (Recommended)

1. **Create `.env` file** in `apps/mobile/`:
   ```bash
   cd apps/mobile
   cp .env.example .env
   ```

2. **Edit `.env`**:
   ```env
   PROD_BACKEND_URL=https://your-app.vercel.app
   ```

3. **Install react-native-dotenv** (if not already):
   ```bash
   npm install react-native-dotenv
   ```

4. **Update `babel.config.js`** to load env vars:
   ```js
   module.exports = {
     plugins: [
       ['module:react-native-dotenv', {
         moduleName: '@env',
         path: '.env',
       }],
     ],
   };
   ```

5. **Update `apps/mobile/src/config/api.ts`**:
   ```typescript
   import { PROD_BACKEND_URL } from '@env';
   
   const PROD_URL = PROD_BACKEND_URL || 'https://your-app.vercel.app';
   export const ALIGN_API_BASE_URL = __DEV__ ? DEV_BACKEND_URL : `${PROD_URL}/api/align`;
   ```

### Option B: Hardcode for Now (Quick Test)

Just edit `apps/mobile/src/config/api.ts` directly:

```typescript
const PROD_BACKEND_URL = 'https://your-actual-vercel-url.vercel.app';
export const ALIGN_API_BASE_URL = __DEV__ ? DEV_BACKEND_URL : `${PROD_BACKEND_URL}/api/align`;
```

---

## 📋 Step 3: Build Release APK

### Using React Native CLI

1. **Generate a release build**:
   ```bash
   cd apps/mobile
   npx react-native run-android --mode=release
   ```

   Or build APK directly:
   ```bash
   cd apps/mobile/android
   ./gradlew assembleRelease
   ```

2. **Find the APK**:
   - Location: `apps/mobile/android/app/build/outputs/apk/release/app-release.apk`

3. **Install on your Samsung**:
   - Transfer APK to phone (USB, Drive, email, etc.)
   - Enable "Install from Unknown Sources" in Android settings
   - Tap the APK file to install

### Using Android Studio (Recommended for Signed Builds)

1. **Open Android Studio**:
   ```bash
   cd apps/mobile/android
   # Open Android Studio and open this folder
   ```

2. **Build → Generate Signed Bundle / APK**:
   - Choose **APK**
   - Select **release** build variant
   - Sign with your keystore (or create one)
   - Build

3. **Install the APK** on your device

---

## 📋 Step 4: Test Production Build

1. **Turn off USB debugging** (optional, to simulate real user)
2. **Close Android Studio** (optional)
3. **Stop `npm run dev`** (if running)
4. **Open the app** on your Samsung
5. **Send a test message**

**Expected Result:**
- ✅ No "Backend API failed" error
- ✅ Messages go through to real AI backend
- ✅ Works without any local dev server

---

## 🔧 Troubleshooting

### "Network request failed" in production build

**Check:**
1. Is `PROD_BACKEND_URL` set correctly in `.env`?
2. Is the backend actually deployed and accessible?
   - Test: `https://your-app.vercel.app/api/health` in browser
3. Does the URL include `/api/align`? (The config adds it automatically)
4. Check Android logs: `adb logcat | grep -i "network\|api\|error"`

### Still using localhost in production

**Fix:**
- Make sure you're building a **release** build, not debug
- Check `__DEV__` is `false` in release builds
- Verify `.env` file is being loaded (check with `console.log(PROD_BACKEND_URL)`)

### Backend works in browser but not in app

**Check:**
- CORS headers on backend (should allow mobile app origin)
- HTTPS vs HTTP (production must use HTTPS)
- API route paths match exactly

---

## ✅ Success Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend URL accessible in browser
- [ ] Environment variables set in Vercel
- [ ] Mobile app `.env` file updated with production URL
- [ ] Release APK built and installed
- [ ] App works without `npm run dev` running
- [ ] Messages successfully reach backend

---

## 🚀 Next Steps

Once production is working:
- Set up **automatic deployments** (Vercel auto-deploys on git push)
- Add **error tracking** (Sentry, etc.)
- Set up **analytics** (Mixpanel, Amplitude, etc.)
- Configure **app signing** for Play Store release

---

**You're done!** Your app now works independently of your laptop. 🎉

