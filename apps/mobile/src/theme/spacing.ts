/**
 * Spacing scale for consistent layout
 * Based on 4px grid system
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export type SpacingSize = keyof typeof spacing;

