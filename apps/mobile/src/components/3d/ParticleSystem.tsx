/**
 * Particle System Component
 * Engine-specific particle effects for 3D depth
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Engine, getEngineTheme } from '../../theme/engineThemes';

interface ParticleSystemProps {
  engine: Engine;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ engine }) => {
  const theme = getEngineTheme(engine);
  const animationRef = useRef<Animated.Value[]>([]);

  // Generate particles based on engine type
  const particles = useMemo(() => {
    const count = engine === 'action' ? 60 : engine === 'plan' ? 40 : 50;
    
    return Array.from({ length: count }).map((_, i) => {
      const anim = new Animated.Value(Math.random());
      animationRef.current.push(anim);
      
      return {
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: engine === 'action' 
          ? Math.random() * 1.5 + 0.5  // Larger, faster for action
          : Math.random() * 1.2 + 0.3, // Smaller for insight/plan
        speed: engine === 'action'
          ? Math.random() * 0.02 + 0.01  // Fast movement
          : Math.random() * 0.008 + 0.003, // Slow, floating
        opacity: Math.random() * 0.6 + 0.2,
        anim,
      };
    });
  }, [engine]);

  // Animate particles based on engine behavior
  useEffect(() => {
    const animations = animationRef.current.map((anim, i) => {
      const particle = particles[i];
      
      if (engine === 'action') {
        // Fast, energetic movement
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 2000 + Math.random() * 1000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 2000 + Math.random() * 1000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ])
        );
      } else if (engine === 'plan') {
        // Organized, grid-like movement
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 4000 + Math.random() * 2000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 4000 + Math.random() * 2000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );
      } else {
        // Insight: Slow, contemplative floating
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 6000 + Math.random() * 3000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 6000 + Math.random() * 3000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );
      }
    });

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, [engine, particles]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {particles.map((particle, i) => {
          const opacity = particle.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, particle.opacity],
          });

          // Use regular Circle with theme color (no gradient to avoid native module issues)
          return (
            <Circle
              key={`particle-${i}`}
              cx={particle.x}
              cy={particle.y}
              r={particle.size}
              fill={theme.particleColor}
              opacity={opacity as any}
            />
          );
        })}
      </Svg>
    </View>
  );
};

export default ParticleSystem;

