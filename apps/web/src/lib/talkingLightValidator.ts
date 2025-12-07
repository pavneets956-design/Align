/**
 * Talking Light Validator
 * 
 * Validates responses to ensure they match Osho-style tone and structure.
 * Returns validation results with specific feedback.
 */

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  issues: string[];
  strengths: string[];
}

// Forbidden phrases (coach/therapist/motivational/poetic)
const FORBIDDEN_PATTERNS = [
  // Coach/Therapist language
  /\b(you're trying to|you're avoiding|you're overthinking|you're controlling)\b/i,
  /\b(this is your mind|your mind is doing|your nervous system)\b/i,
  /\b(it's okay to feel|it's normal to|it's understandable)\b/i,
  /\b(you should try|try grounding|try this|let's work through)\b/i,
  /\b(deep breath in, deep breath out|breathe deeply)\b/i,
  /\b(reflect|journal this|ground yourself|practice)\b/i,
  /\b(scientific|trauma|caused by|diagnosis)\b/i,
  
  // Motivational language
  /\b(you can do this|you're stronger|stay positive|you've got this)\b/i,
  /\b(you deserve|you're capable|believe in yourself)\b/i,
  
  // Poetic clichés
  /\b(gentle light|dissolves.*shadows|whispers from within|tender|softly|gently)\b/i,
  /\b(embrace|journey|path|unfold|heart whispers)\b/i,
  
  // Analysis/Diagnosis
  /\b(you're avoiding|this is caused by|this means that)\b/i,
];

// Required phrases (Osho language)
const REQUIRED_PATTERNS = [
  /\b(notice|watch|observe|feel|sit with)\b/i,
  /\b(where.*body|in the body|your body)\b/i,
  /\b(don't interfere|just observe|just watch|just feel)\b/i,
  /\b(is it happening|happening now|only in the mind)\b/i,
  /\b(present moment|right now|this moment)\b/i,
];

// Structural checks
const STRUCTURE_CHECKS = {
  hasDirectOpening: (text: string) => {
    const firstLine = text.split('\n')[0]?.trim() || '';
    return firstLine.length > 0 && firstLine.length < 100;
  },
  hasBodyAwareness: (text: string) => {
    return /\b(body|breath|feet|ground|sensation|feeling)\b/i.test(text);
  },
  hasOneQuestion: (text: string) => {
    const questions = text.match(/\?/g) || [];
    return questions.length === 1;
  },
  hasPresentMoment: (text: string) => {
    return /\b(now|present|this moment|here|right now)\b/i.test(text);
  },
  hasSoftClosing: (text: string) => {
    const lastLine = text.split('\n').filter(l => l.trim()).pop() || '';
    return lastLine.length > 0 && 
           !lastLine.endsWith('?') && 
           /\b(stay|watch|feel|let|sit|rest)\b/i.test(lastLine);
  },
  isConcise: (text: string) => {
    const lines = text.split('\n').filter(l => l.trim());
    return lines.length >= 4 && lines.length <= 10;
  },
};

export function validateTalkingLightResponse(response: string): ValidationResult {
  const issues: string[] = [];
  const strengths: string[] = [];
  let score = 100;

  // Check for forbidden patterns
  FORBIDDEN_PATTERNS.forEach((pattern, index) => {
    if (pattern.test(response)) {
      issues.push(`Contains forbidden language (coach/therapist/motivational/poetic)`);
      score -= 15;
    }
  });

  // Check for required patterns
  const hasRequiredLanguage = REQUIRED_PATTERNS.some(pattern => pattern.test(response));
  if (!hasRequiredLanguage) {
    issues.push(`Missing Osho-style language (notice, watch, feel, body awareness)`);
    score -= 20;
  } else {
    strengths.push('Uses Osho-style language');
  }

  // Structural checks
  if (!STRUCTURE_CHECKS.hasDirectOpening(response)) {
    issues.push('Missing direct opening insight');
    score -= 10;
  } else {
    strengths.push('Has direct opening insight');
  }

  if (!STRUCTURE_CHECKS.hasBodyAwareness(response)) {
    issues.push('Missing body awareness');
    score -= 15;
  } else {
    strengths.push('Includes body awareness');
  }

  if (!STRUCTURE_CHECKS.hasOneQuestion(response)) {
    const questionCount = (response.match(/\?/g) || []).length;
    if (questionCount === 0) {
      issues.push('Missing penetrating question');
      score -= 15;
    } else if (questionCount > 1) {
      issues.push(`Too many questions (${questionCount} found, should be 1)`);
      score -= 10;
    }
  } else {
    strengths.push('Has one penetrating question');
  }

  if (!STRUCTURE_CHECKS.hasPresentMoment(response)) {
    issues.push('Missing present-moment orientation');
    score -= 10;
  } else {
    strengths.push('Orientated to present moment');
  }

  if (!STRUCTURE_CHECKS.hasSoftClosing(response)) {
    issues.push('Missing soft closing line');
    score -= 10;
  } else {
    strengths.push('Has soft closing');
  }

  if (!STRUCTURE_CHECKS.isConcise(response)) {
    const lines = response.split('\n').filter(l => l.trim()).length;
    issues.push(`Response length issue (${lines} lines, should be 4-10)`);
    score -= 5;
  } else {
    strengths.push('Appropriate length');
  }

  // Check for neutral, observational tone
  const hasJudgment = /\b(should|must|need to|have to|wrong|right|bad|good)\b/i.test(response);
  if (hasJudgment) {
    issues.push('Contains judgmental language');
    score -= 10;
  } else {
    strengths.push('Neutral, non-judgmental tone');
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  return {
    isValid: score >= 70 && issues.length <= 2,
    score,
    issues,
    strengths,
  };
}

/**
 * Quick validation check (returns boolean)
 */
export function isValidTalkingLightResponse(response: string): boolean {
  return validateTalkingLightResponse(response).isValid;
}

/**
 * Get validation feedback as a string
 */
export function getValidationFeedback(result: ValidationResult): string {
  if (result.isValid) {
    return `✅ Valid (Score: ${result.score}/100)\nStrengths: ${result.strengths.join(', ')}`;
  }
  
  return `❌ Invalid (Score: ${result.score}/100)\nIssues: ${result.issues.join('; ')}\nStrengths: ${result.strengths.join(', ')}`;
}

