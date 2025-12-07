/**
 * 3D Environment Background
 * Creates "The Mind Palace" - morphing environment based on active engine
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Engine, getEngineTheme } from '../../theme/engineThemes';
import { useMotion } from '../../contexts/MotionContext';
// import ParticleSystem from './ParticleSystem'; // SVG version - disabled until native module links
import ParticleSystem from './ParticleSystemFallback'; // View-based fallback (no native modules)
import BackgroundStars from './BackgroundStars';

interface Environment3DProps {
  engine: Engine;
  children?: React.ReactNode;
}

const Environment3D: React.FC<Environment3DProps> = ({ engine, children }) => {
  const theme = getEngineTheme(engine);
  const { reduceMotion } = useMotion();
  // Using JS driver (useNativeDriver: false) for ALL animations to avoid mixed-driver crashes
  // Performance impact is minimal for these background animations
  const colorAnim = useRef(new Animated.Value(0)).current;
  const depthAnim = useRef(new Animated.Value(0)).current;

  // Animate environment depth effect - JS driver to avoid mixed-driver crashes
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(depthAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false, // JS driver for stability
        }),
        Animated.timing(depthAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false, // JS driver for stability
        }),
      ])
    ).start();
  }, [engine]);

  return (
    <View style={styles.container}>
      {/* Gradient Background with 3D depth */}
      <Animated.View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={[theme.gradientStart, theme.gradientMid, theme.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Radial gradient from center (orb position) outward */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: theme.primary + '10', // 10% opacity
              opacity: depthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.05, 0.15],
              }),
            },
          ]}
        />
        
        {/* Depth fog effect */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: theme.gradientEnd,
              opacity: depthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 0.3],
              }),
            },
          ]}
        />
      </Animated.View>
      
      {/* Background particle field (tiny slow-moving dots/stars) */}
      <BackgroundStars engine={engine} />

      {/* Particle System for this engine */}
      <ParticleSystem engine={engine} />

      {/* Engine-specific floating geometric platforms */}
      {engine === 'plan' && (
        // Plan: Grid-like structures (organized paths)
        <Animated.View
          style={[
            styles.platform,
            styles.gridPlatform,
            {
              opacity: depthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.05, 0.15],
              }),
              transform: [
                {
                  translateY: depthAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, -10],
                  }),
                },
              ],
            },
          ]}
        />
      )}
      {engine === 'action' && (
        // Action: Dynamic, energetic shapes
        <>
          <Animated.View
            style={[
              styles.platform,
              styles.actionPlatform1,
              {
                opacity: depthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.08, 0.2],
                }),
                transform: [
                  {
                    translateY: depthAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [15, -5],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.platform,
              styles.actionPlatform2,
              {
                opacity: depthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.05, 0.12],
                }),
                transform: [
                  {
                    translateY: depthAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [25, -15],
                    }),
                  },
                ],
              },
            ]}
          />
        </>
      )}
      {engine === 'insight' && (
        // Insight: Crystalline structures (subtle, contemplative)
        <Animated.View
          style={[
            styles.platform,
            styles.insightPlatform,
            {
              opacity: depthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.03, 0.1],
              }),
              transform: [
                {
                  translateY: depthAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, -10],
                  }),
                },
              ],
            },
          ]}
        />
      )}

      {/* Content overlay */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
  platform: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
  },
  // Plan: Grid-like structures
  gridPlatform: {
    bottom: '20%',
    left: '10%',
    width: 150,
    height: 150,
    borderRadius: 8, // More angular, grid-like
    borderWidth: 1.5,
  },
  // Action: Dynamic, energetic shapes
  actionPlatform1: {
    bottom: '25%',
    right: '15%',
    width: 120,
    height: 120,
    borderRadius: 12, // Sharp, angular
    borderWidth: 2,
  },
  actionPlatform2: {
    bottom: '15%',
    left: '20%',
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  // Insight: Crystalline structures
  insightPlatform: {
    bottom: '20%',
    left: '10%',
    width: 180,
    height: 180,
    borderRadius: 50, // More rounded, organic
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
});

export default Environment3D;

