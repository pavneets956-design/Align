/**
 * ALIGN API Client
 * Handles communication with backend and local routing logic
 */

import { Engine, QuickChip, ChatResponse, BackendResponse } from '../types/align';

// API Configuration
import { API_ENDPOINTS } from '../config/api';

// Use the chat endpoint from config (already includes /chat)
const API_BASE_URL = API_ENDPOINTS.alignChat || 'http://localhost:3000/api/align/chat';

/**
 * Route user message locally (before backend is ready)
 * Implements the 3 test flows from ALIGN spec
 */
export function routeLocally(userText: string): ChatResponse {
  const lower = userText.toLowerCase().trim();

  // PLAN ENGINE - Hard keyword rules (highest priority)
  const planKeywords = [
    'plan', 'bigger plan', 'full plan', 'practical plan', 'give me a plan',
    'roadmap', 'step by step', 'blueprint', 'monthly plan', 'weekly plan',
    'routine', 'system'
  ];
  const planMatches = planKeywords.some(keyword => lower.includes(keyword));
  const systemPattern = /(build|create|make|design)\s+a\s+system/i.test(userText);
  
  if (planMatches || systemPattern) {
    return {
      replyText: `Here's a structure for the next 7–14 days:

**Week 1: Foundation**
- Morning (10 min): One thing that matters today
- Midday (5 min): One small task toward your goal
- Evening (5 min): Review what shifted

**Week 2: Deepening**
- Morning (15 min): Structured practice
- Midday (10 min): Two focused actions
- Evening (5 min): Note patterns, adjust

Each day builds on the last. Ready to commit? Unlock your full 30-day plan with ALIGN Pro.`,
      engineUsed: 'plan',
      suggestedChips: [
        { id: 'unlock_30_days', label: 'Unlock your full 30-day plan' },
        { id: 'inner_block', label: 'Help me understand the inner block' },
      ],
      showPaywall: true,
    };
  }

  // ACTION ENGINE - Hard keyword rules
  const actionKeywords = [
    'action', 'give me an action', 'what should i do now', 'next step',
    'what\'s one thing i can do', 'tell me what to do', 'practical step',
    'task', 'give me a practical'
  ];
  const actionMatches = actionKeywords.some(keyword => lower.includes(keyword));
  
  if (actionMatches) {
    return {
      replyText: `**3 actions for today:**

1. Write down the last 3 things you did well (even tiny ones).
2. Notice when you're comparing yourself to others. Stop. Return to your own path.
3. Do one thing today that scares you just a little—the smallest version.

Start there.`,
      engineUsed: 'action',
      suggestedChips: [
        { id: 'inner_block', label: 'Help me understand the inner block' },
        { id: 'give_plan', label: 'Give me a practical plan' },
      ],
    };
  }

  // INSIGHT ENGINE - Emotional states and inner blocks
  const insightKeywords = [
    'feel', 'i feel', 'i\'m', 'i am', 'anxious', 'stuck', 'lost',
    'dumb', 'stupid', 'angry', 'sad', 'confused', 'frustrated',
    'inner block', 'block'
  ];
  const insightMatches = insightKeywords.some(keyword => lower.includes(keyword));
  
  if (insightMatches) {
    return {
      replyText: `Look at the belief underneath this thought. Whose standards are you using to judge yourself right now? What would happen if you dropped that comparison?`,
      engineUsed: 'insight',
      suggestedChips: [{ id: 'yes_action', label: 'Yes, give me an action' }],
    };
  }

  // Default: Insight Engine for greetings
  if (lower === 'hi' || lower === 'hello' || lower === 'hey') {
    return {
      replyText: `I'm here. Tell me one area of your life you want to shift right now—work, body, focus, or relationships?`,
      engineUsed: 'insight',
      suggestedChips: [{ id: 'give_plan', label: 'Give me a practical plan' }],
    };
  }

  // Default: Insight Engine
  return {
    replyText: `What's the real block here? Not the surface problem, but what's underneath that's keeping you stuck?`,
    engineUsed: 'insight',
    suggestedChips: [
      { id: 'give_plan', label: 'Give me a practical plan' },
      { id: 'yes_action', label: 'Yes, give me an action' },
    ],
  };
}

/**
 * Handle quick chip clicks - bypass NLP and route directly
 */
