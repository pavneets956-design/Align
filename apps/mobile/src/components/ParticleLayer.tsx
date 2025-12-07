import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
}

/**
 * ParticleLayer - Slow-moving stars/particles for depth
 * Creates subtle parallax effect with floating particles
 */
export const ParticleLayer: React.FC = () => {
  const particles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.6 + 0.2,
    duration: Math.random() * 4000 + 3000,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <ParticleDot key={particle.id} particle={particle} />
      ))}
    </View>
  );
};

const ParticleDot: React.FC<{ particle: Particle }> = ({ particle }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(particle.opacity);

  useEffect(() => {
    // Slow vertical drift
    translateY.value = withRepeat(
      withTiming(
        -height * 0.3,
        {
          duration: particle.duration,
          easing: Easing.linear,
        }
      ),
      -1,
      false
    );

    // Subtle opacity pulse
    opacity.value = withRepeat(
      withTiming(
        particle.opacity * 0.5,
        {
          duration: particle.duration * 0.5,
          easing: Easing.inOut(Easing.ease),
        }
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    backgroundColor: colors.textSecondary,
    borderRadius: 50,
    shadowColor: colors.textSecondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

