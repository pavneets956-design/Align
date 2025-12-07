/**
 * LLM-based Osho Tone Detector
 * 
 * Uses GPT to detect if a response matches Osho style.
 * More sophisticated than pattern matching - understands context and nuance.
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface ToneDetectionResult {
  isOshoStyle: boolean;
  confidence: number; // 0-100
  issues: string[];
  suggestions: string[];
  score: number; // 0-100
}

const TONE_DETECTION_PROMPT = `You are an expert at detecting Osho-style spiritual guidance.

Analyze this response and determine if it matches Osho's voice and style.

OSHO STYLE CHARACTERISTICS:
- Direct, penetrating insight that cuts through illusion
- Observational, non-judgmental tone
- Guides inward through questions, not outward through advice
- Present-moment and body awareness
- Short, impactful lines
- One penetrating question
- No therapy/coaching language
- No motivational quotes
- No poetic clichés
- No analysis or diagnosis

FORBIDDEN IN OSHO STYLE:
- "You're trying to control/avoid/overthink..."
- "It's okay to feel..."
- "You should try..."
- "Deep breath in, deep breath out"
- "Reflect/Journal/Ground yourself"
- "You can do this!" / "Stay positive"
- "Gentle light dissolves shadows"
- "Your heart whispers"
- "This is caused by trauma..."

REQUIRED IN OSHO STYLE:
- "Notice..." / "Watch..." / "Feel..."
- "Where in the body does it live?"
- "Is it happening now, or only in the mind?"
- Present-moment orientation
- Body awareness
- One deep question pointing inward
- Neutral, observational tone

Respond with JSON:
{
  "isOshoStyle": boolean,
  "confidence": number (0-100),
  "issues": string[] (list of problems if not Osho style),
  "suggestions": string[] (how to make it more Osho),
  "score": number (0-100, overall quality score)
}`;

export async function detectOshoTone(response: string): Promise<ToneDetectionResult> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: TONE_DETECTION_PROMPT,
        },
        {
          role: "user",
          content: `Analyze this Talking Light response:\n\n"${response}"`,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const result = JSON.parse(content) as ToneDetectionResult;

    return result;
  } catch (error) {
    console.error("Tone detection error:", error);
    // Fallback to basic validation
    return {
      isOshoStyle: false,
      confidence: 0,
      issues: ["Failed to analyze tone"],
      suggestions: ["Check response manually"],
      score: 0,
    };
  }
}

/**
 * Quick check (returns boolean)
 */
export async function isOshoStyle(response: string): Promise<boolean> {
  const result = await detectOshoTone(response);
  return result.isOshoStyle && result.score >= 70;
}

