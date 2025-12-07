import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ParticleLayer } from './ParticleLayer';
import { FloatingOrb } from './FloatingOrb';
import { colors } from '../theme/colors';
import { ChatMode } from '../types/chat';

const { width, height } = Dimensions.get('window');

interface Background3DProps {
  mode: ChatMode;
}

/**
 * Background3D - Layered background with gradients, particles, and floating orb
 * Creates depth and parallax effect
 */
export const Background3D: React.FC<Background3DProps> = ({ mode }) => {
  const gradientColors =
    mode === 'divine'
      ? [
          colors.background,
          '#0a0f1f',
          '#1a0f1f',
          colors.background,
        ]
      : [
          colors.background,
          '#0a0f1f',
          '#0a1529',
          colors.background,
        ];

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ParticleLayer />
      <FloatingOrb mode={mode} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
  },
});

