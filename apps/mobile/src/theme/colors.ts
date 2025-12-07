/**
 * Color palette for Talking Light app
 * Dark theme with spiritual, calming aesthetics
 */

export const colors = {
  // Background colors
  background: '#050816', // Deep navy / space black
  backgroundSecondary: '#0a0f1f',
  backgroundTertiary: '#0f1729',

  // Card / Container colors
  card: 'rgba(15, 23, 42, 0.85)',
  cardBorder: 'rgba(148, 163, 184, 0.2)',
  cardGlow: 'rgba(148, 163, 184, 0.1)',

  // Daily Life Mode colors
  dailyPrimary: '#38bdf8', // Cyan
  dailySecondary: '#0ea5e9',
  dailyTertiary: '#0284c7',
  dailyGlow: 'rgba(56, 189, 248, 0.5)',
  dailyBackground: 'rgba(56, 189, 248, 0.1)',

  // Divine Mode colors
  divinePrimary: '#eab308', // Warm gold
  divineSecondary: '#fbbf24',
  divineTertiary: '#f59e0b',
  divineGlow: 'rgba(234, 179, 8, 0.5)',
  divineBackground: 'rgba(234, 179, 8, 0.1)',

  // Accent colors
  accentTeal: '#14b8a6',
  accentViolet: '#a78bfa',
  accentCyan: '#06b6d4',

  // Text colors
  textPrimary: '#e5e7eb',
  textSecondary: '#9ca3af',
  textTertiary: '#6b7280',
  textInverse: '#050816',

  // Border colors
  borderSoft: 'rgba(148, 163, 184, 0.4)',
  borderSubtle: 'rgba(148, 163, 184, 0.2)',

  // Glow colors
  glowBlue: 'rgba(56, 189, 248, 0.5)',
  glowGold: 'rgba(234, 179, 8, 0.5)',
  glowViolet: 'rgba(167, 139, 250, 0.4)',

  // Utility colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorName = keyof typeof colors;

