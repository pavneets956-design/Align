# React Native App Crashes on Launch - Need Help

## Problem
My React Native app ("Talking Light") crashes immediately after opening on Android device. The app installs successfully but shows a blank screen and closes instantly when launched.

## Environment
- **React Native**: 0.74.3
- **React**: 18.2.0
- **TypeScript**: 5.3.3
- **Platform**: Android (Samsung device)
- **Build System**: Gradle 8.7
- **Android Gradle Plugin**: 8.6.0
- **compileSdkVersion**: 35
- **Node**: >=18

## Current App State
I've stripped the app down to the absolute minimum to isolate the issue:
- No navigation libraries
- No native modules (removed react-native-reanimated, react-native-linear-gradient, etc.)
- Minimal dependencies (only React and React Native core)
- Simple hardcoded UI with basic components

## Key Files

### App.tsx (Main Component)
```typescript
import React from 'react';
import { StatusBar, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const App: React.FC = () => {
  const [mode, setMode] = React.useState<'daily' | 'divine'>('daily');

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#050816" />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Talking Light</Text>
          <Text style={styles.tagline}>
            Calm guidance for your mind and soul.
          </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonDaily]}
              onPress={() => setMode('daily')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Enter Daily Life Mode</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonDivine]}
              onPress={() => setMode('divine')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Enter Divine Mode</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.modeText}>
            Current mode: {mode === 'daily' ? 'Daily Life' : 'Divine'}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050816',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 12,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 64,
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  button: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  buttonDaily: {
    backgroundColor: '#38bdf8',
  },
  buttonDivine: {
    backgroundColor: '#eab308',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#050816',
  },
  modeText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 24,
  },
});

export default App;
```

### index.js (Entry Point)
```javascript
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

### app.json
```json
{
  "name": "TalkingLight",
  "displayName": "Talking Light"
}
```

### MainActivity.kt
```kotlin
package com.talkinglight.app

import android.os.Build
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
  override fun getMainComponentName(): String = "TalkingLight"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(
          this,
          mainComponentName,
          fabricEnabled
      )

  override fun invokeDefaultOnBackPressed() {
    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
      if (!moveTaskToBack(false)) {
        super.invokeDefaultOnBackPressed()
      }
      return
    }
    super.invokeDefaultOnBackPressed()
  }
}
```

### package.json
```json
{
  "name": "talking-light-mobile",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.74.3"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@babel/preset-env": "^7.24.0",
    "@babel/runtime": "^7.28.4",
    "@react-native/babel-preset": "^0.74.87",
    "@react-native/eslint-config": "^0.74.87",
    "@react-native/metro-config": "^0.74.87",
    "@react-native/typescript-config": "^0.74.87",
    "@types/react": "^18.2.45",
    "@types/react-test-renderer": "^18.0.7",
    "babel-jest": "^29.7.0",
    "eslint": "^8.57.0",
    "jest": "^29.7.0",
    "prettier": "^3.2.5",
    "react-test-renderer": "18.2.0",
    "typescript": "^5.3.3"
  },
  "engines": {
    "node": ">=18"
  }
}
```

### metro.config.js
```javascript
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const defaultConfig = getDefaultConfig(projectRoot);

const config = {
  projectRoot,
  watchFolders: [projectRoot],
  resolver: {
    ...defaultConfig.resolver,
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

## Steps Already Taken
1. ✅ Verified ADB connection (device shows as "device")
2. ✅ Confirmed app installs successfully (`adb install` succeeds)
3. ✅ Removed all navigation libraries (@react-navigation/*)
4. ✅ Removed all animation libraries (react-native-reanimated, react-native-linear-gradient)
5. ✅ Removed all gesture handling libraries
6. ✅ Simplified App.tsx to bare minimum
7. ✅ Fixed MainActivity.kt to use bare React Native (removed Expo dependencies)
8. ✅ Updated Metro config with correct projectRoot
9. ✅ Set up ADB port forwarding (`adb reverse tcp:8081 tcp:8081`)
10. ✅ Cleared Metro bundler cache (`--reset-cache`)
11. ✅ Restarted Metro bundler multiple times

## Build Output
The app builds and installs successfully:
```
BUILD SUCCESSFUL in 45s
Installed on 1 device.
```

## Error Symptoms
- App opens and immediately closes (blank screen)
- No visible error messages on device
- Metro bundler shows bundle is served successfully
- ADB logs show app starts but no React Native JS errors visible

## Questions I Need Help With
1. Why is the app crashing even with minimal code?
2. Is there a mismatch between component name registration?
3. Could there be a Metro bundler configuration issue?
4. Are there Android-specific requirements I'm missing?
5. How can I get more detailed crash logs from React Native?

## What I Need
Please help me:
- Identify the root cause of the crash
- Provide a working solution to get the app running
- Suggest debugging steps to capture better error information
- Verify all configuration files are correct for React Native 0.74.3

## Additional Context
- Project is in a monorepo structure: `apps/mobile/`
- Metro bundler is running and serving bundles
- Device is connected via USB debugging
- No red screen of death appears (app closes before React Native UI renders)

Thank you for your help!

