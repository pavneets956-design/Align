# ALIGN 3D UI Implementation Notes

## Overview

The ALIGN mobile app features a premium 3D "Mind Palace" experience that morphs based on the active engine (Insight, Action, Plan). This document explains the architecture, animations, and how to modify the 3D components.

## Core Architecture

### Context Providers

**`src/contexts/SoundContext.tsx`**
- Global sound toggle (`soundEnabled`)
- `playSound()` function for consistent audio playback
- Handles missing sound files gracefully

**`src/contexts/MotionContext.tsx`**
- Respects system "Reduce Motion" preference (iOS)
- `reduceMotion` boolean for accessibility
- All 3D components check this to simplify animations

### Engine Themes

**`src/theme/engineThemes.ts`**
- Three complete color themes (Insight, Action, Plan)
- Each includes: gradients, colors, glows, particle colors, text colors
- Used throughout 3D components for consistent theming

## 3D Components

### 1. Environment3D (`src/components/3d/Environment3D.tsx`)

**Purpose:** Creates the morphing "Mind Palace" background

**Features:**
- Engine-specific gradient backgrounds
- Depth fog animation
- Engine-specific geometric platforms:
  - **Insight**: Rounded, crystalline structures
  - **Action**: Angular, dynamic shapes (multiple platforms)
  - **Plan**: Grid-like, organized structures
- Particle system overlay

**Animations:**
- `depthAnim`: Controls fog opacity and platform translation
- Uses `useNativeDriver: false` (JS driver) for consistency
- Respects `reduceMotion` - skips or slows animations

### 2. AIEntity3D (`src/components/3d/AIEntity3D.tsx`)

**Purpose:** The morphing geometric avatar representing ALIGN

**States:**
- **Idle**: Gentle rotation (disabled in reduce motion)
- **Listening**: Breathing scale animation
- **Speaking**: Pulsing with glow intensity changes
- **Engine Switch**: Shape morphing (via borderRadius + scale)

**Engine Morphing:**
- **Insight**: High border radius (50) - rounded, fractal-like
- **Action**: Low border radius (8) - sharp, angular
- **Plan**: Very low border radius (4) - modular, cube-like

**Animations:**
- All use `useNativeDriver: false` for stability
- `rotateAnim`, `scaleAnim`, `pulseAnim`, `glowAnim`, `morphAnim`

### 3. ParticleSystemFallback (`src/components/3d/ParticleSystemFallback.tsx`)

**Purpose:** View-based particle effects (fallback when SVG unavailable)

**Engine-Specific Behavior:**
- **Insight**: 25 particles, slow floating (6-9s duration)
- **Action**: 30 particles, fast movement (2-3s duration) 
- **Plan**: 20 particles, organized (4-6s duration)

**Reduce Motion:**
- Particle count reduced to 30%
- Animation durations doubled (slower, subtler)

### 4. MessageBubble3D (`src/components/3d/MessageBubble3D.tsx`)

**Purpose:** 3D floating message cards

**Features:**
- User messages: Gradient bubbles
- Bot messages: Glassmorphism cards with engine-colored accent bars
- Fly-in animations from sides
- Subtle floating/bobbing (disabled in reduce motion)
- 3D perspective transforms (disabled in reduce motion)

### 5. Chip3D (`src/components/3d/Chip3D.tsx`)

**Purpose:** Interactive 3D action buttons

**Features:**
- Gentle floating animation (disabled in reduce motion)
- Press animation with glow effect
- Engine-themed colors
- Lock state for Pro features

### 6. PaywallPortal3D (`src/components/3d/PaywallPortal3D.tsx`)

**Purpose:** Premium "Unlock Portal" modal

**Features:**
- Portal materialization animation
- Lock mechanism that disengages
- Pulsing glow effect
- Plan theme (teal/silver)
- Sound effect on open

## Animation Strategy

### Driver Consistency

**Critical Rule:** Each `Animated.Value` must use the SAME `useNativeDriver` setting for ALL animations.

**Current Choice:** `useNativeDriver: false` (JS driver) for all 3D animations

