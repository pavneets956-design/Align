/**
 * ALIGN IntroScreen
 * Animated splash/intro experience before entering chat
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { useSound } from '../contexts/SoundContext';
import { useMotion } from '../contexts/MotionContext';

interface IntroScreenProps {
  onEnter: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateYAnim = useRef(new Animated.Value(-25)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const { playSound } = useSound();
  const { reduceMotion } = useMotion();

  // Play opening sound on mount
  useEffect(() => {
    playSound('open');
  }, []);

  // Animate logo on mount - faster/simpler in reduce motion
  useEffect(() => {
    const duration = reduceMotion ? 400 : 800;
    const rotateDuration = reduceMotion ? 500 : 1000;
    
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false, // JS driver for consistency
      }),
      // Scale and rotate logo (skip rotation in reduce motion)
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: rotateDuration,
        easing: reduceMotion ? Easing.out(Easing.ease) : Easing.out(Easing.back(1.2)),
        useNativeDriver: false,
      }),
      ...(reduceMotion ? [] : [
        Animated.timing(rotateYAnim, {
          toValue: 0,
          duration: rotateDuration,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [reduceMotion]);

  // Auto-transition after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleEnter();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    // Animate out before transitioning - faster in reduce motion
    const duration = reduceMotion ? 200 : 400;
    
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false, // JS driver for consistency
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start(() => {
      onEnter();
    });
  };

  const rotateY = reduceMotion ? '0deg' : rotateYAnim.interpolate({
    inputRange: [-25, 0],
    outputRange: ['-25deg', '0deg'],
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#050816" />
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Logo with 3D-style animation */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  { perspective: 1000 },
                  { rotateY: rotateY },
                ],
              },
            ]}
          >
            {/* Glowing circle with inner light effect */}
            <View style={styles.logoOuter}>
              <View style={styles.logoInner} />
              <View style={styles.logoCore} />
            </View>
          </Animated.View>

          {/* App Name */}
          <Text style={styles.appName}>ALIGN</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Talking Light for your mind + soul
          </Text>

          {/* Enter Button */}
          <TouchableOpacity
            style={styles.enterButton}
            onPress={handleEnter}
            activeOpacity={0.8}
          >
            <Text style={styles.enterButtonText}>Enter ALIGN</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050816',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: 48,
  },
  logoOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(56, 189, 248, 0.15)', // Light blue glow
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(56, 189, 248, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCore: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#38bdf8',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },
  appName: {
    fontSize: 48,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 12,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 64,
    lineHeight: 24,
  },
  enterButton: {
    backgroundColor: '#38bdf8',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  enterButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#050816',
  },
});

export default IntroScreen;

