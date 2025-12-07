# Android USB Debugging Guide

## Prerequisites

1. Enable **Developer Options** on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Developer Options will appear in Settings

2. Enable **USB Debugging**:
   - Settings → Developer Options → USB Debugging (toggle ON)

3. Connect device via USB cable

## Verify Connection

```bash
adb devices
```

You should see your device listed. If it shows "unauthorized":
- Check your phone for an RSA fingerprint prompt
- Tap "Allow" or "Always allow from this computer"

## Install App via USB

### Option 1: Expo Run (Recommended)

```bash
cd apps/mobile
npx expo run:android
```

This builds and installs the app directly to your connected device.

### Option 2: Build APK then Install

```bash
# Build APK
cd apps/mobile
eas build -p android --profile preview

# After build completes, download APK and install:
adb install -r path/to/app-debug.apk
```

Or if using EAS:

```bash
eas build -p android --profile preview --local
# Then install the APK from the build output
```

## Troubleshooting

### Multiple Devices

If you have multiple devices/emulators connected:

```bash
# List devices
adb devices

# Install to specific device
adb -s <device-serial> install -r app-debug.apk
```

### Build Failures

If the build fails:

```bash
cd apps/mobile/android
./gradlew clean
cd ..
npx expo run:android
```

### Permission Errors

If you get permission errors:

```bash
# On Linux/Mac, you may need to add udev rules
# On Windows, ensure USB drivers are installed
```

### Device Not Found

- Disconnect and reconnect USB cable
- Try a different USB port
- Toggle USB Debugging off/on
- Restart adb: `adb kill-server && adb start-server`

## Samsung-Specific Notes

Samsung devices may require additional steps:

1. Install **Samsung USB Drivers** from Samsung's website
2. Enable **USB Configuration** → Select "File Transfer" or "MTP"
3. Some Samsung devices may require **"Allow USB debugging"** prompt to be checked

## Quick Install Command

Once device is connected and authorized:

```bash
cd apps/mobile && npx expo run:android
```

This is the simplest way to install on a connected Android device.

