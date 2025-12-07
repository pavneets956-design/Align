/**
 * 3D Interactive Chip Component
 * Floating buttons with physics-like animations and 3D effects
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { QuickChip } from '../../types/align';
import { getEngineTheme } from '../../theme/engineThemes';
import { useMotion } from '../../contexts/MotionContext';

interface Chip3DProps {
  chip: QuickChip;
  engine?: 'insight' | 'action' | 'plan';
  onPress: () => void;
  isLocked?: boolean;
}

const Chip3D: React.FC<Chip3DProps> = ({ chip, engine = 'insight', onPress, isLocked = false }) => {
  const theme = getEngineTheme(engine);
  const { reduceMotion } = useMotion();
  
  const bobAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pressAnim = useRef(new Animated.Value(0)).current;
  const glowPulseAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  // Gentle floating/bobbing animation - skip in reduce motion
  useEffect(() => {
    if (reduceMotion) return;
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, {
          toValue: 1,
          duration: 2000 + Math.random() * 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false, // JS driver for stability
        }),
        Animated.timing(bobAnim, {
          toValue: 0,
          duration: 2000 + Math.random() * 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
    
    // Subtle glow pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulseAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowPulseAnim, {
          toValue: 0.3,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
    
    // Animated border (thin border that pulses)
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [reduceMotion]);

  const handlePressIn = () => {
    // Haptic feedback (if available)
    try {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Haptics not available - continue without
    }
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.92, // Slightly more pronounced press
        tension: 300,
        friction: 8,
        useNativeDriver: false, // JS driver for stability
      }),
      Animated.timing(pressAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: false, // JS driver for stability
      }),
      Animated.timing(pressAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start(() => {
      onPress();
    });
  };

  const translateY = bobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  const shadowOpacity = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });
  
  const glowOpacity = glowPulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });
  
  const borderOpacity = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  
  // Determine icon based on chip
  const getChipIcon = () => {
    if (chip.id === 'yes_action' || chip.id === 'give_plan') return '🎯';
    if (chip.id === 'unlock_30_days') return '✨';
    if (chip.id === 'save_routine') return '💾';
    return '';
  };

  return (
    <Animated.View
      style={[
        styles.chipContainer,
        {
          transform: [
            ...(reduceMotion ? [] : [{ translateY }]),
            { scale: scaleAnim },
          ],
          shadowOpacity: shadowOpacity as any,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={false}
      >
        <Animated.View
          style={[
            styles.chip,
            {
              backgroundColor: isLocked 
                ? 'rgba(148, 163, 184, 0.1)' 
                : theme.chipBackground,
              borderColor: isLocked 
                ? 'rgba(234, 179, 8, 0.5)' 
                : theme.chipBorder,
              borderWidth: isLocked ? 1.5 : borderOpacity.interpolate({
                inputRange: [0.5, 1],
                outputRange: [1.5, 2.5],
              }) as any,
              shadowColor: theme.primary,
              shadowOpacity: reduceMotion ? 0.4 : glowOpacity as any,
              shadowRadius: 12,
            },
          ]}
        >
          {!isLocked && (
            <LinearGradient
              colors={[theme.primary + '20', theme.secondary + '10']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}
          
          <Text
            style={[
              styles.chipText,
              {
                color: isLocked ? '#eab308' : theme.textPrimary,
              },
            ]}
          >
            {getChipIcon()} {chip.label}
          </Text>
          
          {/* Enhanced glow effect */}
          <Animated.View
            style={[
              styles.glow,
              {
                opacity: reduceMotion ? pressAnim : Animated.multiply(pressAnim, glowPulseAnim),
                backgroundColor: theme.glow,
              },
            ]}
          />
        </Animated.View>
          
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  chipContainer: {
    marginHorizontal: 6,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    position: 'relative',
    zIndex: 1,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
});

export default Chip3D;
