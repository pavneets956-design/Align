# 🔧 Network Connection Debug

## ✅ What I Just Fixed

**Bug:** Double `/chat` in URL was creating: `http://localhost:3000/api/align/chat/chat` ❌

**Fix:** Removed extra `/chat` - now uses: `http://localhost:3000/api/align/chat` ✅

## 🧪 Test the Fix

### Step 1: Restart Metro

```bash
cd apps/mobile
# Stop Metro (Ctrl+C), then:
npx react-native start --reset-cache
```

### Step 2: Rebuild App

```bash
npx react-native run-android
```

### Step 3: Test Connection

Send: `hi` in the app

**Expected:**
- ✅ No "Network request failed" warning
- ✅ Real AI response from backend
- ✅ Chips appear

## 🔍 Verify Backend is Running

**Quick test:**
```bash
# On PC, test if backend responds:
curl http://localhost:3000/api/align/chat
```

**Should return:** `Method Not Allowed` (means endpoint exists)

**If backend is NOT running:**
```bash
cd apps/web
npm run dev
```

Wait for: `Ready! http://localhost:3000`

## ✅ Current Status

- ✅ ADB reverse is active: `tcp:3000 tcp:3000`
- ✅ Device connected: `RFCWB1N6N0P     device`
- ✅ URL bug fixed (removed double `/chat`)
- ⏳ Backend must be running on port 3000

## 🎯 Next Steps

1. **Verify backend is running**
2. **Restart Metro with --reset-cache**
3. **Rebuild and test app**
4. **Send "hi" - should connect to backend now!**

---

**The URL bug is fixed. Now just ensure backend is running and restart Metro/app!**

