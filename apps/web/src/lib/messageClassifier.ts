/**
 * Message Classifier
 * 
 * Simple classification to determine if a message is:
 * - "inner" (emotional, spiritual, awareness-focused)
 * - "outer" (goals, money, discipline, practical action)
 * - "mixed" (both)
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export type MessageType = 'inner' | 'outer' | 'mixed';

const CLASSIFIER_PROMPT = `Classify this user message as one of: "inner", "outer", or "mixed".

- "inner" = emotional, spiritual, awareness, feeling stuck, pain, confusion, seeking meaning
- "outer" = goals, money, business, career, discipline, habits, productivity, practical steps
- "mixed" = contains both emotional/spiritual elements AND practical/goal-oriented elements

Return ONLY the single word: "inner", "outer", or "mixed". No explanation.`;

export async function classifyMessage(
  message: string,
  openaiClient: OpenAI = openai
): Promise<MessageType> {
  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: CLASSIFIER_PROMPT,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.3, // Low temperature for consistent classification
      max_tokens: 10,
    });

    const classification = response.choices[0]?.message?.content?.trim().toLowerCase() || 'inner';
    
    // Validate and default to 'inner' if invalid
    if (classification === 'inner' || classification === 'outer' || classification === 'mixed') {
      return classification as MessageType;
    }
    
    // Fallback: simple heuristic if LLM returns something unexpected
    const lower = message.toLowerCase();
    const outerKeywords = ['money', 'business', 'career', 'goal', 'plan', 'habit', 'discipline', 'productivity', 'start', 'build', 'earn', 'job', 'work'];
    const innerKeywords = ['feel', 'anxious', 'sad', 'angry', 'confused', 'lost', 'hurt', 'pain', 'spiritual', 'meaning', 'purpose', 'soul', 'heart'];
    
    const hasOuter = outerKeywords.some(kw => lower.includes(kw));
    const hasInner = innerKeywords.some(kw => lower.includes(kw));
    
    if (hasOuter && hasInner) return 'mixed';
    if (hasOuter) return 'outer';
    return 'inner';
  } catch (error) {
    console.error('Classification error:', error);
    // Default to 'inner' on error
    return 'inner';
  }
}

