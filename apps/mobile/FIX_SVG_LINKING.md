# 🔧 Fix: react-native-svg Native Module Linking

## Problem
Error: `requireNativeComponent: "RNSVGLinearGradient" was not found in the UIManager.`

This means `react-native-svg` native module isn't linked properly.

## Solution Steps

### 1. Install react-native-svg locally (if not already)
```bash
cd apps/mobile
npm install react-native-svg --save
```

### 2. Clean and rebuild Android
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### 3. If still fails, verify autolinking

Check that `native_modules.gradle` is being applied in:
- `android/settings.gradle` ✅ (should have `applyNativeModulesSettingsGradle`)
- `android/app/build.gradle` ✅ (should have `applyNativeModulesAppBuildGradle`)

### 4. Alternative: Simplify ParticleSystem (if SVG still doesn't work)

If native linking still fails, we can replace SVG particles with View-based particles temporarily.

---

**After installing locally and rebuilding, the error should be resolved!**

