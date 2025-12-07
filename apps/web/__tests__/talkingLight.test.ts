/**
 * Talking Light Automated Tests
 * 
 * Tests the Osho-style validation and response quality.
 */

import { validateTalkingLightResponse, getValidationFeedback } from '@/src/lib/talkingLightValidator';
import { GOLD_STANDARD_RESPONSES } from '@/src/lib/talkingLightGoldStandards';

describe('Talking Light Validation', () => {
  // Test gold standard responses
  Object.entries(GOLD_STANDARD_RESPONSES).forEach(([emotion, response]) => {
    test(`Gold standard response for ${emotion} should be valid`, () => {
      const result = validateTalkingLightResponse(response);
      expect(result.isValid).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(70);
    });
  });

  // Test forbidden patterns
  test('Should reject therapist/coach language', () => {
    const badResponse = "You're trying to control your anxiety. It's okay to feel this way. Try grounding yourself.";
    const result = validateTalkingLightResponse(badResponse);
    expect(result.isValid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  test('Should reject motivational language', () => {
    const badResponse = "You can do this! You're stronger than you think! Stay positive!";
    const result = validateTalkingLightResponse(badResponse);
    expect(result.isValid).toBe(false);
  });

  test('Should reject poetic clichés', () => {
    const badResponse = "The gentle light dissolves the shadows. Your heart whispers the truth.";
    const result = validateTalkingLightResponse(badResponse);
    expect(result.isValid).toBe(false);
  });

  // Test required patterns
  test('Should accept Osho-style language', () => {
    const goodResponse = `Anxiety appears when the mind moves faster than life.

Notice where it lives in your body.

Ask: "What future are you imagining that is not happening now?"

Stay with the sensation.`;
    
    const result = validateTalkingLightResponse(goodResponse);
    expect(result.isValid).toBe(true);
    expect(result.strengths).toContain('Uses Osho-style language');
  });

  // Test structure
  test('Should require one question', () => {
    const noQuestion = "Anxiety is energy. Feel it in your body. Stay with it.";
    const result = validateTalkingLightResponse(noQuestion);
    expect(result.issues).toContain('Missing penetrating question');
  });

  test('Should reject multiple questions', () => {
    const multipleQuestions = "What is anxiety? Where does it come from? How do I fix it?";
    const result = validateTalkingLightResponse(multipleQuestions);
    expect(result.issues.some(issue => issue.includes('Too many questions'))).toBe(true);
  });

  test('Should require body awareness', () => {
    const noBody = "Anxiety is a feeling. Think about it differently.";
    const result = validateTalkingLightResponse(noBody);
    expect(result.issues).toContain('Missing body awareness');
  });

  test('Should require present-moment orientation', () => {
    const noPresent = "Anxiety was caused by past events. You need to heal.";
    const result = validateTalkingLightResponse(noPresent);
    expect(result.issues).toContain('Missing present-moment orientation');
  });

  // Test length
  test('Should reject responses that are too short', () => {
    const tooShort = "Anxiety is energy.";
    const result = validateTalkingLightResponse(tooShort);
    expect(result.issues.some(issue => issue.includes('length'))).toBe(true);
  });

  test('Should reject responses that are too long', () => {
    const tooLong = Array(20).fill("This is a very long line that goes on and on.").join('\n');
    const result = validateTalkingLightResponse(tooLong);
    expect(result.issues.some(issue => issue.includes('length'))).toBe(true);
  });
});

describe('Validation Feedback', () => {
  test('Should provide helpful feedback', () => {
    const response = "You're trying to control your anxiety. Try breathing exercises.";
    const result = validateTalkingLightResponse(response);
    const feedback = getValidationFeedback(result);
    
    expect(feedback).toContain('Invalid');
    expect(feedback).toContain('Issues');
  });
});

