import { Easing } from 'react-native-reanimated';

/**
 * Reusable animation presets for consistent motion
 */

export const animationPresets = {
  // Smooth, calm easing
  smooth: {
    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    duration: 300,
  },

  // Gentle spring-like motion
  gentle: {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    duration: 400,
  },

  // Slow, meditative motion
  slow: {
    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    duration: 600,
  },

  // Quick, responsive motion
  quick: {
    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    duration: 200,
  },

  // Breathing animation (for orbs, glows)
  breathing: {
    easing: Easing.inOut(Easing.ease),
    duration: 3000,
  },
} as const;

