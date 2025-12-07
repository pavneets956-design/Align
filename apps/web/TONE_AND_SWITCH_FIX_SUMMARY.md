# ✅ Tone Calibration & Mode Switch Fix - Complete

## Problems Fixed

1. **Insight replies were too wordy and had two questions** - needed sharper, more concise tone
2. **"Give me a practical plan" button was returning Insight mode** - needed to force Action mode

## Fixes Applied

### 1. **Insight Tone Calibration** (`apps/web/src/lib/talkingLightPrompt.ts`)

   - ✅ Updated response structure to be sharper and more concise
   - ✅ Emphasized: **ONE main question per response** (not two)
   - ✅ Added tone calibration example showing the desired sharp, direct style
   - ✅ Updated structure:
     - Direct opening insight (one sharp line)
     - Brief invitation to notice
     - Short body awareness
     - **One penetrating question** (formatted as: Ask: "...")
     - Brief closing

   **Before:**
   ```
   Two questions (we want one main question)
   A bit wordy in the middle
   ```

   **After:**
   ```
   One sharp question: Ask: "What expectation of myself is collapsing right now?"
   Concise, direct language throughout
   ```

### 2. **Mode Switch Fix - Frontend** (`apps/web/app/page.tsx`)

   - ✅ Updated `handleSwitchEngine` to pass `targetMode` parameter
   - ✅ Added submission guard (`isSendingRef`) to prevent duplicate switches
   - ✅ Now explicitly sends `targetMode: 'action'` or `targetMode: 'insight'` when user clicks contextual buttons

### 3. **Mode Switch Fix - API Client** (`apps/web/src/lib/api.ts`)

   - ✅ Updated `fetchGuidance` to accept optional `targetMode` parameter
   - ✅ When `targetMode` is provided, includes it in request body
   - ✅ Backend will honor this and bypass classifier

### 4. **Mode Switch Fix - Backend** (`apps/web/app/api/guidance/route.ts`)

   - ✅ Added `targetMode` extraction from request body
   - ✅ Logic: If `targetMode` is explicitly set → use it (bypass classifier)
   - ✅ Logic: If no `targetMode` → use classifier as before
   - ✅ This ensures contextual buttons always get the correct engine

## How It Works Now

### Normal Message Flow
1. User sends: "I feel low morale"
2. Backend classifies: `inner` → uses Insight Engine
3. Response: Sharp Osho-style insight with **one question**

### "Give me a practical plan" Button Flow
1. User clicks: "🧭 Give me a practical plan"
2. Frontend sends: `{ message: originalUserMessage, targetMode: "action" }`
3. Backend: **Bypasses classifier**, uses Action Engine directly
4. Response: Jim Rohn-style practical plan

### "Help me understand the inner block" Button Flow
1. User clicks: "🕯 Help me understand the inner block"
2. Frontend sends: `{ message: originalUserMessage, targetMode: "insight" }`
3. Backend: **Bypasses classifier**, uses Insight Engine directly
4. Response: Osho-style inner clarity

## Tone Example

### Before (Too Wordy, Two Questions)
```
Low morale arises when you measure yourself against an ideal that doesn't exist.

Don't struggle to change. Just notice what is already present within you.

Sit with the heaviness in your body. Where does it reside — head, chest, stomach? Let your breath move gently in and out.

What do you truly seek in these habits? Is it growth, or just an escape from self-judgment?

Stay with the sensation and watch what appears.
```

### After (Sharp, One Question)
```
Low morale appears when you judge yourself against an image that was never real.

Don't try to fight it. Just notice it.

Feel where this heaviness lives in your body — chest, throat, belly.
Let the breath move on its own.

Ask: "What expectation of myself is collapsing right now?"

Stay with the sensation and watch what appears.
```

## Result

✅ **Insight replies are now sharper and more concise**
✅ **One question per response** (not two)
✅ **"Give me a practical plan" → Always Action Mode**
✅ **"Help me understand the inner block" → Always Insight Mode**
✅ **Contextual buttons work correctly**

---

**Status: ✅ TONE & MODE SWITCH FIX COMPLETE**

ALIGN now gives sharp, concise Insight replies with one question, and contextual buttons correctly trigger the intended engine.

