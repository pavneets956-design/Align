# ALIGN Quick Start Guide

Follow these steps to get ALIGN running end-to-end.

## 📋 Prerequisites

- Node.js 18+
- Supabase account (free tier works)
- Stripe account (test mode)
- OpenAI API key
- Android device with USB debugging (or emulator)

## 🚀 Step-by-Step Setup

### 1. Environment Variables

Create `.env` or `.env.local` in `apps/web`:

```env
# OpenAI (Required)
OPENAI_API_KEY=sk-your-openai-key-here

# Stripe (Required for Pro tier)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRICE_ID_ALIGN_PRO=price_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key

# Supabase (Required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# API URLs
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
ALIGN_API_BASE_URL=http://localhost:3000

# Optional - NextAuth (if you add auth later)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

**For mobile (Android emulator):**
```env
ALIGN_API_BASE_URL=http://10.0.2.2:3000
```

**For mobile (real device on same WiFi):**
1. Find your PC's local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Example: `192.168.0.12`
3. Set: `ALIGN_API_BASE_URL=http://192.168.0.12:3000`
4. Run: `adb reverse tcp:3000 tcp:3000`

### 2. Database Setup (Supabase)

1. Go to Supabase Dashboard → SQL Editor
2. Open `db/schema_align.sql` from this repo
3. Copy entire contents
4. Paste into Supabase SQL Editor
5. Click **Run**

This creates:
- `user_profiles` table
- `plans` table
- `subscription_events` table
- RLS policies

### 3. Stripe Setup

#### Create Product
1. Go to Stripe Dashboard → Products
2. Click **+ Add product**
3. Name: `ALIGN Pro`
4. Pricing: `$9.00 USD` per month (recurring)
5. Click **Save**
6. Copy the **Price ID** (starts with `price_`)
7. Add to `.env` as `STRIPE_PRICE_ID_ALIGN_PRO`

#### Get API Keys
1. Stripe Dashboard → Developers → API keys
2. Copy **Secret key** → `STRIPE_SECRET_KEY`
3. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

#### Set Up Webhook (for production)

**For local development (Stripe CLI):**
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/billing/webhook
# Copy the webhook secret it prints → STRIPE_WEBHOOK_SECRET
```

**For production:**
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/billing/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 4. Install Dependencies

```bash
# From repo root
cd C:\Users\gillp\CascadeProjects\talking-light

# Web app
cd apps/web
npm install

# Mobile app
cd ../mobile
npm install
```

### 5. Run Web/Backend

```bash
cd apps/web
npm run dev
```

Should start on `http://localhost:3000`

**Test in browser:**
- Open `http://localhost:3000`
- You should see ALIGN chat interface (or the app's main page)
- Try sending: `hi`

### 6. Run Mobile App

**Terminal 1 - Metro:**
```bash
cd apps/mobile
npx react-native start --reset-cache
```

**Terminal 2 - Setup ADB & Run:**
```bash
cd apps/mobile

# Check device connected
adb devices

# Forward ports (for real device)
adb reverse tcp:8081 tcp:8081  # Metro bundler
adb reverse tcp:3000 tcp:3000  # Backend API

# Build and install
npx react-native run-android
```

**If using emulator:**
- Skip `adb reverse` commands (emulator handles localhost)
- Just run `npx react-native run-android`

### 7. Test the 3 Flows

#### ✅ Flow 1: Basic Hello → Insight → Action

**Send:** `hi`

**Expected:**
- Insight Engine reply with welcome
- Chip: **"Give me a practical plan"**
- Tap chip → Action Engine response (today's structure)
- Chip: **"Help me understand the inner block"**

#### ✅ Flow 2: Bigger Plan → Pro Upsell

**Send:** `hi make bigger plan`

**Expected:**
- Action/Plan Engine response (7-14 day structure)
- Paywall modal appears
- Button: **"Upgrade to ALIGN Pro – $9/mo"**
- Chip: **"Unlock your full 30-day plan"**

#### ✅ Flow 3: Emotional → Insight → Action

**Send:** `i feel dumb`

**Expected:**
- Insight Engine reply (direct, penetrating question)
- Chip: **"Yes, give me an action"**
- Tap chip → Action Engine (3 concrete actions)
- Chip: **"Save routine 🔒"** (if free tier)

## 🐛 Troubleshooting

### Backend not responding

- Check `OPENAI_API_KEY` is set correctly
- Verify backend is running: `curl http://localhost:3000/api/align/chat`
- Check browser console for errors

### Mobile can't connect

- Verify `ALIGN_API_BASE_URL` is set correctly
- For real device: Run `adb reverse tcp:3000 tcp:3000`
- Check device and PC are on same WiFi
- Try using PC's LAN IP instead of `localhost`

### Stripe checkout fails

- Verify `STRIPE_SECRET_KEY` is set
- Check `STRIPE_PRICE_ID_ALIGN_PRO` matches Stripe dashboard
- Use test mode keys first

### Database errors

- Verify Supabase URL and keys are correct
- Check `schema_align.sql` ran successfully
- Verify tables exist in Supabase Table Editor

## 🎯 Next Steps After Testing

1. ✅ All 3 flows working
2. ✅ Stripe checkout opens (even if you cancel)
3. ✅ Paywall shows at correct moments
4. ⏳ Add authentication (optional)
5. ⏳ Deploy to production
6. ⏳ Create live Stripe product
7. ⏳ Update mobile app API URL to production

## 📞 Need Help?

- Check `ALIGN_IMPLEMENTATION.md` for detailed docs
- Check `IMPLEMENTATION_SUMMARY.md` for file reference
- Verify all env vars are set (no missing values)
- Check console logs for specific errors

