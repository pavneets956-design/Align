# ALIGN Mobile App Setup Guide

## Overview

ALIGN is a chat-based assistant with 3 internal engines:
- **Insight Engine**: For emotional/identity issues - direct, penetrating reframes
- **Action Engine**: For practical "do this" requests - concrete steps and routines
- **Plan Engine (Pro)**: For bigger multi-day plans with paywall upsell

## Configuration

### API Configuration

Edit `src/config/api.ts` to configure your backend:

```typescript
// For production: Set to your Cloudflare Worker URL
export const API_BASE_URL = 'https://your-worker.workers.dev';

// For local development: Use Next.js API
export const USE_LOCAL_BACKEND = true; // Set to false for production
```

### Environment Variables (Optional)

Create a `.env` file in `apps/mobile/` (or use React Native Config):

```
WORKER_URL=https://your-worker.workers.dev
LOCAL_API_URL=http://localhost:3000/api/guidance
USE_LOCAL_BACKEND=true
OPENAI_API_KEY=your-key-here (not recommended for client-side)
```

## Backend Integration

### Option 1: Cloudflare Worker (Production)

1. Deploy your Cloudflare Worker with the `/guidance` endpoint
2. Set `API_BASE_URL` in `src/config/api.ts` to your worker URL
3. Ensure CORS is configured for your app domain

### Option 2: Local Next.js API (Development)

1. Ensure `apps/web` is running on `http://localhost:3000`
2. The app will automatically use `/api/guidance` endpoint
3. Set `USE_LOCAL_BACKEND = true` in `src/config/api.ts`

### Backend API Contract

Your backend should accept POST requests to `/guidance`:

**Request:**
```json
{
  "message": "user message text",
  "input": "user message text",
  "prompt": "user message text",
  "targetMode": "insight" | "action" | "plan" (optional)
}
```

**Response:**
```json
{
  "reply": "Bot response text",
  "lines": ["Line 1", "Line 2"], // Alternative to reply
  "mode": "insight" | "action",
  "engineUsed": "insight" | "action" | "plan",
  "suggestedChips": [
    { "id": "give_plan", "label": "Give me a practical plan" }
  ],
  "showPaywall": false
}
```

## Local Routing (Fallback)

The app includes local routing logic in `src/lib/alignApi.ts` that implements the 3 test flows:

- **Flow 1**: `hi` → Insight Engine → "Give me a practical plan" chip
- **Flow 2**: `hi make bigger plan` → Action Engine → Pro upsell
- **Flow 3**: `i feel dumb` → Insight Engine → "Yes, give me an action" chip

This works offline and can be used for testing before backend integration.

## Quick Chips

Chips are buttons that appear after bot messages:
- `give_plan` → Routes to Action Engine with today's structure
- `yes_action` → Routes to Action Engine with 3 concrete actions
- `inner_block` → Routes to Insight Engine for inner clarity
- `unlock_30_days` → Opens paywall modal (Pro feature)
- `save_routine` → Opens paywall modal if free tier

## User Tier System

Currently hardcoded in `App.tsx`:
```typescript
const userTier: 'free' | 'pro' = 'free';
```

**TODO**: Integrate with your auth/storage system to:
1. Fetch user tier on app start
2. Show/hide Pro features
3. Handle subscription status

## Pro Paywall

The paywall modal appears when:
- User taps "Unlock your full 30-day plan" chip
- User tries to save a routine (free tier)
- Backend response includes `showPaywall: true`

**TODO**: Integrate with Stripe/RevenueCat/subscription system:
1. Update `ChatScreen.tsx` `upgradeButton` onPress handler
2. Handle subscription success/failure
3. Update user tier after successful purchase

## Testing the 3 Flows

### Flow 1: Basic Hello → Insight → Action
1. Send: `hi`
2. Bot responds with Insight Engine message
3. Tap chip: "Give me a practical plan"
4. Bot responds with Action Engine (today's structure)

### Flow 2: Bigger Plan → Action + Pro Upsell
1. Send: `hi make bigger plan`
2. Bot responds with Action Engine (7-14 day plan)
3. Paywall modal appears
4. Tap chip: "Unlock your full 30-day plan"
5. Paywall modal appears again

### Flow 3: Deep Emotional → Insight → Action
1. Send: `i feel dumb`
2. Bot responds with Insight Engine (direct, penetrating)
3. Tap chip: "Yes, give me an action"
4. Bot responds with Action Engine (3 concrete actions)

## File Structure

```
apps/mobile/
├── App.tsx                          # Main entry, renders ChatScreen
├── src/
│   ├── screens/
│   │   └── ChatScreen.tsx          # Main chat UI
│   ├── lib/
│   │   └── alignApi.ts             # API client + local routing
│   ├── types/
│   │   └── align.ts                # TypeScript types
│   └── config/
│       └── api.ts                  # API configuration
└── ALIGN_SETUP.md                  # This file
```

## Next Steps

1. ✅ Configure API endpoints in `src/config/api.ts`
2. ✅ Deploy backend or use local Next.js API
3. ⏳ Integrate user tier from auth system
4. ⏳ Integrate Stripe/RevenueCat for Pro subscriptions
5. ⏳ Add persistence (save chat history)
6. ⏳ Add error handling and retry logic
7. ⏳ Add analytics (optional)

## Notes

- All routing logic is currently client-side (local stubs)
- Backend integration is optional - app works offline with local routing
- User tier is hardcoded to 'free' - update App.tsx when ready
- Paywall is a modal placeholder - integrate subscription system when ready

