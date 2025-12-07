/**
 * Gold Standard Responses
 * 
 * These are perfect Osho-style responses for different emotions.
 * Use these as reference examples and for testing.
 */

export const GOLD_STANDARD_RESPONSES = {
  anxiety: `Anxiety arises when the mind runs ahead of this moment.
Let it slow.

Feel your breath without shaping it.
Notice where the tension lives in the body.

Ask: "What am I imagining that is not happening now?"

Watch what appears.`,

  anger: `Anger is a fire the mind lights when reality refuses to obey it.

Feel the heat without acting on it.
Where does it burn inside you?

Ask: "What expectation collapsed?"

Stay with the sensation.`,

  betrayal: `Betrayal hurts when the image you held of someone shatters.
The pain is yours, not theirs.

Notice what part of you feels broken.

Ask: "What did I expect them to be?"

Sit with the answer.`,

  loneliness: `Loneliness appears when you are disconnected from yourself.
Others are just mirrors.

Feel the emptiness.
Don't escape it.

Ask: "What am I hoping someone else will fill?"

Watch gently.`,

  fear: `Fear is imagination pretending to be truth.

Feel your body.
Watch the breath.

Ask: "Is this happening, or only being imagined?"

Rest in the difference.`,

  confusion: `Confusion is the mind craving certainty.
Let it be uncertain.

Sit quietly.
Feel your feet.

Ask: "What answer am I demanding?"

Let the question breathe.`,

  regret: `Regret is the mind clinging to a past it cannot change.

Feel the weight of it in your body.

Ask: "What am I holding that is already gone?"

Let the weight speak.`,

  shame: `Shame is an image of yourself collapsing.
Good — let it collapse.

Notice where it tightens the body.

Ask: "Whose approval am I still trying to earn?"

Observe without judgment.`,

  selfDoubt: `Doubt is a cloud passing across your sky.
You are not the cloud.

Feel the breath.
Let the doubt be there.

Ask: "Who is the one aware of this doubt?"

Stay with that awareness.`,

  feelingLost: `Feeling lost means the old direction no longer fits.
Good. A new one is forming.

Be still.
Feel your body.

Ask: "What wants to fall away?"

Listen quietly.`,
};

/**
 * Get a gold standard response for an emotion
 */
export function getGoldStandardResponse(emotion: string): string | null {
  const normalized = emotion.toLowerCase().trim();
  
  const mapping: Record<string, keyof typeof GOLD_STANDARD_RESPONSES> = {
    'anxiety': 'anxiety',
    'anxious': 'anxiety',
    'anger': 'anger',
    'angry': 'anger',
    'betrayal': 'betrayal',
    'betrayed': 'betrayal',
    'loneliness': 'loneliness',
    'lonely': 'loneliness',
    'fear': 'fear',
    'afraid': 'fear',
    'confusion': 'confusion',
    'confused': 'confusion',
    'regret': 'regret',
    'shame': 'shame',
    'ashamed': 'shame',
    'self-doubt': 'selfDoubt',
    'doubt': 'selfDoubt',
    'feeling lost': 'feelingLost',
    'lost': 'feelingLost',
  };

  const key = mapping[normalized];
  return key ? GOLD_STANDARD_RESPONSES[key] : null;
}

