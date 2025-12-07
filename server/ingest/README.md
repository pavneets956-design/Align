# Ingestion Pipeline

This workspace prepares the TalkingLight scripture corpus for Supabase + pgvector.

## Prerequisites

1. Create a Supabase project.
2. Enable the `vector` extension (Database → Extensions).
3. Run `db/schema.sql` in the Supabase SQL editor or via `npm run ingest:init`.

## Environment

Copy `.env.example` from the repository root and set:

- `OPENAI_API_KEY`
- `SUPABASE_URL` (service URL, e.g. `https://xyz.supabase.co`)
- `SUPABASE_SERVICE_ROLE` (service role key – **ingestion use only**)

Optional tunables:

- `INGEST_BATCH` – number of passages processed concurrently (default 8).

## Scripts

```bash
# 1) Bootstrap the corpus from public-domain sources
npm run ingest:bootstrap

# 2) Tag, paraphrase, embed, and upsert into Supabase
npm run ingest:embed

# 3) (Optional) Import curated/licensed material
npm run ingest:import -- --file=path/to/gurbani_paraphrases.json
```

### Custom import format

`import_custom.ts` accepts JSON or CSV with columns:

```
{
  "scripture": "Guru Granth Sahib Ji",
  "ref": "Ang 1",
  "paraphrase": "English paraphrase...",
  "practice": "Hand on heart.",
  "states": ["grief"],
  "virtues": ["compassion"],
  "themes": ["acceptance"],
  "weight": 5
}
```

`original` and `translation` are optional; when omitted they default to the paraphrase text.

Weights > 1 are useful to prioritize licensed content such as Gurbani or Osho excerpts.

## Output

- `server/ingest/data/bootstrap.jsonl` – intermediate corpus (public domain sources only).
- Supabase tables `passages` + `embeddings` (see `db/schema.sql`).

Delete the `data/` directory between runs if you need a clean slate.
