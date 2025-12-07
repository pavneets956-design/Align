# 🔧 Backend API Connection Fix

## Problem

Mobile app shows: `WARN Backend API failed, using local routing: [TypeError: Network request failed]`

This means the mobile app can't reach your backend API at `http://localhost:3000/api/align/chat`.

## ✅ Solution: Two Steps

### Step 1: Forward Port 3000 ✅ DONE

Already fixed! Run this command:
```bash
adb reverse tcp:3000 tcp:3000
```

This forwards port 3000 from your device to your PC.

### Step 2: Start Backend Server

**You need to start the Next.js backend server:**

**Terminal 3 (NEW):**
```powershell
cd C:\Users\gillp\CascadeProjects\talking-light\apps\web
npm run dev
```

This will start the backend on `http://localhost:3000`.

## ✅ Verify Setup

### Check Port Forwarding
```bash
adb reverse --list
```

Should show:
```
UsbFfs tcp:3000 tcp:3000
UsbFfs tcp:8081 tcp:8081
```

### Check Backend is Running
```bash
# Open browser or curl
curl http://localhost:3000/api/align/chat
# OR just open: http://localhost:3000
```

Should see Next.js dev server response.

### Check in Mobile App
- Send message: `hi`
- Should connect to backend (no "Network request failed" warning)
- If still fails, check Metro logs for exact error

## 📋 Complete Setup Checklist

**Terminal 1: Metro**
```powershell
cd apps/mobile
npx react-native start --reset-cache
```

**Terminal 2: Build/Run**
```powershell
cd apps/mobile
npx react-native run-android
```

**Terminal 3: Backend (REQUIRED)**
```powershell
cd apps/web
npm run dev
```

**One-time Setup:**
```powershell
adb reverse tcp:3000 tcp:3000
adb reverse tcp:8081 tcp:8081
```

## 🎯 Expected Behavior

### With Backend Running:
- ✅ Messages go to backend API
- ✅ Real AI responses (GPT-4o)
- ✅ No "Network request failed" warning

### Without Backend (Current):
- ⚠️ Shows "Backend API failed, using local routing"
- ✅ App still works with local mock responses
- ✅ All 3 test flows work (`hi`, `hi make bigger plan`, `i feel dumb`)

## 🐛 If Still Failing

1. **Check backend logs** in Terminal 3 for errors
2. **Verify API endpoint exists**: Check `apps/web/app/api/align/chat/route.ts`
3. **Check mobile API URL**: Should be `http://localhost:3000/api/align/chat`
4. **Restart everything**:
   - Stop Metro (Ctrl+C)
   - Stop backend (Ctrl+C)
   - Restart both
   - Restart app on device

---

**The app works fine with local routing, but to get real AI responses, start the backend server!** 🚀