**Why:**
- Avoids mixed-driver crashes
- `borderRadius` requires JS driver (used in AIEntity3D morphing)
- Shadow properties require JS driver (used in PaywallPortal3D)
- Performance impact is minimal for these intro/background animations

### Reduce Motion Support

All components check `useMotion()` hook:
- Skips or simplifies animations
- Reduces particle counts
- Faster transitions
- Removes 3D transforms where possible

## Sound System

**Files:**
- Place sound files in `android/app/src/main/res/raw/`:
  - `open.mp3` - App opening sound
  - `transition.mp3` - Engine transition sound (optional, falls back to open.mp3)

**Usage:**
```tsx
import { useSound } from '../contexts/SoundContext';

const { playSound } = useSound();
playSound('open'); // Plays opening sound
playSound('engine_transition'); // Plays transition sound
```

**Global Toggle:**
- Sound can be toggled via `SoundContext`
- Future: Add UI toggle button

## Engine Transitions

**Flow:**
1. User message triggers engine change
2. `ChatScreen3D` detects engine change
3. Plays transition sound (if enabled)
4. `useEngineTransition` hook manages 3-second transition
5. `Environment3D` morphs background colors
6. `AIEntity3D` morphs shape
7. Particles change behavior

## Customization Guide

### Modify Engine Colors

Edit `src/theme/engineThemes.ts`:
```ts
export const engineThemes: Record<Engine, EngineTheme> = {
  insight: {
    gradientStart: '#1a0033', // Change these
    // ...
  },
};
```

### Adjust Animation Speeds

**AIEntity3D:**
```ts
// In idle rotation:
duration: 20000, // Change to adjust rotation speed
```

**Environment3D:**
```ts
// In depth animation:
duration: 4000, // Change to adjust fog/platform speed
```

### Modify Particle Counts

Edit `ParticleSystemFallback.tsx`:
```ts
const baseCount = engine === 'action' ? 30 : // Adjust here
```

### Change Intro Duration

Edit `IntroScreen.tsx`:
```ts
setTimeout(() => {
  handleEnter();
}, 3000); // Change timeout duration
```

## Performance Considerations

- **Particles**: Limited to 30 max (Action engine)
- **Animations**: All use JS driver (safe, consistent)
- **Reduce Motion**: Automatically simplifies for accessibility
- **No heavy 3D libraries**: Pure React Native Animated API

## Troubleshooting

### Animation Crashes
- Ensure ALL animations on same `Animated.Value` use same driver
- Check for mixed `useNativeDriver: true` and `false` on same value

### Particles Not Showing
- Verify `ParticleSystemFallback` is imported (not SVG version)
- Check `reduceMotion` state (reduces particle count)

### Sounds Not Playing
- Verify sound files exist in `android/app/src/main/res/raw/`
- Check `soundEnabled` in SoundContext
- App won't crash if sounds are missing (graceful fallback)

### Performance Issues
- Enable reduce motion mode
- Reduce particle counts in `ParticleSystemFallback`
- Simplify AIEntity3D animations

## File Structure

```
apps/mobile/src/
├── contexts/
│   ├── SoundContext.tsx      # Sound toggle & playback
│   └── MotionContext.tsx     # Reduce motion preference
├── components/3d/
│   ├── AIEntity3D.tsx        # Morphing AI avatar
│   ├── Environment3D.tsx     # Background "Mind Palace"
│   ├── ParticleSystemFallback.tsx  # View-based particles
│   ├── MessageBubble3D.tsx   # 3D message cards
│   ├── Chip3D.tsx            # Interactive action buttons
│   └── PaywallPortal3D.tsx   # Premium unlock portal
├── screens/
│   ├── IntroScreen.tsx       # Opening intro
│   └── ChatScreen3D.tsx      # Main 3D chat interface
├── theme/
│   └── engineThemes.ts       # Engine color themes
└── hooks/
    └── useEngineTransition.ts # Engine transition logic
```

## Next Steps (Future Enhancements)

1. Add sound toggle UI button
2. Add haptic feedback on chip press (React Native Haptics)
3. Implement device tilt response (gyroscope)
4. Add AR export functionality
5. Theme customization UI

---

**All animations use JS driver for stability. No mixed-driver issues!** ✅

