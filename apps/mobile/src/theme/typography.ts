import { Platform } from 'react-native';

/**
 * Typography system
 * Uses system fonts for native feel
 */

const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'sans-serif',
  }) || 'System',
  medium: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
  }) || 'System',
  bold: Platform.select({
    ios: 'System',
    android: 'sans-serif',
  }) || 'System',
};

export const typography = {
  // Display / Hero text
  display: {
    fontFamily: fontFamily.bold,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.5,
    fontWeight: '700' as const,
  },

  // Large title
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.3,
    fontWeight: '700' as const,
  },

  // Section title
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.2,
    fontWeight: '600' as const,
  },

  // Subsection title
  h3: {
    fontFamily: fontFamily.medium,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.1,
    fontWeight: '600' as const,
  },

  // Body text
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },

  // Body large
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },

  // Small text
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '400' as const,
  },

  // Tiny text
  tiny: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    fontWeight: '400' as const,
  },
} as const;

export type TypographyVariant = keyof typeof typography;