export function routeChip(chipId: QuickChip['id'], context?: string): ChatResponse {
  switch (chipId) {
    case 'give_plan':
      // "Give me a practical plan" routes to PLAN engine (not action)
      return {
        replyText: `Here's a structure for the next 7–14 days:

**Week 1: Foundation**
- Morning (10 min): One thing that matters today
- Midday (5 min): One small task toward your goal
- Evening (5 min): Review what shifted

**Week 2: Deepening**
- Morning (15 min): Structured practice
- Midday (10 min): Two focused actions
- Evening (5 min): Note patterns, adjust

Each day builds on the last. Ready to commit? Unlock your full 30-day plan with ALIGN Pro.`,
        engineUsed: 'plan',
        suggestedChips: [
          { id: 'unlock_30_days', label: 'Unlock your full 30-day plan' },
          { id: 'inner_block', label: 'Help me understand the inner block' },
        ],
        showPaywall: true,
      };

    case 'yes_action':
      return {
        replyText: `**3 actions for today:**

1. Write down the last 3 things you did well (even tiny ones).
2. Notice when you're comparing yourself to others. Stop. Return to your own path.
3. Do one thing today that scares you just a little—the smallest version.

Start there.`,
        engineUsed: 'action',
        suggestedChips: [
          { id: 'save_routine', label: 'Save routine 🔒 (ALIGN Pro)' },
          { id: 'inner_block', label: 'Help me understand the inner block' },
        ],
      };

    case 'inner_block':
      return {
        replyText: `When you feel blocked, it usually means part of you is avoiding a truth.

Ask yourself: What benefit do I secretly get from staying exactly where I am?

The moment you answer that honestly, the block starts to lose its power.`,
        engineUsed: 'insight',
        suggestedChips: [{ id: 'yes_action', label: 'Yes, give me an action' }],
      };

    case 'unlock_30_days':
      return {
        replyText: `Unlock your full 30-day plan with ALIGN Pro.`,
        engineUsed: 'plan',
        suggestedChips: [],
        showPaywall: true,
      };

    case 'save_routine':
      return {
        replyText: `Save this routine to your library?`,
        engineUsed: 'action',
        suggestedChips: [],
        showPaywall: true,
      };

    default:
      return routeLocally('');
  }
}

/**
 * Send message to backend API
 */
export async function sendToBackend(
  message: string,
  context?: {
    userId?: string | null;
    userTier?: 'free' | 'pro';
    engine?: Engine;
    explicitEngine?: Engine;
    previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>;
  }
): Promise<ChatResponse> {
  try {
    // API_BASE_URL already includes /chat from API_ENDPOINTS.alignChat
    const url = API_BASE_URL;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput: message,
        userId: context?.userId || null,
        userTier: context?.userTier || 'free',
        explicitEngine: context?.explicitEngine || context?.engine,
        conversationHistory: context?.previousMessages || [],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle new API response format
    if (data.messages && data.messages.length > 0) {
      const botMessage = data.messages[0];
      return {
        replyText: botMessage.text || '',
        engineUsed: (botMessage.meta?.engine || data.engineUsed || 'insight') as Engine,
        suggestedChips: data.suggestedChips || [],
        showPaywall: data.showPaywall || false,
      };
    }

    // Fallback to old format
    const replyText = data.reply || (data.lines || []).join('\n');
    const engineUsed = (data.mode || data.engineUsed || 'insight') as Engine;

    return {
      replyText,
      engineUsed,
      suggestedChips: data.suggestedChips || [],
      showPaywall: data.showPaywall || false,
    };
  } catch (error) {
    console.warn('Backend API failed, using local routing:', error);
    // Fall back to local routing if backend is unavailable
    return routeLocally(message);
  }
}

/**
 * Main chat handler - routes message and returns response
 */
export async function handleMessage(
  message: string,
  context?: {
    userId?: string | null;
    userTier?: 'free' | 'pro';
    engine?: Engine;
    explicitEngine?: Engine;
    previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>;
  }
): Promise<ChatResponse> {
  // Try backend first, fall back to local routing if unavailable
  try {
    return await sendToBackend(message, context);
  } catch (error) {
    console.warn('Backend unavailable, using local routing:', error);
    return routeLocally(message);
  }
}

