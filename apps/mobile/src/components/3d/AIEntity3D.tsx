/**
 * 3D AI Entity Component
 * Abstract geometric form representing ALIGN that morphs based on state
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Engine, getEngineTheme } from '../../theme/engineThemes';
import { useMotion } from '../../contexts/MotionContext';
import OrbParticles from './OrbParticles';

interface AIEntity3DProps {
  engine: Engine;
  isSpeaking?: boolean;
  isListening?: boolean;
}

const AIEntity3D: React.FC<AIEntity3DProps> = ({ 
  engine, 
  isSpeaking = false,
  isListening = false,
}) => {
  const theme = getEngineTheme(engine);
  const { reduceMotion } = useMotion();
  
  // Animation values
  // Using JS driver (useNativeDriver: false) for ALL animations to avoid mixed-driver crashes
  // Performance impact is minimal for these intro/3D animations
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const morphAnim = useRef(new Animated.Value(0)).current;

  // Idle rotation animation - JS driver to avoid mixed-driver crashes
  // Skip or slow down in reduce motion
  useEffect(() => {
    if (reduceMotion) return; // No rotation in reduce motion
    
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: false, // JS driver for stability
      })
    ).start();
  }, [reduceMotion]);

  // Speaking: Pulsate and emit particles - JS driver to avoid mixed-driver crashes
  useEffect(() => {
    if (isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false, // JS driver for stability
            }),
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false, // JS driver for stability
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false, // JS driver for stability
            }),
            Animated.timing(glowAnim, {
              toValue: 0.5,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false, // JS driver for stability
            }),
          ]),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0.5);
    }
  }, [isSpeaking]);

  // Idle breathing animation - gentle pulsing when idle (not speaking/listening)
  useEffect(() => {
    if (!isSpeaking && !isListening) {
      // Gentle breathing: pulse from 1.0 to 1.02 over 3 seconds
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.02,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false, // JS driver for stability
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.0,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false, // JS driver for stability
          }),
        ])
      ).start();
    }
  }, [isSpeaking, isListening]);

  // Listening: Breathing animation - JS driver to avoid mixed-driver crashes
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false, // JS driver for stability
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false, // JS driver for stability
          }),
        ])
      ).start();
    }
  }, [isListening]);

  // Engine morph animation - JS driver to avoid mixed-driver crashes (borderRadius requires JS driver)
  useEffect(() => {
    Animated.timing(morphAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false, // JS driver required for borderRadius
    }).start();
  }, [engine]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Morph shape based on engine
  // Insight: Rounded/complex (fractal-like) - higher border radius
  // Action: Sharp/angular - lower border radius  
  // Plan: Modular/structured - very low border radius
  const borderRadius = morphAnim.interpolate({
    inputRange: [0, 1],
    outputRange: 
      engine === 'action' ? [30, 8]      // Sharp, angular
      : engine === 'plan' ? [30, 4]      // Modular, cube-like
      : [30, 50],                        // Insight: Rounded, fractal-like
  });
  
  // Additional scale variation for engine morphing
  const entityScale = morphAnim.interpolate({
    inputRange: [0, 1],
    outputRange: 
      engine === 'action' ? [1, 1.05]    // Slightly larger, more aggressive
      : engine === 'plan' ? [1, 0.95]    // Slightly smaller, more structured
      : [1, 1],                          // Insight: Normal size
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <View style={styles.container}>
      {/* Outer glow ring with enhanced bloom effect */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            opacity: glowOpacity,
            transform: [{ scale: pulseAnim }],
            borderColor: theme.glow,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: glowOpacity.interpolate({
              inputRange: [0.4, 1],
              outputRange: [0.6, 1],
            }) as any,
            shadowRadius: 30,
            elevation: 20,
          },
        ]}
      />
      {/* Additional bloom layers for depth */}
      <Animated.View
        style={[
          styles.glowRing,
          styles.bloomLayer1,
          {
            opacity: glowOpacity.interpolate({
              inputRange: [0.4, 1],
              outputRange: [0.2, 0.4],
            }) as any,
            transform: [{ scale: Animated.multiply(pulseAnim, 1.2) }],
            borderColor: theme.glowStrong,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.glowRing,
          styles.bloomLayer2,
          {
            opacity: glowOpacity.interpolate({
              inputRange: [0.4, 1],
              outputRange: [0.1, 0.2],
            }) as any,
            transform: [{ scale: Animated.multiply(pulseAnim, 1.4) }],
            borderColor: theme.secondary,
          },
        ]}
      />
      
      {/* Floating particles around orb (dust in light effect) */}
      <OrbParticles engine={engine} />
      
      {/* Main entity - morphing shape */}
      <Animated.View
        style={[
          styles.entity,
          {
            transform: [
              { rotate: rotation },
              { scale: Animated.multiply(Animated.multiply(scaleAnim, pulseAnim), entityScale) },
            ],
            borderRadius: borderRadius as any,
          },
        ]}
      >
        <LinearGradient
          colors={[theme.primary, theme.secondary, theme.tertiary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Inner core */}
        <Animated.View
          style={[
            styles.core,
            {
              opacity: glowAnim,
              backgroundColor: theme.glowStrong,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
  },
  bloomLayer1: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1.5,
  },
  bloomLayer2: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
  },
  entity: {
    width: 100,
    height: 100,
    overflow: 'hidden',
  },
  core: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: 'center',
    top: '50%',
    marginTop: -20,
  },
});

export default AIEntity3D;

