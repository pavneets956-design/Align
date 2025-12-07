/**
 * 3D Message Bubble Component
 * Floating cards with depth, parallax, and 3D transforms
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Message } from '../../types/align';
import { getEngineTheme } from '../../theme/engineThemes';
import { useMotion } from '../../contexts/MotionContext';

interface MessageBubble3DProps {
  message: Message;
  index: number;
}

const MessageBubble3D: React.FC<MessageBubble3DProps> = ({ message, index }) => {
  const isUser = message.from === 'user';
  const theme = message.meta?.engine 
    ? getEngineTheme(message.meta.engine)
    : getEngineTheme('insight');
  const { reduceMotion } = useMotion();
  
  const enterAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const depthAnim = useRef(new Animated.Value(index * 0.05)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const accentGlowAnim = useRef(new Animated.Value(0.5)).current;

  // Enter animation: slide in with bounce - JS driver for consistency
  useEffect(() => {
    // Slide up + fade in with slight bounce
    Animated.parallel([
      Animated.spring(enterAnim, {
        toValue: 1,
        tension: reduceMotion ? 100 : 40, // Softer spring for bounce effect
        friction: reduceMotion ? 5 : 6,
        useNativeDriver: false, // JS driver for stability
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: reduceMotion ? 200 : 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
    
    // Create opacity anim if not exists
    if (!opacityAnim) {
      // Will be handled by parallel above
    }
    
    // Skip floating animation in reduce motion
    if (!reduceMotion) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();
      
      // Accent bar glow pulse for bot messages
      if (!isUser) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(accentGlowAnim, {
              toValue: 1,
              duration: 2000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(accentGlowAnim, {
              toValue: 0.3,
              duration: 2000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ])
        ).start();
      }
    }
  }, [reduceMotion, isUser]);

  const translateX = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: isUser ? [200, 0] : [-200, 0],
  });

  const translateYFromSide = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10], // Slide up slightly on entrance
  });

  const translateYFloat = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-3, 3],
  });

  // 3D perspective transform
  const rotateY = depthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: isUser ? ['-5deg', '0deg'] : ['5deg', '0deg'],
  });

  const opacity = opacityAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const scale = enterAnim.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0.85, 1.05, 1], // Slight bounce overshoot
  });
  
  const accentGlowOpacity = accentGlowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.9],
  });

  if (isUser) {
    // User messages: gradient bubble
    return (
      <Animated.View
          style={[
            styles.userBubble,
            {
              opacity,
              transform: [
                { translateX },
                { translateY: reduceMotion ? translateYFromSide : Animated.add(translateYFromSide, translateYFloat) },
                { scale },
                { perspective: 1000 },
                ...(reduceMotion ? [] : [{ rotateY }]),
              ],
              shadowColor: '#38bdf8',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
            },
          ]}
      >
        <LinearGradient
          colors={['#38bdf8', '#0ea5e9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBubble}
        >
          <Text style={styles.userText}>{message.text}</Text>
        </LinearGradient>
      </Animated.View>
    );
  }

  // Bot messages: glassmorphism card with engine theme
  return (
    <Animated.View
          style={[
            styles.botBubble,
            {
              opacity,
              transform: [
                { translateX },
                { translateY: reduceMotion ? translateYFromSide : Animated.add(translateYFromSide, translateYFloat) },
                { scale },
                { perspective: 1000 },
                ...(reduceMotion ? [] : [{ rotateY }]),
              ],
            },
          ]}
    >
      <View
          style={[
            styles.glassCard,
            {
              // Use canonical bubble color as background
              backgroundColor: theme.primary + 'E6', // ~90% opacity
              borderColor: theme.chipBorder,
              shadowColor: theme.glow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
            },
          ]}
        >
        {/* Left accent bar with pulsing glow */}
        <Animated.View
          style={[
            styles.accentBar,
            {
              backgroundColor: theme.primary,
              opacity: reduceMotion ? 1 : accentGlowOpacity,
              shadowColor: theme.primary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: reduceMotion ? 0 : accentGlowOpacity.interpolate({
                inputRange: [0.4, 0.9],
                outputRange: [0.5, 1],
              }) as any,
              shadowRadius: 8,
            },
          ]}
        />
        
        <Text style={[styles.botText, { color: theme.textPrimary }]}>
          {message.text}
        </Text>
        
        {/* Engine label removed - keep internal type for styling but don't show to user */}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginVertical: 8,
  },
  gradientBubble: {
    padding: 16,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  userText: {
    color: '#050816',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  botBubble: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    marginVertical: 8,
  },
  glassCard: {
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    padding: 16,
    paddingLeft: 24,
    overflow: 'hidden', // For backdrop blur effect
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 4,
  },
  botText: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default MessageBubble3D;
