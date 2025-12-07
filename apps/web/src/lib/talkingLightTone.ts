/**
 * Talking Light Tone Validator
 * 
 * Heuristic validator to check if a response matches Osho-style tone.
 * Simple, deterministic TypeScript - no LLM calls.
 */

export type TalkingLightToneResult = {
  isOshoTone: boolean;
  reasons: string[];
};

// Banned phrases (case-insensitive substring match)
const BANNED_PHRASES = [
  "it's okay to feel",
  "it is okay to feel",
  "it's normal to",
  "it is normal to",
  "you're trying to control",
  "you're trying to control",
  "you are trying to control",
  "you're avoiding",
  "you're avoiding",
  "you are avoiding",
  "let's work through this",
  "let's work through this",
  "try grounding yourself",
  "you can do this",
  "you're stronger than you think",
  "you're stronger than you think",
  "stay positive",
  "nervous system",
  "trauma response",
  "coping mechanism",
  "cognitive distortion",
  "therapy",
  "therapist",
  "counseling",
  "counselling",
  "journal this",
  "reflect on this",
];

// Flowery clichés to reject
const FLOWERY_CLICHES = [
  "gentle light that dissolves the shadows",
  "your heart whispers",
  "the universe is guiding you",
  "ocean of thoughts",
  "clouds passing through the sky of your mind",
  "future shadows",
];

// Required awareness verbs
const AWARENESS_VERBS = [
  "notice",
  "watch",
  "observe",
  "feel",
  "sit with",
  "stay with",
];

// Required present/embodiment words
const EMBODIMENT_WORDS = [
  "body",
  "breath",
  "feet",
  "chest",
  "throat",
  "belly",
  "present moment",
  "right now",
  "ground",
];

export function checkTalkingLightTone(text: string): TalkingLightToneResult {
  const reasons: string[] = [];
  const lower = text.toLowerCase();
  const trimmed = text.trim();

  // 1) Check for banned phrases
  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase)) {
      reasons.push(`contains banned phrase: '${phrase}'`);
    }
  }

  // 2) Explicit "Reflect" check
  if (lower.trim().endsWith("reflect")) {
    reasons.push("ends with 'reflect' which is not allowed");
  }
  // Also check if any line equals "reflect" after splitting
  const lines = text.split('\n').map(l => l.trim().toLowerCase());
  if (lines.some(line => line === "reflect")) {
    reasons.push("contains stand-alone 'reflect' which is not allowed");
  }

  // 3) Check for flowery clichés
  for (const cliche of FLOWERY_CLICHES) {
    if (lower.includes(cliche)) {
      reasons.push(`contains flowery cliché: '${cliche}'`);
    }
  }

  // 4) Check for awareness verbs
  const hasAwarenessVerb = AWARENESS_VERBS.some(verb => lower.includes(verb));
  if (!hasAwarenessVerb) {
    reasons.push("missing awareness verbs");
  }

  // 5) Check for embodiment/present words
  const hasEmbodimentWord = EMBODIMENT_WORDS.some(word => lower.includes(word));
  if (!hasEmbodimentWord) {
    reasons.push("missing embodiment or present-moment words");
  }

  // 6) Question count check
  const questionCount = (text.match(/\?/g) || []).length;
  if (questionCount === 0) {
    reasons.push("no inward question present");
  } else if (questionCount > 2) {
    reasons.push("too many questions (should typically have only one main inward question)");
  }

  // Final decision
  const isOshoTone = reasons.length === 0;

  return {
    isOshoTone,
    reasons,
  };
}

