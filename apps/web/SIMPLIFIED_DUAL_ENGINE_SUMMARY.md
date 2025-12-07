# ✅ Simplified Dual-Engine System - Complete Implementation

## Overview

Talking Light now uses **two intelligent engines** working together automatically:
1. **Insight Engine** (Osho-style) - for inner clarity, emotional work, awareness
2. **Action Engine** (Jim Rohn-style) - for practical plans, goals, discipline

**No mode selection UI** - the system automatically classifies messages and responds appropriately using a simple keyword-based classifier.

## Files Created

### 1. **`apps/web/src/lib/talkingLightClassifier.ts`**
   - Simple keyword-based classifier (no LLM calls)
   - Classifies messages as: `"inner" | "outer" | "mixed"`
   - Fast, cheap, deterministic
   - Falls back to `"inner"` if no keywords match

### 2. **`apps/web/src/lib/actionCoachPrompt.ts`**
   - Jim Rohn-inspired system prompt
   - Focus: practical steps, habits, discipline, responsibility
   - Tone: direct, grounded, no fluff, no toxic hustle

## Files Modified

### 1. **`apps/web/app/api/guidance/route.ts`**
   - ✅ Removed all complex RAG, emotion detection, CAG logic
   - ✅ Simplified to single path:
     1. Parse user message
     2. Classify with keyword-based classifier
     3. Pick system prompt (Insight or Action)
     4. Call OpenAI
     5. Return reply + mode + type
   - ✅ Removed unused imports and functions
   - ✅ Clean, simple implementation

### 2. **`apps/web/src/lib/api.ts`**
   - ✅ Updated return type: `GuidanceResult` with `lines`, `mode`, `type`
   - ✅ Removed `engine` parameter (no explicit switching)
   - ✅ Simplified request body to accept `message`, `input`, or `prompt`

### 3. **`apps/web/app/page.tsx`**
   - ✅ Updated header subtitle: "Inner clarity · Practical action"
   - ✅ Removed engine switching buttons (keeping it simple)
   - ✅ Updated message handling to use new API format
   - ✅ Removed `handleSwitchEngine` function

## How It Works

### 1. **User sends message**
   ```
   "I feel anxious and lost."
   ```

### 2. **Backend classifies**
   ```ts
   type = classifyMessage(query); // Returns: "inner"
   ```

### 3. **Engine selection**
   ```ts
   if (type === "outer") mode = "action";
   else mode = "insight"; // inner or mixed
   ```

### 4. **Response generation**
   - **Insight**: Uses `TALKING_LIGHT_SYSTEM_PROMPT` + `gpt-4o`
   - **Action**: Uses `ACTION_COACH_SYSTEM_PROMPT` + `gpt-4o`
   - Temperature: 0.8, max_tokens: 700

### 5. **Response format**
   ```json
   {
     "reply": "...",
     "lines": ["...", "..."],
     "mode": "insight",
     "type": "inner"
   }
   ```

## Classification Logic

### Keyword Lists:

**Inner Keywords:**
- anxious, anxiety, sad, lonely, alone, depressed, hurt, broken, angry, betrayed, confused, lost, overwhelmed, stressed, fear, panic, shame, guilt, pain, cry, emotional

**Outer Keywords:**
- money, income, business, clients, sales, job, career, promotion, productivity, discipline, habit, habits, routine, gym, workout, side hustle, project, goals, goal, startup, company, focus, time management

### Routing:
- `inner` → Insight Engine (Osho)
- `outer` → Action Engine (Jim Rohn)
- `mixed` → Insight Engine (start with clarity)
- No keywords → `inner` (default, safer)

## Example Flows

### Example 1: "I feel anxious and lost."
1. Classifies as: `inner`
2. Uses: Insight Engine (Osho)
3. Response: Osho-style awareness guidance
4. Returns: `{ mode: "insight", type: "inner" }`

### Example 2: "I want to start a side hustle but I have no discipline."
1. Classifies as: `mixed` (has "side hustle" + "discipline" + emotional tone)
2. Uses: Insight Engine (starts with clarity)
3. Response: Osho-style insight about resistance/discipline
4. Returns: `{ mode: "insight", type: "mixed" }`

### Example 3: "I need to make more money."
1. Classifies as: `outer`
2. Uses: Action Engine (Jim Rohn)
3. Response: Practical money-making steps
4. Returns: `{ mode: "action", type: "outer" }`

## UI Features

### Header
```
Talking Light
Inner clarity · Practical action
```

### Single Identity
- User sees only ONE assistant: "Talking Light"
- No mode toggles or switches
- System automatically routes to appropriate engine
- Simple, clean experience

## Benefits

1. **No cognitive load**: User never thinks about modes
2. **Intelligent routing**: System adapts to message content automatically
3. **Fast & cheap**: Keyword-based classification (no LLM calls)
4. **Simple codebase**: Removed complex RAG, emotion detection, CAG logic
5. **Complete support**: Both inner clarity AND practical action

## Removed Complexity

- ❌ RAG (scripture retrieval)
- ❌ Emotion detection
- ❌ CAG (Corrective Augmented Generation)
- ❌ Tone validation
- ❌ Complex filtering logic
- ❌ Engine switching UI buttons
- ❌ Multiple code paths

## What Remains

- ✅ Simple keyword classification
- ✅ Two system prompts (Insight & Action)
- ✅ Single OpenAI call per request
- ✅ Clean response format
- ✅ One visible identity: Talking Light

---

**Status: ✅ SIMPLIFIED DUAL-ENGINE SYSTEM COMPLETE**

The app now intelligently routes between Insight (Osho) and Action (Jim Rohn) engines based on simple keyword classification, with a clean, simple codebase and no UI complexity.

