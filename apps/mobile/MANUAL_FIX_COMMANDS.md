# 🔧 Manual Fix Commands - Copy & Paste

## ✅ Quick Fix: Switch to Fallback (App Works Now)

Already done in code - just rebuild:

```powershell
cd C:\Users\gillp\CascadeProjects\talking-light\apps\mobile
npx react-native run-android
```

This will use View-based particles instead of SVG (no native module needed).

---

## 🔨 Proper Fix: Link react-native-svg Native Module

### Step 1: Verify Package is Installed

```powershell
cd C:\Users\gillp\CascadeProjects\talking-light\apps\mobile
npm list react-native-svg
```

Should show: `react-native-svg@15.15.1` (or similar)

### Step 2: Clean Android Build

```powershell
cd C:\Users\gillp\CascadeProjects\talking-light\apps\mobile\android
.\gradlew clean
```

### Step 3: Rebuild App (This Forces Native Linking)

```powershell
cd C:\Users\gillp\CascadeProjects\talking-light\apps\mobile
npx react-native run-android
```

This rebuilds the native Android code and should auto-link `react-native-svg`.

---

## 🎯 If SVG Still Doesn't Work After Rebuild

### Option A: Check Autolinking

Verify autolinking is working:

```powershell
cd C:\Users\gillp\CascadeProjects\talking-light\apps\mobile
npx react-native config
```

Look for `react-native-svg` in the output.

### Option B: Switch Back to SVG Version

If native module links successfully, switch back to SVG particles:

Edit: `apps/mobile/src/components/3d/Environment3D.tsx`

Change:
```ts
// import ParticleSystem from './ParticleSystem'; // SVG version
import ParticleSystem from './ParticleSystemFallback'; // View-based fallback
```

To:
```ts
import ParticleSystem from './ParticleSystem'; // SVG version
// import ParticleSystem from './ParticleSystemFallback'; // View-based fallback
```

Then rebuild:
```powershell
npx react-native run-android
```

---

## 🚀 Current Status

**Right now, the app should work with the View-based fallback particles.**

Just run:
```powershell
cd C:\Users\gillp\CascadeProjects\talking-light\apps\mobile
npx react-native run-android
```

**No errors, app opens, 3D UI works (just particles are View-based instead of SVG).**

---

## 📱 After App Works

1. ✅ App opens without errors
2. ✅ 3D UI loads (environment, AI entity, messages, chips)
3. ✅ Particles show (View-based, animated)
4. ⏳ Test backend connection
5. ⏳ Add opening sound
6. ⏳ Polish animations

---

**Run the rebuild command above and the app should work!** 🎉

