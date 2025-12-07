# ALIGN Mobile App - Quick Start

## 🚀 Complete Setup & Run Commands

### Prerequisites
- Backend running on `http://localhost:3000` (see `apps/web`)
- Android device connected via USB with debugging enabled

### Step 1: Install Dependencies

```bash
cd C:\Users\gillp\CascadeProjects\talking-light\apps\mobile
npm install
```

### Step 2: Add Opening Sound (Optional)

```bash
# Create the raw resources folder
mkdir apps\mobile\android\app\src\main\res\raw

# Place your sound file there:
# Copy open.mp3 to: apps\mobile\android\app\src\main\res\raw\open.mp3
```

**Note:** The app works fine without the sound file - it will just skip playing it.

### Step 3: Forward Ports (Real Device)

```bash
adb reverse tcp:3000 tcp:3000
adb reverse tcp:8081 tcp:8081

# Verify:
adb reverse --list
```

### Step 4: Start Metro Bundler

```bash
cd apps\mobile
npx react-native start --reset-cache
```

Keep this terminal running.

### Step 5: Build & Run on Device

**New terminal:**

```bash
cd C:\Users\gillp\CascadeProjects\talking-light\apps\mobile
npx react-native run-android
```

### Step 6: Test

1. **App should show animated intro** with logo
2. **Sound plays** (if open.mp3 is present)
3. **After 3 seconds or tap "Enter ALIGN"** → transitions to chat
4. **Send "hi"** → Should get real AI response from backend

## ✅ Success Indicators

- ✅ Intro screen appears with animated logo
- ✅ Smooth transition to chat
- ✅ Chat functionality works (same as before)
- ✅ Backend API calls work (real responses, not fallback)

## 🐛 Quick Fixes

### Build fails
```bash
cd android
.\gradlew clean
cd ..
npx react-native run-android
```

### Sound doesn't play
- Check file is in `android/app/src/main/res/raw/open.mp3`
- File name must be lowercase
- App won't crash if missing - it's optional

### Backend connection fails
- Verify backend is running: `http://localhost:3000`
- Re-run: `adb reverse tcp:3000 tcp:3000`
- Check Metro logs for connection errors

## 📱 What You'll See

1. **Intro Screen:**
   - Dark background (#050816)
   - Animated glowing logo
   - "ALIGN" title
   - "Talking Light for your mind + soul" subtitle
   - "Enter ALIGN" button

2. **Transition:**
   - Smooth fade out of intro
   - Smooth fade in of chat

3. **Chat Screen:**
   - Same ALIGN chat interface as before
   - All backend functionality intact

