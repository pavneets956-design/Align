/**
 * ALIGN Engine Configuration
 * Centralized configuration for all three engines: Insight, Action, Plan
 */

export type EngineId = 'insight' | 'action' | 'plan';

export interface EngineConfig {
  id: EngineId;
  name: string;
  bubbleColor: string;
  gradient: string[];
  rolePrompt: string;
  description: string;
}

/**
 * Canonical engine colors from spec
 */
export const ENGINE_COLORS = {
  insight: {
    background: ['#1A0033', '#2D1B4E', '#4A2C6F'],
    bubble: '#3A0B79',
    text: '#FFFFFF',
  },
  action: {
    background: ['#FF4500', '#FF6B35', '#FFA500'],
    bubble: '#FF6B2C',
    text: '#FFFFFF',
  },
  plan: {
    background: ['#004D4D', '#008080', '#40E0D0'],
    bubble: '#2AA89A',
    text: '#FFFFFF',
  },
} as const;

