/**
 * ALIGN - Main App Entry Point
 * React Native app implementing the Insight / Action / Plan engine system
 */

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Animated, Easing } from 'react-native';
import { SoundProvider } from './src/contexts/SoundContext';
import { MotionProvider } from './src/contexts/MotionContext';
import IntroScreen from './src/screens/IntroScreen';
import ChatScreen3D from './src/screens/ChatScreen3D';

/**
 * Main App Component
 * Handles intro → chat transition with animations
 */
const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const chatOpacity = React.useRef(new Animated.Value(0)).current;

  // TODO: Get user tier from auth/storage system
  const userTier: 'free' | 'pro' = 'free';

  const handleEnter = () => {
    setHasEntered(true);
    
    // Small delay to let intro animation finish, then fade in chat
    setTimeout(() => {
      setShowChat(true);
      Animated.timing(chatOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 100);
  };

  return (
    <SoundProvider>
      <MotionProvider>
        <SafeAreaView style={styles.container}>
          {!hasEntered ? (
            <IntroScreen onEnter={handleEnter} />
          ) : (
            <Animated.View
              style={[
                styles.chatContainer,
                {
                  opacity: chatOpacity,
                },
              ]}
            >
              <ChatScreen3D userTier={userTier} />
            </Animated.View>
          )}
        </SafeAreaView>
      </MotionProvider>
    </SoundProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050816',
  },
  chatContainer: {
    flex: 1,
  },
});

export default App;
