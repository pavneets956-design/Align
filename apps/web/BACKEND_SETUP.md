# Backend Connection Setup

The web app is now connected to your Supabase database with scripture knowledge! Here's how to set it up:

## What Was Added

1. **API Route** (`app/api/guidance/route.ts`):
   - Accepts text queries (instead of audio)
   - Generates embeddings using OpenAI
   - Queries Supabase database for relevant scripture passages
   - Uses RAG (Retrieval Augmented Generation) to provide context-aware responses
   - Generates responses using GPT-4o-mini with scripture context

2. **Updated API Client** (`src/lib/api.ts`):
   - Now calls the real backend API
   - Falls back to demo responses if backend is unavailable

## Setup Steps

### 1. Environment Variables

Create `.env.local` in `apps/web/`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# For API routes (server-side only)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-key
```

### 2. Database Setup

Make sure your Supabase database has:

1. **Schema Applied**: Run `db/schema.sql` in your Supabase SQL editor
   - Creates `passages` table
   - Creates `embeddings` table with vector support
   - Creates `match_passages` function for RAG queries

2. **Data Ingested**: Run the ingestion pipeline
   ```bash
   cd server/ingest
   npm install
   npm run ingest:bootstrap  # Bootstrap public domain sources
   npm run ingest:embed      # Tag, paraphrase, and embed passages
   ```

3. **Verify Data**: Check that you have passages in your database:
   ```sql
   SELECT COUNT(*) FROM passages;
   SELECT COUNT(*) FROM embeddings;
   ```

### 3. Install Dependencies

```bash
cd apps/web
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase client
- `openai` - OpenAI SDK for embeddings and generation

### 4. Test the Connection

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open the app and ask a question
3. Check the browser console and server logs for any errors

## How It Works (RAG + CAG)

1. **User Input**: User types a question or leaves it empty
2. **Embedding**: Query is converted to a vector embedding using OpenAI
3. **RAG Retrieval**: Supabase `match_passages` function finds similar scripture passages
4. **Reranking**: Results are reranked based on:
   - Semantic similarity
   - Detected emotional states (anxiety, grief, etc.)
   - Detected themes (acceptance, courage, etc.)
   - Scripture priority (Gurbani gets bonus)
5. **RAG Generation**: GPT-4o-mini generates an initial response using the retrieved passages as context
6. **CAG Correction**: A corrective step refines the response to ensure:
   - Faithfulness to the retrieved scripture context
   - Consistency with the gentle, motherly persona
   - Appropriate tone and structure
   - Inclusion of exactly one micro-practice
7. **Response**: Returns 6 or fewer lines with a micro-practice

### RAG + CAG Benefits

- **RAG (Retrieval Augmented Generation)**: Retrieves relevant scripture passages and generates context-aware responses
- **CAG (Corrective Augmented Generation)**: Refines the initial response to ensure it's faithful to the source material and maintains consistency
- This two-stage approach improves accuracy, reduces hallucinations, and ensures responses stay true to the wisdom context

## Fallback Behavior

If the backend is not configured or fails:
- The app gracefully falls back to demo responses
- No errors are shown to the user
- The app continues to work with sample data

## Troubleshooting

### "Failed to fetch from API"
- Check that environment variables are set correctly
- Verify Supabase URL and keys are correct
- Check that the database schema is applied
- Ensure you have passages in the database

### "Supabase retrieval error"
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set (not anon key)
- Check that `match_passages` function exists in your database
- Verify vector extension is enabled in Supabase

### "OpenAI API error"
- Check that `OPENAI_API_KEY` is set correctly
- Verify you have API credits available
- Check rate limits

### No passages returned
- Run the ingestion pipeline to populate the database
- Check that embeddings were generated: `SELECT COUNT(*) FROM embeddings;`
- Verify the `match_passages` function is working

## Next Steps

1. **Populate Database**: Use the ingestion pipeline to add more scriptures
2. **Customize Responses**: Adjust the `PERSONA` constant in the API route
3. **Add More Languages**: Extend language support in the API
4. **Monitor Usage**: Set up logging/monitoring for API calls

## Production Deployment

For production:
1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Use production Supabase project
3. Consider adding rate limiting
4. Set up error monitoring (Sentry, etc.)
5. Add caching for common queries

