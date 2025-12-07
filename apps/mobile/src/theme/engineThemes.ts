/**
 * ALIGN Engine-Specific Theme Colors
 * Each engine (Insight, Action, Plan) has its own visual identity
 */

export type Engine = 'insight' | 'action' | 'plan';

export interface EngineTheme {
  // Primary gradient colors (for backgrounds)
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  
  // Accent colors
  primary: string;
  secondary: string;
  tertiary: string;
  
  // Glow/light effects
  glow: string;
  glowStrong: string;
  
  // Particle colors
  particleColor: string;
  particleSecondary: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  
  // UI element colors
  buttonPrimary: string;
  buttonGlow: string;
  chipBackground: string;
  chipBorder: string;
}

export const engineThemes: Record<Engine, EngineTheme> = {
  insight: {
    // Canonical: Deep purples, midnight blues, mystical
    // Background gradient: #1A0033 → #2D1B4E → #4A2C6F
    gradientStart: '#1A0033',
    gradientMid: '#2D1B4E',
    gradientEnd: '#4A2C6F',
    // Message bubble: #3A0B79
    primary: '#3A0B79', // Bubble color (canonical)
    secondary: '#6d28d9', // Accent
    tertiary: '#9333ea', // Highlight
    glow: 'rgba(58, 11, 121, 0.4)', // Purple glow
    glowStrong: 'rgba(58, 11, 121, 0.8)',
    particleColor: '#c084fc',
    particleSecondary: '#e9d5ff',
    textPrimary: '#FFFFFF', // High contrast white (canonical)
    textSecondary: '#e9d5ff',
    buttonPrimary: '#9333ea',
    buttonGlow: 'rgba(147, 51, 234, 0.6)',
    chipBackground: 'rgba(58, 11, 121, 0.15)',
    chipBorder: 'rgba(109, 40, 217, 0.4)',
  },
  action: {
    // Canonical: Electric oranges, coral reds, energetic
    // Background gradient: #FF4500 → #FF6B35 → #FFA500
    gradientStart: '#FF4500',
    gradientMid: '#FF6B35',
    gradientEnd: '#FFA500',
    // Message bubble: #FF6B2C
    primary: '#FF6B2C', // Bubble color (canonical)
    secondary: '#FF8C42',
    tertiary: '#FFA500',
    glow: 'rgba(255, 107, 44, 0.5)', // Orange glow
    glowStrong: 'rgba(255, 107, 44, 0.9)',
    particleColor: '#ffa500',
    particleSecondary: '#ffd700',
    textPrimary: '#FFFFFF', // High contrast white (canonical)
    textSecondary: '#fff5e6',
    buttonPrimary: '#FF6B35',
    buttonGlow: 'rgba(255, 107, 53, 0.7)',
    chipBackground: 'rgba(255, 107, 44, 0.15)',
    chipBorder: 'rgba(255, 140, 66, 0.5)',
  },
  plan: {
    // Canonical: Cool teals, forest greens, strategic
    // Background gradient: #004D4D → #008080 → #40E0D0
    gradientStart: '#004D4D',
    gradientMid: '#008080',
    gradientEnd: '#40E0D0',
    // Message bubble: #2AA89A
    primary: '#2AA89A', // Bubble color (canonical)
    secondary: '#00CED1',
    tertiary: '#40E0D0',
    glow: 'rgba(42, 168, 154, 0.4)', // Teal glow
    glowStrong: 'rgba(42, 168, 154, 0.8)',
    particleColor: '#66d9ef',
    particleSecondary: '#b0e0e6',
    textPrimary: '#FFFFFF', // High contrast white (canonical)
    textSecondary: '#e0f7fa',
    buttonPrimary: '#00CED1',
    buttonGlow: 'rgba(0, 206, 209, 0.6)',
    chipBackground: 'rgba(42, 168, 154, 0.15)',
    chipBorder: 'rgba(0, 206, 209, 0.4)',
  },
};

/**
 * Get theme for current engine (defaults to insight)
 */
export function getEngineTheme(engine?: Engine): EngineTheme {
  return engineThemes[engine || 'insight'];
}

