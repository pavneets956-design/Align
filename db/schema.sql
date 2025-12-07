create extension if not exists "uuid-ossp";
create extension if not exists vector;

create table if not exists passages (
    id uuid primary key default gen_random_uuid(),
    scripture text not null,
    ref text,
    original text not null,
    translation text not null,
    paraphrase text not null,
    virtues text[] default array[]::text[],
    states text[] default array[]::text[],
    themes text[] default array[]::text[],
    practice text not null,
    weight int default 1,
    created_at timestamptz default now()
);

create table if not exists embeddings (
    passage_id uuid primary key references passages(id) on delete cascade,
    embedding vector(3072) not null
);

create index if not exists passages_states_idx on passages using gin (states);
create index if not exists passages_virtues_idx on passages using gin (virtues);
create index if not exists passages_themes_idx on passages using gin (themes);
create index if not exists passages_weight_idx on passages(weight);
create index if not exists embeddings_cosine_idx on embeddings using ivfflat (embedding vector_cosine_ops) with (lists = 200);

create or replace function match_passages(
  query_embedding vector(3072),
  match_count int default 20
)
returns table (
  id uuid,
  scripture text,
  ref text,
  paraphrase text,
  practice text,
  virtues text[],
  states text[],
  themes text[],
  weight int,
  similarity float4
) as 
  select
    p.id,
    p.scripture,
    p.ref,
    p.paraphrase,
    p.practice,
    p.virtues,
    p.states,
    p.themes,
    p.weight,
    1 - (e.embedding <=> query_embedding) as similarity
  from embeddings e
  join passages p on p.id = e.passage_id
  where query_embedding is not null
  order by e.embedding <=> query_embedding
  limit match_count;
 language sql stable;
