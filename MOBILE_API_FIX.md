# 🔧 Mobile API Connection Fix

## ✅ What I Just Fixed

Updated `apps/mobile/src/config/api.ts` to use a simple, direct URL that works with `adb reverse`.

## 🚀 Quick Fix Steps

### Step 1: Ensure Backend is Running

```bash
cd apps/web
npm run dev
```

Must see: `Ready! http://localhost:3000`

### Step 2: Forward Ports with ADB

```bash
adb reverse tcp:3000 tcp:3000
adb reverse tcp:8081 tcp:8081
```

This makes `localhost:3000` on your phone point to `localhost:3000` on your PC.

### Step 3: Restart Metro & App

```bash
cd apps/mobile

# Stop Metro (Ctrl+C if running), then:
npx react-native start --reset-cache

# In another terminal:
npx react-native run-android
```

## 📝 Current API Configuration

The mobile app is now configured to use:

```ts
export const ALIGN_API_BASE_URL = 'http://localhost:3000/api/align';
```

This works with `adb reverse`. 

## 🔄 Alternative Configurations

If `adb reverse` doesn't work, edit `apps/mobile/src/config/api.ts`:

### For Android Emulator:
```ts
export const ALIGN_API_BASE_URL = 'http://10.0.2.2:3000/api/align';
```

### For Real Device on WiFi:
1. Get your PC IP: `ipconfig` (Windows)
2. Edit `apps/mobile/src/config/api.ts`:
```ts
export const ALIGN_API_BASE_URL = 'http://192.168.x.x:3000/api/align';
```
Replace `x.x` with your actual IP.

## ✅ Test Connection

After restarting the app, send: `hi`

**Expected:**
- ✅ Should connect to backend (no fallback)
- ✅ Real AI response from GPT-4o
- ✅ Chips appear

**If it still fails:**
1. Check Metro logs for exact error
2. Verify backend is running on port 3000
3. Verify `adb reverse tcp:3000 tcp:3000` was successful
4. Try the WiFi IP option instead

## 🐛 Debug Steps

### Check if backend is reachable:
```bash
# On PC, test if API responds:
curl http://localhost:3000/api/align/chat

# Should see: Method Not Allowed (means endpoint exists)
```

### Check ADB reverse:
```bash
adb reverse --list
# Should show:
# tcp:3000 tcp:3000
# tcp:8081 tcp:8081
```

### Check device connection:
```bash
adb devices
# Should show your device
```

## ✅ Success!

Once this works, mobile will use the real backend API instead of local fallback!

