# ALIGN Quick Test Commands

Quick reference for testing the ALIGN implementation.

## 🧪 Quick API Test

Test the backend directly from terminal:

```bash
# Test Flow 1: Basic hello
curl -X POST http://localhost:3000/api/align/chat \
  -H "Content-Type: application/json" \
  -d '{"userInput":"hi","userTier":"free"}'

# Test Flow 2: Bigger plan
curl -X POST http://localhost:3000/api/align/chat \
  -H "Content-Type: application/json" \
  -d '{"userInput":"hi make bigger plan","userTier":"free"}'

# Test Flow 3: Emotional
curl -X POST http://localhost:3000/api/align/chat \
  -H "Content-Type: application/json" \
  -d '{"userInput":"i feel dumb","userTier":"free"}'
```

**Expected:** JSON response with `messages`, `suggestedChips`, `engineUsed`, etc.

## 📱 Mobile Device Setup

### Check Device Connection
```bash
adb devices
# Should show: RFCWB1N6N0P     device
```

### Forward Ports (Real Device)
```bash
# Metro bundler
adb reverse tcp:8081 tcp:8081

# Backend API
adb reverse tcp:3000 tcp:3000
```

### Get PC IP (for WiFi setup)
```bash
# Windows
ipconfig
# Look for IPv4 Address (e.g., 192.168.0.12)

# Mac/Linux
ifconfig
# or
ip addr show
```

Then set in mobile: `ALIGN_API_BASE_URL=http://192.168.0.12:3000`

## 🔍 Verify Setup

### Check Backend is Running
```bash
# Should return JSON
curl http://localhost:3000/api/align/chat
# Expected: Error (need POST), but confirms endpoint exists
```

### Check Stripe Keys (Optional)
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/billing/webhook
# Copy the webhook secret it prints
```

### Check Database Tables (Supabase)
```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'plans', 'subscription_events');
-- Should return 3 rows
```

## 🎯 Test Checklist

**Web:**
- [ ] Open `http://localhost:3000`
- [ ] Send: `hi` → See Insight response + chip
- [ ] Click chip → See Action response
- [ ] Send: `hi make bigger plan` → See paywall

**Mobile:**
- [ ] App launches without crash
- [ ] Send: `hi` → See response
- [ ] Tap chip → See new response
- [ ] Send: `i feel dumb` → See Insight response

## 🐛 Common Fixes

### "Unable to resolve module @babel/runtime"
```bash
cd apps/mobile
rm -rf node_modules package-lock.json
npm install
```

### "Network request failed" (Mobile)
```bash
# For real device, ensure:
adb reverse tcp:3000 tcp:3000

# Or use PC's IP:
# Get IP with: ipconfig (Windows) or ifconfig (Mac/Linux)
# Set ALIGN_API_BASE_URL=http://YOUR-IP:3000
```

### "OPENAI_API_KEY not configured"
- Check `.env` file is in `apps/web/` folder
- Restart `npm run dev` after adding env vars
- Verify no typos in variable name

### App crashes on launch
```bash
# Clean build
cd apps/mobile/android
./gradlew clean

cd ..
npx react-native run-android
```

