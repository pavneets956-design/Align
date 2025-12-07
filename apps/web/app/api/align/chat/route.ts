/**
 * ALIGN Chat API Endpoint
 * Handles chat messages with 3-engine routing (Insight, Action, Plan)
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { classifyMessage, generateChips } from '@/src/lib/alignClassifier';
import {
  INSIGHT_ENGINE_PROMPT,
  ACTION_ENGINE_PROMPT,
  PLAN_ENGINE_PROMPT,
} from '@/src/lib/alignPrompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Get Supabase client (server-side with service role)
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase not configured - user tier will default to free');
    return null;
  }
  
  try {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}

// Get user tier from Supabase
async function getUserTier(userId: string | null): Promise<'free' | 'pro'> {
  if (!userId) return 'free';
  
  const supabase = getSupabaseClient();
  if (!supabase) return 'free';

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('tier')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return 'free';
    }

    return (data.tier === 'pro' ? 'pro' : 'free') as 'free' | 'pro';
  } catch (error) {
    console.error('Error fetching user tier:', error);
    return 'free';
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      userInput,
      userId = null,
      userTier: providedTier,
      conversationHistory = [],
      explicitEngine,
    } = body;

    // Validate input
    if (!userInput || typeof userInput !== 'string' || userInput.trim().length === 0) {
      return NextResponse.json(
        { error: 'userInput is required' },
        { status: 400 }
      );
    }

    if (userInput.length > 2000) {
      return NextResponse.json(
        { error: 'Message too long (max 2000 characters)' },
        { status: 400 }
      );
    }

    const text = userInput.trim();

    // Get user tier
    let userTier: 'free' | 'pro' = 'free';
    if (providedTier === 'pro' || providedTier === 'free') {
      userTier = providedTier;
    } else if (userId) {
      userTier = await getUserTier(userId);
    }

    // Classify message to determine engine
    const classification = classifyMessage(text, explicitEngine);
    const engine = classification.engine;

    // Select system prompt based on engine
    let systemPrompt: string;
    switch (engine) {
      case 'insight':
        systemPrompt = INSIGHT_ENGINE_PROMPT;
        break;
      case 'action':
        systemPrompt = ACTION_ENGINE_PROMPT;
        break;
      case 'plan':
        systemPrompt = PLAN_ENGINE_PROMPT;
        // For plan engine, modify prompt based on tier
        if (userTier === 'free') {
          systemPrompt += '\n\nIMPORTANT: User is on FREE tier. Provide 7-14 day structure only. Mention Pro upsell at the end.';
        } else {
          systemPrompt += '\n\nIMPORTANT: User is on PRO tier. Provide full 30-day detailed plan.';
        }
        break;
      default:
        systemPrompt = INSIGHT_ENGINE_PROMPT;
    }

    // Build conversation context
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history (last 10 messages)
    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({
          role: msg.role,
          content: msg.content || msg.text || '',
        });
      }
    }

    // Add current message
    messages.push({ role: 'user', content: text });

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.8,
      max_tokens: 700,
    });

    const replyText = completion.choices[0]?.message?.content?.trim() || 
      'I\'m here. What would you like to explore?';

    // Determine if we should show paywall
    let showPaywall = false;
    let paywallReason: string | undefined;

    if (engine === 'plan' && userTier === 'free') {
      showPaywall = true;
      paywallReason = 'bigger_plan';
    }

    // Generate suggested chips
    const suggestedChips = generateChips(engine, userTier, showPaywall);

    // Return response
    return NextResponse.json({
      messages: [
        {
          id: `bot-${Date.now()}`,
          from: 'bot',
          text: replyText,
          meta: { engine },
        },
      ],
      suggestedChips,
      engineUsed: engine,
      showPaywall,
      paywallReason,
      userTier,
    });

  } catch (error) {
    console.error('ALIGN chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        error: 'Failed to process message',
        message: `I'm having trouble right now. ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}

