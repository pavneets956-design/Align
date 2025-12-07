# Mobile App Test Checklist

## ✅ Pre-Flight Checks

Before running the app, verify:

- [ ] Backend is running (`cd apps/web && npm run dev`)
- [ ] Device is connected (`adb devices` shows your device)
- [ ] Port forwarding is active (`adb reverse tcp:3000 tcp:3000`)

## 🚀 Running the App

### Terminal 1: Start Metro
```bash
cd apps/mobile
npx react-native start --reset-cache
```

**Look for:**
- ✅ `Welcome to Metro`
- ✅ `Bundling...`
- ✅ No red errors

### Terminal 2: Build & Run
```bash
cd apps/mobile
npx react-native run-android
```

**Look for:**
- ✅ `BUILD SUCCESSFUL`
- ✅ `Installing APK`
- ✅ `Starting the app`

## 🧪 Test Flow 1: "hi"

1. App should launch
2. Send: **`hi`**
3. **Expected:**
   - Bot responds with Insight Engine message
   - Chip appears: "Give me a practical plan"
   - **IF you see this, backend is connected! ✅**

## 🔍 Debugging

### If app doesn't install:
- Check `adb devices` shows device
- Try: `adb kill-server && adb start-server`
- Re-run: `npx react-native run-android`

### If backend connection fails:
- Check Metro logs for errors
- Verify backend is running: Open `http://localhost:3000` in browser
- Re-run: `adb reverse tcp:3000 tcp:3000`

### If you see "Network request failed":
- Backend might not be running
- Port forwarding might have disconnected
- Check `adb reverse --list` shows `tcp:3000`

## ✅ Success Indicators

- ✅ App installs and launches
- ✅ Sending "hi" gets a response
- ✅ Chips appear after bot messages
- ✅ No "fallback to local routing" in logs

---

**After you run the commands, tell me:**
1. Does the app install?
2. Does it launch?
3. When you send "hi", what happens?

