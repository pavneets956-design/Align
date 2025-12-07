/**
 * Floating Particles Around Orb
 * Creates "dust in light" effect with particles orbiting the AI entity
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Engine, getEngineTheme } from '../../theme/engineThemes';
import { useMotion } from '../../contexts/MotionContext';

interface OrbParticlesProps {
  engine: Engine;
}

const OrbParticles: React.FC<OrbParticlesProps> = ({ engine }) => {
  const theme = getEngineTheme(engine);
  const { reduceMotion } = useMotion();
  
  const particles = useMemo(() => {
    if (reduceMotion) return [];
    
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      anim: new Animated.Value(Math.random()),
      distance: 60 + Math.random() * 40,
      angle: (i / 8) * Math.PI * 2,
    }));
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || particles.length === 0) return;
    
    particles.forEach((particle) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(particle.anim, {
            toValue: 1,
            duration: 4000 + Math.random() * 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(particle.anim, {
            toValue: 0,
            duration: 4000 + Math.random() * 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();
    });
    
    return () => {
      particles.forEach((p) => p.anim.stopAnimation());
    };
  }, [particles, reduceMotion]);

  if (reduceMotion || particles.length === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((particle) => {
        const x = particle.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [
            Math.cos(particle.angle) * particle.distance * 0.8,
            Math.cos(particle.angle) * particle.distance,
          ],
        });
        const y = particle.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [
            Math.sin(particle.angle) * particle.distance * 0.8,
            Math.sin(particle.angle) * particle.distance,
          ],
        });
        const opacity = particle.anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.2, 0.6, 0.2],
        });

        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                opacity: opacity as any,
                transform: [{ translateX: x }, { translateY: y }],
                backgroundColor: theme.particleSecondary,
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
    width: 3,
    height: 3,
    borderRadius: 1.5,
    left: '50%',
    top: '50%',
    marginLeft: -1.5,
    marginTop: -1.5,
  },
});

export default OrbParticles;

