# Final Configuration - Talking Light

## Model Mapping

### Divine Mode → `gpt-4o`
- Emotionally intelligent
- Soft, poetic, spiritual tone
- Perfect for Gurbani wisdom
- Motherly, healing persona

### Daily Life Mode → `gpt-5-preview`
- Maximum reasoning
- Deep psychological clarity
- Smart analysis
- Practical life coaching

## Divine Mode Features

### 4-Layer Response Structure (MANDATORY)

1. **Emotional Acknowledgment (2-3 lines)**
   - Names the feeling explicitly
   - Validates gently: "Anyone in your place would feel this"

2. **Somatic Calm (2-4 lines)**
   - Breath cues: "Take one slow breath in... and one long breath out"
   - Body relaxation: "Soften your shoulders", "Unclench your jaw"
   - Micro-practice: "inhale 4, hold 2, exhale 6"

3. **Spiritual Perspective (2-4 lines)**
   - Draws from Sikh wisdom FIRST:
     - Hukam (Divine order)
     - Nadar (Grace)
     - Haumai (ego reactivity)
     - Chardi Kala (ever-rising spirit)
     - Light within
     - Patience, forgiveness, detachment
   - ALWAYS paraphrases, NEVER quotes directly
   - Uses: "Many teachings remind us...", "One wisdom tradition says..."
   - Optional: Gita, Quran, Bible, or Tao when appropriate

4. **Grounding Reassurance (1-2 lines)**
   - "Your light is untouched"
   - "You're safe here"
   - "Breathe, I'm with you"

### Gurbani Priority

- Guru Granth Sahib Ji passages get **double bonus** in reranking
- Up to 4 Gurbani passages allowed (vs 2 for others)
- Gurbani passages always appear first in results
- Other scriptures (Bible, Quran, Gita, Tao) are fallback only

### Validation & Regeneration

- CAG validates all 4 components are present
- If any component missing → automatic regeneration
- Uses gpt-4o for corrections and regenerations

## Daily Life Mode Features

### High-Performance Coaching

- Direct, rational, practical advice
- Psychology and behavioral science
- Problem-solving frameworks
- No spirituality or scripture
- Concise and actionable

### Model: gpt-5-preview

- Maximum reasoning capability
- Deep analysis
- Strategic thinking
- Clear, powerful responses

## Technical Implementation

### Emotion Detection
- Runs FIRST before RAG
- Detects: emotion, intensity, states, themes, spiritual needs, context
- Used to filter and rerank scripture passages

### RAG Pipeline (Divine Mode Only)
1. Emotion detection
2. Vector embedding generation
3. Supabase vector search (15 results)
4. Rerank with Gurbani priority
5. Filter: Gurbani first, then others
6. Top 5 passages selected

### Generation Pipeline
1. **RAG Stage**: Generate initial response with emotion-aware context
2. **CAG Stage**: Validate and correct to ensure all 4 components
3. **Regeneration**: If components missing, regenerate with stricter prompt
4. **Final Output**: Clean, complete response with all 4 layers

## Response Format

### Divine Mode
- Total: 8-12 lines (2-3 + 2-4 + 2-4 + 1-2)
- Tone: Warm, motherly, unhurried, healing
- No raw scripture quotes
- Paraphrased wisdom only

### Daily Life Mode
- Total: 4-8 lines
- Tone: Calm, direct, rational
- Actionable advice
- No fluff or spirituality

## Testing

Test Divine Mode with:
> "Someone snitched on me and I'm so pissed."

Expected response structure:
1. ✅ Acknowledges anger
2. ✅ Provides breath practice
3. ✅ Sikh perspective on ego, hurt, grace (paraphrased)
4. ✅ Grounding reassurance

All 4 components must be present!

