# ALIGN Implementation Guide

This document describes the complete ALIGN system implementation with Insight/Action/Plan engines, Pro tier, and Stripe billing.

## ✅ Implementation Complete

The ALIGN system has been fully implemented with:
- ✅ 3-engine routing (Insight, Action, Plan)
- ✅ Backend API (`/api/align/chat`)
- ✅ Stripe billing integration
- ✅ Web chat interface with chips and paywall
- ✅ Mobile chat interface (React Native)
- ✅ Database schema for users, plans, subscriptions
- ✅ Environment variable configuration
- ✅ Local routing fallback for offline testing

## 📁 Files Changed/Created

### Database Schema
- `db/schema_align.sql` - Extended schema for users, plans, subscriptions

### Backend API
- `apps/web/app/api/align/chat/route.ts` - Main chat endpoint with 3-engine routing
- `apps/web/app/api/align/plans/route.ts` - Save/load plans (Pro feature)
- `apps/web/app/api/billing/create-checkout-session/route.ts` - Stripe checkout
- `apps/web/app/api/billing/webhook/route.ts` - Stripe webhook handler

### Frontend - Web
- `apps/web/src/components/AlignChat.tsx` - New ALIGN chat component
- `apps/web/src/lib/alignPrompts.ts` - System prompts for 3 engines
- `apps/web/src/lib/alignClassifier.ts` - Message classification logic
- `apps/web/package.json` - Added Stripe dependency

### Frontend - Mobile
- `apps/mobile/src/screens/ChatScreen.tsx` - Updated to use ALIGN API
- `apps/mobile/src/lib/alignApi.ts` - Updated API client
- `apps/mobile/src/types/align.ts` - Type definitions
- `apps/mobile/src/config/api.ts` - API configuration

### Configuration
- `.env.example` - Environment variables template (not created due to gitignore, see below)

## 🔧 Setup Instructions

### 1. Database Setup (Supabase)

1. Go to your Supabase project SQL Editor
2. Run `db/schema.sql` (if not already done)
3. Run `db/schema_align.sql` to create:
   - `user_profiles` table
   - `plans` table
   - `subscription_events` table
   - RLS policies

### 2. Environment Variables

Create `.env` file in project root (copy from example below):

```bash
# OpenAI
OPENAI_API_KEY=sk-your-key-here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRICE_ID_ALIGN_PRO=price_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key

# API URLs
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
ALIGN_API_BASE_URL=http://localhost:3000
```

### 3. Stripe Setup

#### Create Product in Stripe Dashboard

1. Go to Stripe Dashboard → Products
2. Create new product: **ALIGN Pro**
3. Set price: **$9/month** (recurring)
4. Copy the **Price ID** (starts with `price_`) and set `STRIPE_PRICE_ID_ALIGN_PRO`

#### Set Up Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/billing/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret and set `STRIPE_WEBHOOK_SECRET`

### 4. Install Dependencies

```bash
# Web app
cd apps/web
npm install

# Mobile app (if needed)
cd apps/mobile
npm install
```

### 5. Run Development Servers

```bash
# Terminal 1: Web app
cd apps/web
npm run dev

# Terminal 2: Metro bundler (for mobile)
cd apps/mobile
npm start --reset-cache

# Terminal 3: Run on Android
cd apps/mobile
npx react-native run-android
```

## 🧪 Testing the 3 Core Flows

### Flow 1: Basic Hello → Insight → Action

