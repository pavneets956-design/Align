# ✅ ALIGN Ready to Test

Everything is now configured! Here's what's ready:

## ✅ What's Done

1. **Web homepage** → Now uses new `AlignChat` component with ALIGN API
2. **Mobile app** → Configured to use ALIGN API endpoint
3. **Backend API** → `/api/align/chat` ready with 3-engine routing
4. **All components** → Wired and ready

## 🚀 Quick Test Commands

### Start Web Backend
```bash
cd apps/web
npm run dev
# Should start on http://localhost:3000
```

### Start Mobile (Terminal 1)
```bash
cd apps/mobile
npx react-native start --reset-cache
```

### Run Mobile App (Terminal 2)
```bash
cd apps/mobile

# For real device with USB:
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3000 tcp:3000
adb devices  # Verify device connected

npx react-native run-android
```

## 📱 Mobile API Configuration

The mobile app is configured in `apps/mobile/src/config/api.ts`:

**Current setting:** `http://localhost:3000/api/align` (works with `adb reverse`)

**To change:**

1. **For Android emulator:** Edit `apps/mobile/src/config/api.ts`:
   ```ts
   export const ALIGN_API_BASE_URL = 'http://10.0.2.2:3000/api/align';
   ```

2. **For real device on WiFi:** Get your PC's IP (`ipconfig` on Windows), then:
   ```ts
   export const ALIGN_API_BASE_URL = 'http://192.168.x.x:3000/api/align';
   ```

3. **For real device with USB:** Keep `localhost:3000` and run:
   ```bash
   adb reverse tcp:3000 tcp:3000
   ```

## 🧪 Test the 3 Flows

### Flow 1: Basic Hello
**Send:** `hi`
- ✅ Should see Insight response
- ✅ Chip: "Give me a practical plan"
- ✅ Tap chip → Action response
- ✅ Chip: "Help me understand the inner block"

### Flow 2: Bigger Plan
**Send:** `hi make bigger plan`
- ✅ Should see Action/Plan response (7-14 days)
- ✅ Paywall modal appears
- ✅ Button: "Upgrade to ALIGN Pro – $9/mo"
- ✅ Chip: "Unlock your full 30-day plan"

### Flow 3: Emotional
**Send:** `i feel dumb`
- ✅ Should see Insight response
- ✅ Chip: "Yes, give me an action"
- ✅ Tap chip → Action response (3-5 actions)
- ✅ Optional: "Save routine 🔒"

## 🔍 Verify Setup

### Check Backend is Running
Open browser: `http://localhost:3000`
- Should show ALIGN chat interface
- Try sending: `hi`

### Check Mobile Connection
After app launches:
- Check Metro bundler logs (should show bundle loading)
- Check device logs: `adb logcat | grep -i "ReactNativeJS"`
- Try sending: `hi`

### Quick API Test (Optional)
```bash
curl -X POST http://localhost:3000/api/align/chat \
  -H "Content-Type: application/json" \
  -d '{"userInput":"hi","userTier":"free"}'
```

Should return JSON with bot message and chips.

## 🐛 If Something Breaks

### Web shows errors
- Check browser console (F12)
- Verify `.env` file exists in `apps/web/`
- Check `OPENAI_API_KEY` is set
- Restart `npm run dev`

### Mobile can't connect
- Verify backend is running (`http://localhost:3000` works in browser)
- Check `adb reverse tcp:3000 tcp:3000` was run
- Verify `ALIGN_API_BASE_URL` in `apps/mobile/src/config/api.ts`
- Check device and PC are on same WiFi (if not using USB)

### API returns errors
- Check OpenAI API key is valid
- Check Supabase credentials (if using)
- Check server logs in terminal running `npm run dev`

## 📝 Next Steps After Testing

Once all 3 flows work:

1. ✅ Verify paywall shows correctly
2. ✅ Test Stripe checkout (even if you cancel)
3. ⏳ Configure auth (optional)
4. ⏳ Deploy to production
5. ⏳ Set up live Stripe keys

## 🎯 Success!

You're ready to test! Run:

```bash
cd apps/web && npm run dev
```

Then open `http://localhost:3000` and send: **`hi`**

Tell me what you see! 🚀

