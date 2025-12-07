import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { TALKING_LIGHT_SYSTEM_PROMPT } from '@/src/lib/talkingLightPrompt';
import { ACTION_COACH_SYSTEM_PROMPT } from '@/src/lib/actionCoachPrompt';
import { classifyMessage, MessageType } from '@/src/lib/talkingLightClassifier';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Lazy initialization to avoid build-time errors
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  
  try {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    return null;
  }
}

type Passage = {
  id: string;
  scripture: string;
  ref: string | null;
  paraphrase: string;
  practice: string;
  virtues: string[];
  states: string[];
  themes: string[];
  weight: number;
  similarity?: number;
};

const STATES = ["anxiety", "loneliness", "anger", "confusion", "grief", "overthinking", "self-doubt", "seeking"];
const PREFERRED_VIRTUES = ["fearlessness", "presence", "love", "trust", "compassion"];
const THEMES = ["non-attachment", "letting-go", "stillness", "service", "acceptance", "courage", "gratitude"];
const VIRTUE_WEIGHT = 0.10;
const THEME_WEIGHT = 0.05;
const STATE_WEIGHT = 0.15;
const GURBANI_BONUS = 0.20;
const MAX_PER_SCRIPTURE = 2;

// Using Insight Engine prompt for inner clarity, Action Engine for practical plans

// CAG Configuration
const ENABLE_CAG = true; // Toggle CAG correction step
const CAG_TEMPERATURE = 0.3; // Lower temperature for more faithful corrections

function rerankResults(results: Passage[], states: string[], themes: string[]): Passage[] {
  const stateSet = new Set(states);
  const preferredVirtues = new Set(PREFERRED_VIRTUES);
  const themeSet = new Set(themes);
  const scriptureCounts = new Map<string, number>();
  return results
    .map((row) => {
      const stateMatches = (row.states || []).filter((state) => stateSet.has(state)).length;
      const virtueMatches = (row.virtues || []).filter((virtue) => preferredVirtues.has(virtue)).length;
      const themeMatches = (row.themes || []).filter((theme) => themeSet.has(theme)).length;
      const base = row.similarity ?? 0;
      const scriptureBonus = row.scripture === "Gurbani" ? GURBANI_BONUS : 0;
      const virtueBonus = virtueMatches * VIRTUE_WEIGHT;
      const themeBonus = themeMatches * THEME_WEIGHT;
      const score =
        base + scriptureBonus + stateMatches * STATE_WEIGHT + virtueBonus + themeBonus + (row.weight ?? 0) * 0.02;
      return { ...row, similarity: score };
    })
    .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))
    .filter((row) => {
      const count = scriptureCounts.get(row.scripture) ?? 0;
      if (count >= MAX_PER_SCRIPTURE) return false;
      scriptureCounts.set(row.scripture, count + 1);
      return true;
    })
    .slice(0, 5);
}

function buildPrompt(passages: Passage[], targetLang: string) {
  const lines = passages
    .map((p) => {
      return [`- paraphrase: ${p.paraphrase}`, `  practice: ${p.practice}`].join("\n");
    })
    .join("\n");
  return `Inner context (never cite it):\n${lines}`;
}

async function detectEmotionAndContext(openai: OpenAI, text: string) {
  try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
        {
          role: "system",
          content: `Analyze the user's message for emotional state and spiritual needs. Return JSON with:
- emotion: primary emotion (anger, sadness, anxiety, joy, confusion, etc.)
- intensity: "low", "medium", or "high"
- states: array from [${STATES.join(", ")}]
- themes: array from [${THEMES.join(", ")}]
- spiritualNeeds: what they need (calm, perspective, forgiveness, courage, acceptance, etc.)
- context: brief description of their situation

Respond ONLY with valid JSON: {"emotion":"...","intensity":"...","states":[...],"themes":[...],"spiritualNeeds":[...],"context":"..."}`
        },
        { role: "user", content: text }
      ],
      temperature: 0.3,
      max_tokens: 300,
    });
    const raw = response.choices[0]?.message?.content ?? "{}";
    const json = JSON.parse(raw);
    return {
      emotion: json.emotion || "seeking",
      intensity: json.intensity || "medium",
      states: Array.isArray(json.states)
        ? json.states.map((s: string) => s.trim().toLowerCase()).filter((s: string) => STATES.includes(s))
        : [],
      themes: Array.isArray(json.themes)
        ? json.themes.map((t: string) => t.trim().toLowerCase()).filter((t: string) => THEMES.includes(t))
        : [],
      spiritualNeeds: Array.isArray(json.spiritualNeeds) ? json.spiritualNeeds : [],
      context: json.context || ""
    };
  } catch (error) {
    console.warn("Failed to detect emotion/context:", error);
    return { 
      emotion: "seeking", 
      intensity: "medium", 
      states: [], 
      themes: [], 
      spiritualNeeds: [],
      context: ""
    };
  }
}

function languageName(code: string) {
  switch (code) {
    case "pa":
      return "Punjabi";
    case "hi":
      return "Hindi";
    default:
      return "English";
  }
}

/**
 * CAG (Corrective Augmented Generation): Refines the Divine response
 * to ensure conversational tone and proper scripture integration.
 */
