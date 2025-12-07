# 🔧 Network Connection Fix Guide

## ❌ Current Issue

**Error:** `Network request failed` in `sendToBackend`
**Location:** `apps/mobile/src/lib/alignApi.ts:209`

The mobile app cannot reach the backend API at `http://localhost:3000/api/align/chat`.

## ✅ Fix Steps

### Step 1: Verify Backend is Running

**Check if backend is accessible:**

```bash
# Open browser on PC:
http://localhost:3000
```

**Or test API directly:**
```bash
curl http://localhost:3000/api/align/chat
```

Should return: `Method Not Allowed` (means endpoint exists)

**If backend is NOT running:**
```bash
cd apps/web
npm run dev
```

Wait until you see: `Ready! http://localhost:3000`

---

### Step 2: Verify ADB Port Forwarding

```bash
# Check current port forwards
adb reverse --list
```

**Should show:**
```
tcp:3000 tcp:3000
tcp:8081 tcp:8081
```

**If NOT showing, run:**
```bash
adb reverse tcp:3000 tcp:3000
adb reverse tcp:8081 tcp:8081
```

**Verify again:**
```bash
adb reverse --list
```

---

### Step 3: Check Device Connection

```bash
adb devices
```

**Should show:**
```
List of devices attached
RFCWB1N6N0P     device
```

If shows "unauthorized":
- Check phone for USB debugging authorization prompt
- Click "Allow" or "Always allow"

---

### Step 4: Verify API URL in Code

Check `apps/mobile/src/config/api.ts`:

**For USB debugging (current setup):**
```ts
export const ALIGN_API_BASE_URL = 'http://localhost:3000/api/align';
```

**This requires:** `adb reverse tcp:3000 tcp:3000`

---

### Step 5: Test Connection from Device

**Option A: Use WiFi IP (Alternative)**

1. Get your PC's IP:
   ```bash
   ipconfig
   ```
   Look for IPv4 Address (e.g., `192.168.0.12`)

2. Edit `apps/mobile/src/config/api.ts`:
   ```ts
   export const ALIGN_API_BASE_URL = 'http://192.168.0.12:3000/api/align';
   ```

3. Make sure PC and phone are on **same WiFi network**

4. Restart Metro and rebuild app

**Option B: Fix ADB Reverse**

1. Kill all ADB processes:
   ```bash
   adb kill-server
   adb start-server
   ```

2. Re-forward ports:
   ```bash
   adb reverse tcp:3000 tcp:3000
   adb reverse tcp:8081 tcp:8081
   ```

3. Restart Metro:
   ```bash
   cd apps/mobile
   npx react-native start --reset-cache
   ```

4. Rebuild app:
   ```bash
   npx react-native run-android
   ```

---

## 🔍 Debugging Steps

### Check Metro Logs

Look for:
- `Network request failed` → Backend not reachable
- `ECONNREFUSED` → Port forwarding not working
- `404 Not Found` → Wrong URL path

### Test API from Device's Browser

1. On your phone, open browser
2. Try to visit: `http://localhost:3000`
3. If it loads → ADB reverse is working
4. If it fails → ADB reverse issue

### Check Backend Logs

In terminal running `npm run dev`:
- Should see API requests when mobile app calls
- If no requests appear → Mobile can't reach backend

---

## ✅ Success Indicators

After fixing, you should see:

1. **No more "Network request failed" warnings**
2. **Backend logs show API requests** (in `npm run dev` terminal)
3. **Real AI responses** (not local fallback)
4. **Chips appear** after bot messages

---

## 🚀 Quick Fix Checklist

- [ ] Backend running (`http://localhost:3000` works in browser)
- [ ] `adb reverse tcp:3000 tcp:3000` executed
- [ ] `adb reverse --list` shows `tcp:3000 tcp:3000`
- [ ] Device shows in `adb devices` as `device` (not unauthorized)
- [ ] Metro restarted with `--reset-cache`
- [ ] App rebuilt (`npx react-native run-android`)

---

## 🔄 Alternative: Use WiFi IP

If ADB reverse keeps failing:

1. Get PC IP: `ipconfig` (look for IPv4)
2. Update `apps/mobile/src/config/api.ts`:
   ```ts
   export const ALIGN_API_BASE_URL = 'http://YOUR-PC-IP:3000/api/align';
   ```
3. Ensure PC firewall allows port 3000
4. Ensure PC and phone on same WiFi
5. Restart Metro and rebuild

---

**After applying fixes, send "hi" again and check if warning disappears!**

