/**
 * Talking Light Tone Validator Tests
 * 
 * Tests the tone validator to ensure it correctly identifies Osho-style responses.
 */

import { checkTalkingLightTone } from '@/src/lib/talkingLightTone';
import { TALKING_LIGHT_SAMPLES } from '@/src/lib/talkingLightGoldSamples';

// Simple test runner (no framework needed)
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}:`, error);
  }
}

function expect(actual: any) {
  return {
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toBeTruthy: () => {
      if (!actual) {
        throw new Error(`Expected truthy, got ${actual}`);
      }
    },
    toBeFalsy: () => {
      if (actual) {
        throw new Error(`Expected falsy, got ${actual}`);
      }
    },
    toContain: (item: any) => {
      if (!actual.includes(item)) {
        throw new Error(`Expected array to contain ${item}`);
      }
    },
  };
}

// Test gold standard samples
describe('Talking Light Tone Validator', () => {
  test('All gold standard samples should pass validation', () => {
    TALKING_LIGHT_SAMPLES.forEach((sample) => {
      const result = checkTalkingLightTone(sample.reply);
      if (!result.isOshoTone) {
        throw new Error(`Gold sample ${sample.id} failed: ${result.reasons.join(', ')}`);
      }
    });
  });

  test('Should reject therapist/coach language', () => {
    const badResponse = "It's okay to feel this way. You're trying to control your anxiety. Let's work through this together.";
    const result = checkTalkingLightTone(badResponse);
    expect(result.isOshoTone).toBeFalsy();
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  test('Should reject motivational language', () => {
    const badResponse = "You can do this! You're stronger than you think! Stay positive!";
    const result = checkTalkingLightTone(badResponse);
    expect(result.isOshoTone).toBeFalsy();
  });

  test('Should reject flowery clichés', () => {
    const badResponse = "The gentle light that dissolves the shadows. Your heart whispers the truth.";
    const result = checkTalkingLightTone(badResponse);
    expect(result.isOshoTone).toBeFalsy();
  });

  test('Should reject responses without awareness verbs', () => {
    const badResponse = "Anxiety is a feeling. You should try to manage it better.";
    const result = checkTalkingLightTone(badResponse);
    expect(result.isOshoTone).toBeFalsy();
    expect(result.reasons).toContain('missing awareness verbs');
  });

  test('Should reject responses without body/present words', () => {
    const badResponse = "Notice the feeling. Watch it carefully. What do you think?";
    const result = checkTalkingLightTone(badResponse);
    expect(result.isOshoTone).toBeFalsy();
    expect(result.reasons).toContain('missing embodiment/present words');
  });

  test('Should reject responses without questions', () => {
    const badResponse = "Anxiety is energy. Notice it. Feel it in your body. Stay with it.";
    const result = checkTalkingLightTone(badResponse);
    expect(result.isOshoTone).toBeFalsy();
    expect(result.reasons).toContain('missing question mark');
  });

  test('Should accept valid Osho-style response', () => {
    const goodResponse = `Anxiety arises when the mind runs ahead of this moment.

Notice where it lives in your body.

Ask: "What am I imagining that is not happening now?"

Watch what appears.`;
    
    const result = checkTalkingLightTone(goodResponse);
    expect(result.isOshoTone).toBeTruthy();
  });
});

// Run tests if this file is executed directly
if (require.main === module) {
  console.log('Running Talking Light Tone Validator Tests...\n');
  // Note: This is a simple test runner. For production, use Jest or Vitest.
}

