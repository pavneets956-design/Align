# Talking Light - Mobile App

A production-ready bare React Native app with a high-end, 3D UI for spiritual and emotional support.

## Features

- **Two Modes**: Daily Life (practical guidance) and Divine (spiritual guidance)
- **3D Effects**: Parallax backgrounds, floating orbs, particle layers
- **Glassmorphism**: Modern UI with depth and blur effects
- **Smooth Animations**: Powered by react-native-reanimated
- **TypeScript**: Fully typed codebase
- **Offline-Ready**: UI shell ready for backend integration

## Tech Stack

- React Native CLI (bare workflow)
- TypeScript
- React Navigation
- react-native-reanimated
- react-native-linear-gradient
- react-native-gesture-handler

## Prerequisites

- Node.js >= 18
- React Native development environment set up
  - For iOS: Xcode and CocoaPods
  - For Android: Android Studio and Android SDK

## Installation

1. Install dependencies:

```bash
npm install
```

2. For iOS, install CocoaPods:

```bash
cd ios && pod install && cd ..
```

## Running the App

### Android

```bash
npm run android
```

Or:

```bash
npx react-native run-android
```

### iOS

```bash
npm run ios
```

Or:

```bash
npx react-native run-ios
```

### Start Metro Bundler

```bash
npm start
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Background3D.tsx
│   ├── FloatingOrb.tsx
│   ├── Header.tsx
│   ├── InputBar.tsx
│   ├── MessageBubble.tsx
│   ├── ModeToggle.tsx
│   └── ParticleLayer.tsx
├── hooks/              # Custom React hooks
│   └── useChat.ts
├── navigation/         # Navigation setup
│   └── RootNavigator.tsx
├── screens/           # Screen components
│   ├── ChatScreen.tsx
│   ├── SettingsScreen.tsx
│   └── WelcomeScreen.tsx
├── theme/             # Design system
│   ├── colors.ts
│   ├── spacing.ts
│   └── typography.ts
├── types/             # TypeScript types
│   └── chat.ts
└── utils/             # Utility functions
    └── animationPresets.ts
```

## Architecture

- **Screens**: Main app screens (Welcome, Chat, Settings)
- **Components**: Reusable UI components with 3D effects
- **Hooks**: Business logic separated into custom hooks
- **Theme**: Centralized design system
- **Navigation**: React Navigation with TypeScript types

## Mock Backend

The app currently uses mock responses in `useChat.ts`. To integrate with your backend:

1. Update `useChat.ts` to make API calls
2. Replace mock responses with real API endpoints
3. Add error handling and loading states

## Customization

### Colors

Edit `src/theme/colors.ts` to customize the color palette.

### Animations

Adjust animation presets in `src/utils/animationPresets.ts`.

### Typography

Modify font styles in `src/theme/typography.ts`.

## Notes

- The app uses `react-native-linear-gradient` which requires native linking (auto-linked in RN 0.60+)
- `react-native-reanimated` requires the Babel plugin (already configured in `babel.config.js`)
- All animations are optimized for performance using native drivers

## Next Steps

1. Integrate with your backend API
2. Add authentication if needed
3. Implement real-time features
4. Add push notifications
5. Configure app icons and splash screens

## Troubleshooting

### Metro bundler issues

```bash
npm start -- --reset-cache
```

### iOS build issues

```bash
cd ios && pod install && cd ..
```

### Android build issues

```bash
cd android && ./gradlew clean && cd ..
```
