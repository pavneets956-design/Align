# 🚀 Correct Commands to Start ALIGN Mobile

## ⚠️ Important: Run from the Mobile Directory

All commands must be run from `apps/mobile` directory, NOT the root!

## Terminal 1: Metro Bundler

```bash
cd apps/mobile
npx react-native start --reset-cache
```

Keep this running.

## Terminal 2: Build & Run Android

```bash
cd apps/mobile
npx react-native run-android
```

## Terminal 3: Backend (if not already running)

```bash
cd apps/web
npm run dev
```

## Terminal 4: ADB Port Forwarding (one-time)

```bash
adb reverse tcp:3000 tcp:3000
adb reverse tcp:8081 tcp:8081
```

## Common Mistakes

❌ **Wrong:** Running from root directory
```bash
# From: C:\Users\gillp\CascadeProjects\talking-light
npx react-native start  # ❌ This won't work!
```

✅ **Correct:** Running from mobile directory
```bash
# From: C:\Users\gillp\CascadeProjects\talking-light\apps\mobile
npx react-native start  # ✅ This works!
```

## Quick Start Script

If you want a helper, create a `start.ps1` in the root:

```powershell
# start.ps1
cd apps\mobile
npx react-native start --reset-cache
```

Then run: `.\start.ps1`

---

**Always `cd apps/mobile` first!** 🎯

