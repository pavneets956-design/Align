# ALIGN Intro UI Implementation Notes

## 📁 Files Created/Modified

### Created:
- `apps/mobile/src/screens/IntroScreen.tsx` - Intro/splash screen with animations
- `apps/mobile/assets/sounds/` - Folder for sound files (create this if missing)

### Modified:
- `apps/mobile/App.tsx` - Added intro/chat screen transition logic
- `apps/mobile/package.json` - Added `react-native-sound` dependency

## 🎵 Adding the Opening Sound

1. **Create the Android raw resources folder** (if it doesn't exist):
   ```bash
   mkdir -p apps/mobile/android/app/src/main/res/raw
   ```

2. **Add your sound file:**
   - Place `open.mp3` in `apps/mobile/android/app/src/main/res/raw/open.mp3`
   - Recommended: Short (1-3 seconds), pleasant, low volume sound
   - Format: MP3, WAV, or M4A
   - **Important:** File name must be lowercase: `open.mp3` (not `Open.mp3`)

3. **The app will gracefully handle missing sounds** - if `open.mp3` is not found, it will simply skip the sound without crashing.

**Note:** For React Native, sound files need to be in the Android `res/raw/` folder to be bundled with the app. The `assets/sounds/` folder is not used for this.

## ⚙️ Configuration

### Android Audio Permissions

`react-native-sound` should auto-link, but if you encounter issues:

1. **Check `android/app/src/main/AndroidManifest.xml`:**
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   ```
   (This should already exist)

2. **No additional permissions needed** for local sound files in React Native.

### iOS (if testing iOS later)

For iOS, you may need to add to `Info.plist`:
```xml
<key>UIBackgroundModes</key>
<array>
  <string>audio</string>
</array>
```

## 🎨 Customization

### Animation Durations

Edit `apps/mobile/src/screens/IntroScreen.tsx`:

- **Logo animation duration:** Line ~70, change `duration: 1000` (milliseconds)
- **Fade in duration:** Line ~66, change `duration: 800`
- **Auto-transition delay:** Line ~93, change `3000` (milliseconds) to desired delay

### Colors

- **Background:** `#050816` (dark theme)
- **Logo glow:** `#38bdf8` (light blue)
- **Button:** `#38bdf8`
- **Text:** `#e5e7eb` (light gray)

### Sound Volume

Edit `apps/mobile/src/screens/IntroScreen.tsx`, line ~50:
```ts
openSound.setVolume(0.3); // 0.0 to 1.0 (30% volume)
```

## 🚀 Installation & Build Commands

### 1. Install Dependencies

```bash
cd C:\Users\gillp\CascadeProjects\talking-light\apps\mobile
npm install
```

This will install `react-native-sound` and link it automatically (RN 0.74 supports autolinking).

### 2. Start Metro Bundler

```bash
cd apps/mobile
npx react-native start --reset-cache
```

Keep this running.

### 3. Build & Run on Android

In a **new terminal**:

```bash
cd C:\Users\gillp\CascadeProjects\talking-light\apps\mobile
npx react-native run-android
```

### 4. With Backend (ADB Reverse)

Before running the app, ensure backend is running and ports are forwarded:

```bash
# Terminal 1: Backend
cd apps/web
npm run dev

# Terminal 2: Forward ports
adb reverse tcp:3000 tcp:3000
adb reverse tcp:8081 tcp:8081

# Terminal 3: Metro
cd apps/mobile
npx react-native start --reset-cache

# Terminal 4: Build & Run
cd apps/mobile
npx react-native run-android
```

## ✅ What to Expect

### On App Launch:

1. **Intro screen appears** with animated logo
2. **Opening sound plays** (if `open.mp3` exists)
3. Logo animates: scales up and rotates from 3D angle to front
4. After 3 seconds (or tap "Enter ALIGN"), transition to chat

### Transition:

- Intro fades out smoothly
- Chat screen fades in
- All ALIGN chat functionality works exactly as before

## 🐛 Troubleshooting

### Sound doesn't play

- Check `open.mp3` exists in `apps/mobile/assets/sounds/`
- Check Metro bundler logs for file loading errors
- App won't crash if sound is missing - it will just skip it
- Verify file format (MP3, WAV, or M4A)

### Animation not working

- Verify you're using React Native 0.74.3
- Check Metro bundler for any red errors
- Try clearing cache: `npx react-native start --reset-cache`

### Build fails

- Run `cd android && ./gradlew clean` then try again
- Ensure all dependencies installed: `npm install`
- Check `android/app/build.gradle` for any conflicts

### Chat doesn't appear after intro

- Check Metro logs for errors
- Verify `ChatScreen.tsx` is in correct location
- Check that `hasEntered` state is updating correctly

## 📝 Notes

- **No heavy dependencies** - Only uses React Native's built-in `Animated` API
- **Graceful fallbacks** - Missing sound file won't crash the app
- **Existing ALIGN logic untouched** - Chat functionality remains identical
- **Simple state management** - No navigation library needed

## 🎯 Next Steps (Optional)

- Add haptic feedback on button press
- Customize logo animation further
- Add more sound effects
- Persist "skip intro" preference using AsyncStorage

