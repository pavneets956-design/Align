# ✅ ALIGN Engine Fixes - Complete

## 🎯 Overview

Fixed 5 critical issues to improve ALIGN's routing, tone, and conversion flow.

---

## 🔧 Fixes Applied

### 1. ✅ **Classification Logic Updated**

**Problem**: "make bigger plan" was routing to Insight Engine instead of Action Engine.

**Solution**: Added action keywords to classifier:
- "plan", "bigger plan", "make bigger plan", "give me a bigger plan"
- "more plan", "bigger goals", "expand plan"
- "build a system", "help me take action"
- "help me structure my day", "help me improve"
- "full plan", "monthly plan", "system", "structure", "action", "steps", "improve"

**File**: `apps/web/src/lib/talkingLightClassifier.ts`

---

### 2. ✅ **Insight Engine Tone - Less Therapeutic**

**Problem**: Too repetitive with meditation cues like:
- "Let the breath move naturally"
- "Stay with the sensation..."
- "Notice where it sits in the body..."

**Solution**: 
- Removed repetitive phrases from prompt
- Added variation patterns:
  - "Look at the belief beneath that thought."
  - "Is this your voice, or someone else's?"
  - "What expectation collapses when you feel this way?"
  - "What truth are you avoiding right now?"
  - "What is this feeling protecting you from seeing?"
- Updated examples to show varied responses
- Made body references optional (not always required)

**File**: `apps/web/src/lib/talkingLightPrompt.ts`

---

### 3. ✅ **Upgrade Trigger for Plan Requests**

**Problem**: "make bigger plan" didn't trigger upgrade modal.

**Solution**: 
- Added specific plan keywords to upgrade trigger:
  - "make bigger plan", "bigger plan", "bigger system"
  - "full plan", "monthly plan", "routine"
- Triggers upgrade modal with 'custom-plan' variant
- Shows immediately after plan-related requests

**File**: `apps/web/app/page.tsx`

---

### 4. ✅ **Save Routine Button - Pro Lock**

**Problem**: "Save routine" button visible for free users (confusing).

**Solution**:
- Free users see: "Save routine 🔒" (locked, dimmed)
- Pro users see: "Save routine" (active)
- Clicking locked version triggers paywall

**File**: `apps/web/app/page.tsx`

---

### 5. ✅ **Action Choice After Insight**

**Problem**: After Insight responses, no clear path to Action.

**Solution**:
- Added "Yes, give me an action" button after Insight responses
- Creates flow: Insight → Action → Plan → Upgrade
- Button appears when `msg.engine === 'insight'`

**File**: `apps/web/app/page.tsx`

---

## 📋 Updated Flow

### Before:
1. User: "make bigger plan"
2. → Insight Engine (wrong!)
3. → No upgrade trigger

### After:
1. User: "make bigger plan"
2. → Action Engine (correct!)
3. → Upgrade modal appears (plan request detected)

### Insight → Action Flow:
1. User: "i feel dumb"
2. → Insight Engine response
3. → "Yes, give me an action" button appears
4. → User clicks → Action Engine response
5. → "Give me a practical plan" button
6. → Upgrade modal (if free user)

---

## 🎨 UI Changes

### Save Routine Button:
- **Free**: `bg-align-light/50 opacity-60` + 🔒 icon
- **Pro**: `bg-align-light` (normal)

### Action Choice Button:
- Appears after Insight responses
- Styled like other contextual buttons
- Text: "Yes, give me an action"

---

## ✅ Status

All 5 fixes have been implemented:
- ✅ Classification routes plan requests to Action
- ✅ Insight Engine has varied, less therapeutic tone
- ✅ Plan requests trigger upgrade modal
- ✅ Save routine locked for free users
- ✅ Action choice button after Insight responses

**ALIGN now has better routing, cleaner tone, and smoother conversion flow!** 🚀

