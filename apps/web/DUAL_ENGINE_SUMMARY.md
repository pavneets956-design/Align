# ✅ Dual-Engine System - Complete Implementation

## Overview

Talking Light now uses **two intelligent engines** working together:
1. **Insight Engine** (Osho-style) - for inner clarity, emotional work, awareness
2. **Action Engine** (Jim Rohn-style) - for practical plans, goals, discipline

**No mode selection UI** - the system automatically classifies messages and responds appropriately.

## Files Created

### 1. **`apps/web/src/lib/actionCoachPrompt.ts`**
   - Jim Rohn-inspired system prompt
   - Focus: practical steps, habits, discipline, responsibility
   - Tone: direct, grounded, no fluff, no toxic hustle

### 2. **`apps/web/src/lib/messageClassifier.ts`**
   - Classifies messages as: `'inner' | 'outer' | 'mixed'`
   - Uses GPT-4o with simple prompt
   - Fallback heuristic based on keywords
   - Returns classification for routing

## Files Modified

### 1. **`apps/web/app/api/guidance/route.ts`**
   - ✅ Added imports: `ACTION_COACH_SYSTEM_PROMPT`, `classifyMessage`
   - ✅ Added `engine` parameter support (for explicit switching)
   - ✅ Auto-classification: classifies message type on each request
   - ✅ Dual engine routing:
     - `insight` → Uses `TALKING_LIGHT_SYSTEM_PROMPT` + optional RAG
     - `action` → Uses `ACTION_COACH_SYSTEM_PROMPT` + direct generation
   - ✅ Response includes: `engine`, `canSwitchTo`, `messageType`
   - ✅ Insight engine: keeps existing RAG, tone validation, filtering
   - ✅ Action engine: simple, direct, practical response

### 2. **`apps/web/src/lib/api.ts`**
   - ✅ Updated `fetchGuidance` return type: `GuidanceResult` with `lines`, `engine`, `canSwitchTo`, `messageType`
   - ✅ Added optional `engine` parameter for explicit switching
   - ✅ Returns full result object instead of just lines array

### 3. **`apps/web/app/page.tsx`**
   - ✅ Updated `Message` type to include `engine` and `canSwitchTo`
   - ✅ Updated `handleSendMessage` to handle new `GuidanceResult` format
   - ✅ Added `handleSwitchEngine` function for button clicks
   - ✅ Updated header subtitle: "Inner clarity · Practical action"
   - ✅ Added contextual buttons under each response:
     - After insight reply: "🧭 Give me a practical plan" (switches to action)
     - After action reply: "🕯 Help me understand what's blocking me inside" (switches to insight)
   - ✅ Buttons only show when `canSwitchTo` is available

## How It Works

### 1. **User sends message**
   ```
   "I feel anxious and lost."
   ```

### 2. **Backend classifies**
   ```ts
   messageType = await classifyMessage(query); // Returns: "inner"
   ```

### 3. **Engine selection**
   ```ts
   if (messageType === 'outer') useEngine = 'action';
   else useEngine = 'insight'; // inner or mixed
   ```

### 4. **Response generation**
   - **Insight**: Uses Osho prompt + optional RAG + tone validation
   - **Action**: Uses Jim Rohn prompt + direct generation

### 5. **Response format**
   ```json
   {
     "lines": ["...", "..."],
     "engine": "insight",
     "canSwitchTo": "action",
     "messageType": "inner"
   }
   ```

### 6. **UI displays**
   - Shows response lines
   - Shows contextual button if `canSwitchTo` is set
   - User clicks button → calls API with `engine` parameter → gets other engine's response

## Classification Logic

### Message Types:
- **`inner`**: Emotional, spiritual, awareness, feeling stuck, pain, confusion
- **`outer`**: Goals, money, business, career, discipline, habits, productivity
- **`mixed`**: Contains both emotional AND practical elements

### Routing:
- `inner` → Insight Engine
- `outer` → Action Engine  
- `mixed` → Insight Engine (start with clarity, then offer action)

## UI Features

### Header
```
Talking Light
Inner clarity · Practical action
```

### Response Buttons
- **After Insight reply**: 
  - 🧭 **"Give me a practical plan"** → Switches to Action Engine
- **After Action reply**:
  - 🕯 **"Help me understand what's blocking me inside"** → Switches to Insight Engine

### Button Styling
- Insight switch button: Amber background (`bg-amber-100 text-amber-700`)
- Action switch button: Purple background (`bg-purple-100 text-purple-700`)
- Hover effects and smooth transitions

## Example Flows

### Flow 1: Emotional → Practical
1. User: "I feel anxious and lost."
2. System: Classifies as `inner` → Uses Insight Engine
3. Response: Osho-style awareness guidance
4. Button: "🧭 Give me a practical plan"
5. User clicks → System uses Action Engine
6. Response: Step-by-step practical plan

### Flow 2: Practical → Emotional
1. User: "I want to start a business but I'm lazy."
2. System: Classifies as `mixed` → Uses Insight Engine first
3. Response: Osho-style insight about laziness/resistance
4. Button: "🧭 Give me a practical plan"
5. User clicks → System uses Action Engine
6. Response: Business startup steps

### Flow 3: Pure Action
1. User: "I need to make more money."
2. System: Classifies as `outer` → Uses Action Engine
3. Response: Practical money-making steps
4. Button: "🕯 Help me understand what's blocking me inside"
5. User clicks → System uses Insight Engine
6. Response: Inner exploration of money blocks

## Benefits

1. **No cognitive load**: User never thinks about "modes"
2. **Intelligent routing**: System adapts to message content
3. **Seamless switching**: One click to get the other perspective
4. **Complete support**: Both inner clarity AND practical action
5. **Monetizable**: Can sell "Inner + Outer Transformation" programs

## Next Steps (Optional)

1. **Add context passing**: When switching engines, pass the previous response as context
2. **Add analytics**: Track which engine is used more, which switches are popular
3. **Add premium features**: 
   - Unlimited engine switches
   - Custom action plans
   - Habit tracking integration
4. **Improve classification**: Fine-tune classifier with more examples
5. **Add voice mode**: Different TTS voices for each engine

---

**Status: ✅ DUAL-ENGINE SYSTEM COMPLETE**

The app now intelligently routes between Insight (Osho) and Action (Jim Rohn) engines based on message content, with seamless switching via contextual buttons.

