/**
 * ALIGN Chat System Types
 * Defines the 3-engine system: Insight, Action, Plan
 */

export type Engine = 'insight' | 'action' | 'plan';

export type UserTier = 'free' | 'pro';

export interface Message {
  id: string;
  from: 'user' | 'bot';
  text: string;
  meta?: {
    engine?: Engine;
    timestamp?: number;
  };
}

export interface QuickChip {
  id: 'give_plan' | 'inner_block' | 'yes_action' | 'unlock_30_days' | 'save_routine';
  label: string;
}

export interface ChatResponse {
  replyText: string;
  engineUsed: Engine;
  suggestedChips: QuickChip[];
  showPaywall?: boolean;
}

export interface BackendResponse {
  reply?: string;
  lines?: string[];
  mode?: 'insight' | 'action';
  engineUsed?: Engine;
  suggestedChips?: QuickChip[];
  showPaywall?: boolean;
}