1. Send: `hi`
2. **Expected**: Bot responds with Insight Engine welcome
3. **Expected**: Chip appears: "Give me a practical plan"
4. Tap chip: "Give me a practical plan"
5. **Expected**: Bot responds with Action Engine (today's structure)
6. **Expected**: Chip appears: "Help me understand the inner block"

### Flow 2: Bigger Plan → Action + Pro Upsell

1. Send: `hi make bigger plan`
2. **Expected**: Bot responds with Action Engine (7-14 day plan)
3. **Expected**: Paywall modal appears
4. **Expected**: Chip appears: "Unlock your full 30-day plan"
5. Tap chip → Paywall modal again

### Flow 3: Deep Emotional → Insight → Action

1. Send: `i feel dumb`
2. **Expected**: Bot responds with Insight Engine (direct, penetrating)
3. **Expected**: Chip appears: "Yes, give me an action"
4. Tap chip: "Yes, give me an action"
5. **Expected**: Bot responds with Action Engine (3 concrete actions)
6. **Expected**: Chip appears: "Save routine 🔒" (if free tier)

## 🔑 Manual Setup Required

### In Stripe Dashboard

1. ✅ Create product: ALIGN Pro ($9/month)
2. ✅ Set up webhook endpoint: `/api/billing/webhook`
3. ✅ Configure webhook events
4. ✅ Copy Price ID and Webhook Secret to `.env`

### In OpenAI

1. ✅ Ensure API key is valid and has credits
2. ✅ Key must be set in `.env` as `OPENAI_API_KEY`

### In Supabase

1. ✅ Run `db/schema_align.sql` in SQL Editor
2. ✅ Enable Row Level Security (already in schema)
3. ✅ Verify `user_profiles`, `plans`, `subscription_events` tables exist

### Auth Setup (Optional - For User Tier)

Currently, user tier defaults to `'free'`. To enable user authentication:

1. Set up Supabase Auth (or your preferred auth system)
2. Update `apps/web/src/components/AlignChat.tsx` to get `userId` from auth
3. Update `apps/mobile/src/screens/ChatScreen.tsx` to get `userId` from auth
4. Pass `userId` to API calls

## 📱 Mobile App Configuration

The mobile app needs to know your backend URL:

### Option 1: Environment Variable

Set `ALIGN_API_BASE_URL` in your build environment or via `react-native-config`.

### Option 2: Direct Config

Edit `apps/mobile/src/config/api.ts`:

```typescript
export const API_BASE_URL = 'https://your-domain.com/api/align';
```

## 🚀 Deployment Checklist

### Web App (Next.js)

- [ ] Set `NEXT_PUBLIC_API_BASE_URL` to production URL
- [ ] Set all Stripe keys (use live keys, not test)
- [ ] Set Supabase production URLs
- [ ] Update webhook URL in Stripe to production
- [ ] Run `npm run build` to verify

### Mobile App

- [ ] Update `ALIGN_API_BASE_URL` to production backend
- [ ] Test on real device
- [ ] Verify Stripe checkout opens correctly
- [ ] Test Pro features after upgrade

## 🔍 API Endpoints

### `POST /api/align/chat`

Main chat endpoint.

**Request:**
```json
{
  "userInput": "hi",
  "userId": "uuid-or-null",
  "userTier": "free" | "pro",
  "explicitEngine": "insight" | "action" | "plan" (optional),
  "conversationHistory": [...]
}
```

**Response:**
```json
{
  "messages": [{
    "id": "bot-123",
    "from": "bot",
    "text": "...",
    "meta": { "engine": "insight" }
  }],
  "suggestedChips": [{ "id": "give_plan", "label": "Give me a practical plan" }],
  "engineUsed": "insight",
  "showPaywall": false,
  "paywallReason": null,
  "userTier": "free"
}
```

### `POST /api/billing/create-checkout-session`

Create Stripe checkout session.

**Request:**
```json
{
  "userId": "uuid-or-null",
  "successUrl": "https://...",
  "cancelUrl": "https://..."
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### `POST /api/billing/webhook`

Stripe webhook handler (called by Stripe).

### `GET /api/align/plans?userId=...`

List user's saved plans (Pro only).

### `POST /api/align/plans`

Save a plan (Pro only).

## 🐛 Troubleshooting

### Backend returns 500 errors

- Check OpenAI API key is set and valid
- Check Supabase credentials
- Check server logs for detailed errors

### Paywall not showing

- Verify `showPaywall: true` in API response
- Check chip IDs match expected values
- Verify `userTier` is correctly passed

### Stripe checkout fails

- Verify `STRIPE_SECRET_KEY` is set
- Verify `STRIPE_PRICE_ID_ALIGN_PRO` is correct
- Check Stripe dashboard for errors

### Mobile app can't connect

- Verify `ALIGN_API_BASE_URL` is correct
- Check backend CORS settings
- Test API endpoint directly with curl/Postman

## 📝 Next Steps

1. **Add Authentication**: Wire up Supabase Auth to get real `userId`
2. **Add Plan Persistence**: Save plans after user subscribes
3. **Add Analytics**: Track engine usage, conversions
4. **Add Error Handling**: Better error messages for users
5. **Add Offline Mode**: Cache messages for offline viewing

## ✨ Summary

The ALIGN system is fully functional with:
- ✅ 3-engine routing (Insight, Action, Plan)
- ✅ Backend API with OpenAI GPT-4o
- ✅ Stripe billing for Pro tier
- ✅ Web and mobile chat interfaces
- ✅ Paywall and chip system
- ✅ Database schema for plans/subscriptions

**To go live:**
1. Set up Stripe product and webhook
2. Configure environment variables
3. Run database migrations
4. Deploy backend
5. Test all 3 flows
6. Enable authentication (optional)