async function correctDivineResponse(
  openai: OpenAI,
  initialResponse: string,
  passages: Passage[],
  query: string,
  targetLang: string,
  emotionData: { emotion: string; intensity: string; states: string[]; themes: string[]; spiritualNeeds: string[]; context: string }
): Promise<string> {
  try {
    const contextSummary = passages
      .slice(0, 3)
      .map((p) => {
        const ref = p.ref ? ` (${p.ref})` : '';
        return `${p.paraphrase}${ref}`;
      })
      .join('\n');

    const correctionPrompt = `You MUST validate and correct this Insight Engine response. It MUST be direct, penetrating, and transformative.

**CRITICAL CHECKS:**
1. Is it direct and penetrating? (No fluff, no clichés)
2. Does it guide them to look inward, not outward?
3. Does it end with a question or simple action for awareness?
4. Is it concise but powerful?
5. FORBIDDEN: Generic motivational quotes, preaching, therapy language, flowery poetic clichés

Original response:
${initialResponse}

${contextSummary ? `Wisdom context (paraphrase essence, never quote directly):\n${contextSummary}\n\n` : ''}User's emotional state: ${emotionData.emotion} (${emotionData.intensity})
User's query: "${query}"

**IF THE RESPONSE:**
- Is too generic or therapist-like → Make it more direct and penetrating
- Is too poetic/flowery (e.g., "gentle light dissolves shadows", "whispers from within") → Cut to core truth, remove decorative language
- Is too formal or preachy → Make it simpler, more direct
- Doesn't guide inward → Add reflection or awareness question
- Is too long → Shorten to be more impactful

**REQUIRED FORMAT:**
✅ Direct, penetrating, transformative
✅ Guides inward, not outward
✅ Ends with question or action for awareness
✅ Concise but powerful
✅ No fluff, no clichés, no flowery metaphors
✅ Short, punchy lines. One strong question. One clear action.

**FORBIDDEN:**
❌ Generic motivational quotes
❌ Preaching or therapy language
❌ Flowery poetic clichés ("gentle light", "dissolves shadows", "whispers from within", "tender", "softly", "embrace", "journey", "unfold")
❌ Long, rambling responses
❌ Telling them what to think (show them where to look)

Return ONLY the corrected response.`;

    const correction = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: TALKING_LIGHT_SYSTEM_PROMPT },
        { role: "user", content: correctionPrompt }
      ],
      temperature: 0.85,
      max_tokens: 700,
    });

    let corrected = correction.choices[0]?.message?.content?.trim() || initialResponse;
    
    // Validate using the validator
    const validation = validateTalkingLightResponse(corrected);
    
    // If validation fails, regenerate
    if (!validation.isValid || validation.score < 70) {
      console.warn("Response failed validation:", validation.issues.join(', '));
      const regeneratePrompt = `The previous response failed validation. Generate a CORRECT response:

User's query: "${query}"
Emotion: ${emotionData.emotion} (${emotionData.intensity})

${contextSummary ? `Wisdom context (paraphrase essence, never quote):\n${contextSummary}\n\n` : ''}Generate a response that:
- Is direct, penetrating, transformative
- Guides them to look inward
- Uses paradoxes and counter-intuitive truths when appropriate
- Ends with a question or simple action for awareness
- Is concise but powerful
- No fluff, no clichés, no flowery metaphors
- Short, punchy lines. One strong question. One clear action.
- Cut to core truth, not poetic sparkles`;
      
      const regeneration = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: TALKING_LIGHT_SYSTEM_PROMPT },
          { role: "user", content: regeneratePrompt }
        ],
        temperature: 0.85,
        max_tokens: 700,
      });
      
      corrected = regeneration.choices[0]?.message?.content?.trim() || corrected;
    }

    return corrected;
  } catch (error) {
    console.warn("CAG correction failed, using initial response:", error);
    return initialResponse;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set in environment variables");
      return NextResponse.json(
        { 
          error: "API configuration error", 
          lines: ["I'm having trouble connecting. Please check that OPENAI_API_KEY is set in your environment variables."] 
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const userMessage: string = body.message ?? body.input ?? body.prompt ?? "";
    const targetMode = body.targetMode as "insight" | "action" | undefined;

    // Server-side validation to prevent duplicate/empty calls
    if (!userMessage || userMessage.trim().length < 1) {
      return NextResponse.json({
        reply: "",
        lines: [],
        mode: "insight",
        type: "inner"
      });
    }

    if (userMessage.length > 2000) {
      return NextResponse.json({
        reply: "Your message is too long. Please keep it under 2000 characters.",
        lines: ["Your message is too long. Please keep it under 2000 characters."],
        mode: "insight",
        type: "inner"
      });
    }

    const query = userMessage.trim();

    // Decide which engine
    let mode: "insight" | "action";
    let type: MessageType = "inner";

    // If frontend explicitly requests a mode, honor it (bypass classifier)
    if (targetMode === "insight" || targetMode === "action") {
      mode = targetMode;
    } else {
      // Fall back to classifier for automatic routing
      type = classifyMessage(query); // "inner" | "outer" | "mixed"
      
      if (type === "outer") {
        mode = "action";
      } else {
        mode = "insight"; // inner + mixed → insight first
      }
    }

    // Choose the system prompt
    const systemPrompt =
      mode === "insight"
        ? TALKING_LIGHT_SYSTEM_PROMPT
        : ACTION_COACH_SYSTEM_PROMPT;

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      temperature: 0.8,
      max_tokens: 700,
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "Silence is speaking. Try again in a moment.";

    // Split reply into lines for consistent format
    const lines = reply
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 12);

    // Return JSON with reply and which engine was used
    return NextResponse.json({
      reply,
      lines,
      mode, // "insight" or "action"
      type, // "inner" | "outer" | "mixed" (optional but useful)
    });

  } catch (error) {
    console.error("Guidance API error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: "Failed to fetch guidance", 
        lines: [`I'm having trouble right now. Error: ${errorMessage}. Please check your API configuration and try again.`] 
      },
      { status: 500 }
    );
  }
}

