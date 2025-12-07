/**
 * Simple keyword-based message classifier
 * 
 * Classifies messages as "inner", "outer", or "mixed" based on keyword matching.
 * No LLM calls - fast, cheap, deterministic.
 */

export type MessageType = "inner" | "outer" | "mixed";

export function classifyMessage(text: string): MessageType {
  const lower = text.toLowerCase();

  const innerKeywords = [
    "anxious",
    "anxiety",
    "sad",
    "lonely",
    "alone",
    "depressed",
    "depression",
    "hurt",
    "broken",
    "angry",
    "anger",
    "betrayed",
    "betrayal",
    "confused",
    "confusion",
    "lost",
    "overwhelmed",
    "stressed",
    "stress",
    "fear",
    "afraid",
    "panic",
    "shame",
    "guilt",
    "pain",
    "cry",
    "emotional"
  ];

  const outerKeywords = [
    "money",
    "income",
    "business",
    "clients",
    "sales",
    "job",
    "career",
    "promotion",
    "productivity",
    "discipline",
    "habit",
    "habits",
    "routine",
    "gym",
    "workout",
    "side hustle",
    "side-hustle",
    "project",
    "goals",
    "goal",
    "startup",
    "company",
    "focus",
    "time management",
    "time-management",
    "plan",
    "bigger plan",
    "make bigger plan",
    "give me a bigger plan",
    "more plan",
    "bigger goals",
    "expand plan",
    "build a system",
    "help me take action",
    "help me structure my day",
    "help me improve",
    "full plan",
    "monthly plan",
    "system",
    "structure",
    "action",
    "steps",
    "improve"
  ];

  let innerScore = 0;
  let outerScore = 0;

  for (const word of innerKeywords) {
    if (lower.includes(word)) innerScore++;
  }

  for (const word of outerKeywords) {
    if (lower.includes(word)) outerScore++;
  }

  if (innerScore > 0 && outerScore === 0) return "inner";
  if (outerScore > 0 && innerScore === 0) return "outer";
  if (outerScore > 0 && innerScore > 0) return "mixed";

  // Fallback: if no obvious keywords, treat as inner by default (safer).
  return "inner";
}

