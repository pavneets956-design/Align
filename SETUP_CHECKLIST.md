# ALIGN Setup Checklist

Use this checklist to verify everything is configured correctly.

## ✅ Pre-Flight Checks

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Supabase project created
- [ ] Stripe account set up (test mode)
- [ ] OpenAI API key ready
- [ ] Android device connected or emulator ready

## ✅ Step 1: Environment Variables

Create `.env` or `.env.local` in `apps/web`:

- [ ] `OPENAI_API_KEY` set
- [ ] `STRIPE_SECRET_KEY` set (test key)
- [ ] `STRIPE_WEBHOOK_SECRET` set (or use Stripe CLI for local)
- [ ] `STRIPE_PRICE_ID_ALIGN_PRO` set
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` set
- [ ] `SUPABASE_URL` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set

**For mobile:**
- [ ] `ALIGN_API_BASE_URL` set (in `apps/mobile/src/config/api.ts` or env)
  - Emulator: `http://10.0.2.2:3000`
  - Real device (same WiFi): `http://YOUR-PC-IP:3000`
  - Real device (USB): `http://localhost:3000` + `adb reverse tcp:3000 tcp:3000`

## ✅ Step 2: Database Setup

- [ ] Opened Supabase SQL Editor
- [ ] Ran `db/schema_align.sql`
- [ ] Verified `user_profiles` table exists
- [ ] Verified `plans` table exists
- [ ] Verified `subscription_events` table exists

## ✅ Step 3: Stripe Setup

- [ ] Created product: "ALIGN Pro"
- [ ] Set price: $9/month (recurring)
- [ ] Copied Price ID → `STRIPE_PRICE_ID_ALIGN_PRO`
- [ ] Copied Secret Key → `STRIPE_SECRET_KEY`
- [ ] Copied Publishable Key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Webhook (choose one):**
- [ ] Local: Installed Stripe CLI, running `stripe listen --forward-to localhost:3000/api/billing/webhook`
- [ ] Production: Created webhook endpoint in Stripe dashboard

## ✅ Step 4: Dependencies

```bash
cd apps/web && npm install
cd ../mobile && npm install
```

- [ ] Web dependencies installed (check for `stripe` in `node_modules`)
- [ ] Mobile dependencies installed

## ✅ Step 5: Run Web Backend

```bash
cd apps/web
npm run dev
```

- [ ] Server starts on `http://localhost:3000`
- [ ] No errors in terminal
- [ ] Browser opens: `http://localhost:3000`

**Quick API test:**
```bash
curl -X POST http://localhost:3000/api/align/chat \
  -H "Content-Type: application/json" \
  -d '{"userInput":"hi","userTier":"free"}'
```

Should return JSON with bot message.

## ✅ Step 6: Run Mobile App

**Terminal 1:**
```bash
cd apps/mobile
npx react-native start --reset-cache
```

- [ ] Metro bundler starts
- [ ] Shows "Welcome to Metro"

**Terminal 2:**
```bash
cd apps/mobile

# For real device:
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3000 tcp:3000
adb devices  # Should show your device

npx react-native run-android
```

- [ ] Device shows in `adb devices`
- [ ] App builds successfully
- [ ] App installs on device
- [ ] App launches without crash

## ✅ Step 7: Test Flows

### Flow 1: Basic Hello

**Send:** `hi`

- [ ] Bot responds (Insight Engine)
- [ ] Chip appears: "Give me a practical plan"
- [ ] Tap chip → Action Engine response
- [ ] Chip appears: "Help me understand the inner block"

### Flow 2: Bigger Plan

**Send:** `hi make bigger plan`

- [ ] Bot responds (Action/Plan Engine)
- [ ] Shows 7-14 day structure
- [ ] Paywall modal appears
- [ ] Button: "Upgrade to ALIGN Pro – $9/mo"
- [ ] Tap button → Stripe checkout opens (or shows error if not fully configured)

### Flow 3: Emotional

**Send:** `i feel dumb`

- [ ] Bot responds (Insight Engine)
- [ ] Sharp, direct question
- [ ] Chip appears: "Yes, give me an action"
- [ ] Tap chip → Action Engine response
- [ ] Shows 3 concrete actions

## ✅ Common Issues Checklist

### Backend Issues

- [ ] Check `.env` file is in correct location (`apps/web/.env` or `apps/web/.env.local`)
- [ ] Verify no typos in env var names
- [ ] Check OpenAI API key is valid (has credits)
- [ ] Verify Supabase credentials are correct

### Mobile Connection Issues

- [ ] For real device: PC and phone on same WiFi network
- [ ] For real device: Ran `adb reverse tcp:3000 tcp:3000`
- [ ] `ALIGN_API_BASE_URL` matches your setup
- [ ] Backend is running and accessible from PC's browser

### Stripe Issues

- [ ] Using test mode keys (start with `sk_test_` and `pk_test_`)
- [ ] Price ID matches Stripe dashboard exactly
- [ ] Webhook URL is correct (local or production)

### Database Issues

- [ ] All tables created (check Supabase Table Editor)
- [ ] RLS policies enabled (check Supabase Authentication → Policies)
- [ ] Service role key has full access

## 🎯 Success Criteria

You're ready when:
- ✅ All 3 flows work on web
- ✅ All 3 flows work on mobile
- ✅ Paywall appears at correct moments
- ✅ Stripe checkout opens (even if you cancel)
- ✅ No console errors

## 📝 Notes

- The existing `apps/web/app/page.tsx` has an ALIGN implementation that uses the old API
- The new `AlignChat.tsx` component is ready to use - you can replace or enhance the existing page
- Mobile app uses the new ALIGN API automatically

