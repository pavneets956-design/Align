# 🚀 Quick Start: 3D UI

## Install & Run

```bash
# 1. Install dependencies
cd apps/mobile
npm install

# 2. Start backend (separate terminal)
cd ../web
npm run dev

# 3. Forward ports
adb reverse tcp:3000 tcp:3000
adb reverse tcp:8081 tcp:8081

# 4. Start Metro
cd ../mobile
npx react-native start --reset-cache

# 5. Build & Run (new terminal)
npx react-native run-android
```

## What You'll See

1. **Intro Screen** → Animated logo with opening sound
2. **3D Chat Environment** → Morphing "Mind Palace" background
3. **AI Entity** → Rotating, morphing geometric form at top
4. **3D Messages** → Floating cards with depth
5. **Interactive Chips** → Physics-like floating buttons
6. **Engine Transitions** → Smooth color/environment morphing when switching engines

## Test the Experience

- Send: `hi` → See Insight engine (purple/blue theme)
- Tap: "Give me a practical plan" → See Action engine transition (orange/red theme)
- Send: `hi make bigger plan` → See Plan engine + paywall portal (teal/green theme)

## Backend Unchanged ✅

All API calls work exactly as before - this is purely UI enhancement!

---

**Enjoy your premium 3D ALIGN experience!** 🎨✨

