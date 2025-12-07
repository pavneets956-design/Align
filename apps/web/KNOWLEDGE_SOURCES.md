# Backend Knowledge Sources

The TalkingLight backend knowledge base comes from multiple sources, processed through an ingestion pipeline.

## 📚 Primary Sources

### 1. **Public Domain Scriptures** (Project Gutenberg)

These are automatically downloaded and processed from Project Gutenberg:

| Scripture | Source | URL |
|-----------|--------|-----|
| **Tao Te Ching** | James Legge translation | https://www.gutenberg.org/cache/epub/216/pg216.txt |
| **Dhammapada** | F. Max Muller translation | https://www.gutenberg.org/cache/epub/2017/pg2017.txt |
| **Bhagavad Gita** | Sir Edwin Arnold translation ("Song Celestial") | https://www.gutenberg.org/cache/epub/2388/pg2388.txt |
| **Meditations** | Marcus Aurelius (George Long translation) | https://www.gutenberg.org/cache/epub/2680/pg2680.txt |
| **Psalms (KJV)** | King James Version Bible | https://www.gutenberg.org/cache/epub/10/pg10.txt |
| **Proverbs (KJV)** | King James Version Bible | https://www.gutenberg.org/cache/epub/10/pg10.txt |

### 2. **Custom/Licensed Sources**

#### Gurbani (Guru Granth Sahib Ji)
- Stored in `server/ingest/data/gurbani/`
- Can be imported via JSON/CSV files
- Given higher weight (priority) in retrieval
- Supports Punjabi, Hindi, and English

#### Custom Imports
You can add your own curated material:
- JSON or CSV format
- Can include original text, translations, paraphrases
- Tagged with virtues, states, themes
- Customizable weights for prioritization

## 🔄 Ingestion Pipeline

### Step 1: Bootstrap (Download & Chunk)
```bash
npm run ingest:bootstrap
```

**What it does:**
- Downloads texts from Project Gutenberg
- Chunks into passages (200-400 characters)
- Creates overlapping chunks (50 char overlap) for context continuity
- Outputs to `server/ingest/data/bootstrap.jsonl`

### Step 2: Enrichment (Tag, Paraphrase, Embed)
```bash
npm run ingest:embed
```

**What it does:**
- **Paraphrasing**: Uses OpenAI to create gentle, accessible paraphrases
- **Tagging**: Automatically tags passages with:
  - **Virtues**: fearlessness, presence, love, trust, compassion
  - **States**: anxiety, loneliness, anger, confusion, grief, overthinking, self-doubt, seeking
  - **Themes**: non-attachment, letting-go, stillness, service, acceptance, courage, gratitude
- **Practice Generation**: Creates micro-practices (breath work, body awareness)
- **Embedding**: Generates vector embeddings using `text-embedding-3-large`
- **Storage**: Upserts into Supabase `passages` and `embeddings` tables

### Step 3: Custom Import (Optional)
```bash
npm run ingest:import -- --file=path/to/custom.json
```

**Format:**
```json
{
  "scripture": "Guru Granth Sahib Ji",
  "ref": "Ang 1",
  "original": "Original text...",
  "translation": "Translation...",
  "paraphrase": "Gentle paraphrase...",
  "practice": "Hand on heart.",
  "states": ["grief"],
  "virtues": ["compassion"],
  "themes": ["acceptance"],
  "weight": 5
}
```

## 🗄️ Database Structure

### `passages` Table
- `id` (UUID)
- `scripture` (text) - Source name
- `ref` (text) - Reference (chapter, verse, etc.)
- `original` (text) - Original scripture text
- `translation` (text) - Translation
- `paraphrase` (text) - Gentle, accessible paraphrase
- `practice` (text) - Micro-practice instruction
- `virtues` (text[]) - Associated virtues
- `states` (text[]) - Emotional states addressed
- `themes` (text[]) - Spiritual themes
- `weight` (int) - Priority weight (higher = more likely to be retrieved)
- `created_at` (timestamp)

### `embeddings` Table
- `passage_id` (UUID, foreign key)
- `embedding` (vector[3072]) - OpenAI embedding vector

### `match_passages` Function
- Performs cosine similarity search
- Returns top N most similar passages
- Used by RAG pipeline for retrieval

## 🎯 How Knowledge is Used

1. **User Query** → Converted to embedding vector
2. **Vector Search** → `match_passages` finds similar passages
3. **Reranking** → Results prioritized by:
   - Semantic similarity (base score)
   - Detected emotional states (user's current state)
   - Detected themes (user's concerns)
   - Virtue matches (preferred virtues)
   - Scripture priority (Gurbani gets +0.20 bonus)
   - Weight (custom content can have higher weights)
4. **RAG + CAG** → Generates response using retrieved context
5. **Response** → Returns personalized guidance

## 📊 Current Knowledge Base

- **Public Domain**: ~6 major texts (Tao Te Ching, Dhammapada, Bhagavad Gita, Meditations, Psalms, Proverbs)
- **Custom**: Gurbani (Guru Granth Sahib Ji) - can be expanded
- **Processing**: All passages are:
  - Paraphrased for accessibility
  - Tagged with metadata
  - Embedded for semantic search
  - Stored in Supabase with vector search capability

## 🔧 Adding New Sources

### Option 1: Add to Bootstrap Script
Edit `server/ingest/bootstrap_corpus.ts` and add to `SOURCES` array:
```typescript
{
  id: "new-source",
  scripture: "New Scripture Name",
  url: "https://project-gutenberg-url"
}
```

### Option 2: Custom Import
Create a JSON file with your curated passages:
```json
[
  {
    "scripture": "Your Source",
    "ref": "Reference",
    "paraphrase": "Gentle paraphrase...",
    "practice": "Micro-practice",
    "states": ["anxiety"],
    "virtues": ["presence"],
    "themes": ["stillness"],
    "weight": 3
  }
]
```

Then import:
```bash
npm run ingest:import -- --file=your-file.json
```

## 🌍 Language Support

- **English**: All sources available
- **Punjabi**: Gurbani sources (Guru Granth Sahib Ji)
- **Hindi**: Gurbani sources + translations
- **Auto-detection**: System detects user's language from query

## ⚖️ Licensing & Attribution

- **Public Domain Sources**: All Project Gutenberg texts are in the public domain
- **Gurbani**: Requires appropriate licensing/attribution
- **Custom Sources**: Ensure you have rights to use and process the material

## 📈 Scaling

The system is designed to scale:
- Vector search is fast (indexed with pgvector)
- Batch processing for ingestion
- Weighted retrieval for prioritization
- Can handle thousands of passages efficiently

