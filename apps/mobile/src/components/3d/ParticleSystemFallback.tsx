/**
 * Fallback Particle System (View-based, no native modules)
 * Use if react-native-svg linking fails
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View, Easing } from 'react-native';
import { Engine, getEngineTheme } from '../../theme/engineThemes';
import { useMotion } from '../../contexts/MotionContext';

interface ParticleSystemFallbackProps {
  engine: Engine;
}

const ParticleSystemFallback: React.FC<ParticleSystemFallbackProps> = ({ engine }) => {
  const theme = getEngineTheme(engine);
  const { reduceMotion } = useMotion();
  
  // Reduce particle count in reduce motion mode
  const particles = useMemo(() => {
    const baseCount = engine === 'action' ? 30 : engine === 'plan' ? 20 : 25;
    const count = reduceMotion ? Math.floor(baseCount * 0.3) : baseCount; // 30% particles in reduce motion
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: engine === 'action' ? Math.random() * 8 + 4 : Math.random() * 6 + 2,
      anim: new Animated.Value(Math.random()),
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }, [engine]);

  useEffect(() => {
    const animations = particles.map(particle => {
      // Slower, subtler animations in reduce motion mode
      const baseDuration = engine === 'action' 
        ? 2000 + Math.random() * 1000
        : engine === 'plan'
        ? 4000 + Math.random() * 2000
        : 6000 + Math.random() * 3000;
      const duration = reduceMotion ? baseDuration * 2 : baseDuration; // Slower in reduce motion

      return Animated.loop(
        Animated.sequence([
          Animated.timing(particle.anim, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false, // JS driver for consistency (particles use opacity which works, but keeping consistent)
          }),
          Animated.timing(particle.anim, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false, // JS driver for consistency (particles use opacity which works, but keeping consistent)
          }),
        ])
      );
    });

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, [engine, particles]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((particle, i) => {
        const opacity = particle.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.1, particle.opacity],
        });

        return (
          <Animated.View
            key={`particle-${i}`}
            style={[
              styles.particle,
              {
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                borderRadius: particle.size / 2,
                backgroundColor: theme.particleColor,
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
  },
});

export default ParticleSystemFallback;

