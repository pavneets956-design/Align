/**
 * ALIGN Message Classifier
 * Routes messages to appropriate engine (Insight, Action, Plan)
 */

export type Engine = 'insight' | 'action' | 'plan';

/**
 * Classify message to determine which engine to use
 * Hard keyword rules override everything else
 */
export function classifyMessage(
  text: string,
  explicitEngine?: Engine
): { engine: Engine; reason: string } {
  const lower = text.toLowerCase().trim();

  // Explicit engine override (from chip clicks) - highest priority
  if (explicitEngine) {
    return { engine: explicitEngine, reason: 'explicit_request' };
  }

  // PLAN ENGINE - Hard keyword rules (always override)
  const planKeywords = [
    'plan', 'bigger plan', 'full plan', 'practical plan', 'give me a plan',
    'roadmap', 'step by step', 'blueprint', 'monthly plan', 'weekly plan',
    'routine', 'system'
  ];
  // Check for "build a system", "create a system", etc.
  const planMatches = planKeywords.some(keyword => lower.includes(keyword));
  const systemPattern = /(build|create|make|design)\s+a\s+system/i.test(text);
  
  if (planMatches || systemPattern) {
    return { engine: 'plan', reason: 'plan_keyword_match' };
  }

  // ACTION ENGINE - Hard keyword rules (override Insight)
  const actionKeywords = [
    'action', 'give me an action', 'what should i do now', 'next step',
    'what\'s one thing i can do', 'tell me what to do', 'practical step',
    'task', 'give me a practical', 'do something'
  ];
  const actionMatches = actionKeywords.some(keyword => lower.includes(keyword));
  
  if (actionMatches) {
    return { engine: 'action', reason: 'action_keyword_match' };
  }

  // INSIGHT ENGINE - Default for emotional states and inner blocks
  const insightKeywords = [
    'feel', 'i feel', 'i\'m', 'i am', 'anxious', 'stuck', 'lost',
    'dumb', 'stupid', 'angry', 'sad', 'confused', 'frustrated',
    'inner block', 'mindset', 'fear', 'resistance', 'identity',
    'belief', 'judgment', 'why am i', 'who am i', 'block'
  ];
  const insightMatches = insightKeywords.some(keyword => lower.includes(keyword));
  
  if (insightMatches) {
    return { engine: 'insight', reason: 'emotional_identity_keyword' };
  }

  // Default: Insight for generic "hi", "hello", etc.
  return { engine: 'insight', reason: 'default_greeting' };
}

/**
 * Generate suggested chips based on engine and context
 */
export function generateChips(
  engine: Engine,
  userTier: 'free' | 'pro',
  showPaywall?: boolean
): Array<{ id: string; label: string }> {
  const chips: Array<{ id: string; label: string }> = [];

  switch (engine) {
    case 'insight':
      chips.push({ id: 'yes_action', label: 'Yes, give me an action' });
      chips.push({ id: 'give_plan', label: 'Give me a practical plan' });
      break;

    case 'action':
      chips.push({ id: 'inner_block', label: 'Help me understand the inner block' });
      if (userTier === 'pro') {
        chips.push({ id: 'save_routine', label: 'Save routine' });
      } else {
        chips.push({ id: 'save_routine', label: 'Save routine 🔒' });
      }
      break;

    case 'plan':
      if (showPaywall || userTier === 'free') {
        chips.push({ id: 'unlock_30_days', label: 'Unlock your full 30-day plan' });
      }
      chips.push({ id: 'inner_block', label: 'Help me understand the inner block' });
      if (userTier === 'pro') {
        chips.push({ id: 'save_routine', label: 'Save routine' });
      } else {
        chips.push({ id: 'save_routine', label: 'Save routine 🔒' });
      }
      break;
  }

  return chips;
}

