import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const INPUT_FILE = path.join(DATA_DIR, "bootstrap.jsonl");

const STATES = ["anxiety", "loneliness", "anger", "confusion", "grief", "seeking", "overthinking", "self-doubt"];
const VIRTUES = ["fearlessness", "love", "presence", "surrender", "trust", "compassion", "discipline", "clarity", "joy"];
const THEMES = ["non-attachment", "letting-go", "stillness", "service", "acceptance", "courage", "gratitude"];

const openai = new OpenAI({ apiKey: required("OPENAI_API_KEY") });
const supabase = createClient(required("SUPABASE_URL"), required("SUPABASE_SERVICE_ROLE"), {
  auth: { persistSession: false, autoRefreshToken: false }
});

const BATCH_SIZE = Math.max(1, Number(process.env.INGEST_BATCH ?? "8"));

const recordSchema = z.object({
  scripture: z.string(),
  ref: z.string().optional().nullable(),
  original: z.string(),
  translation: z.string(),
  paraphrase: z.string().optional().nullable(),
  virtues: z.array(z.string()).optional().default([]),
  states: z.array(z.string()).optional().default([]),
  themes: z.array(z.string()).optional().default([]),
  practice: z.string().optional().nullable(),
  weight: z.number().int().optional().default(1)
});

type IngestRecord = z.infer<typeof recordSchema>;
type PreparedRecord = IngestRecord & {
  paraphrase: string;
  practice: string;
  virtues: string[];
  states: string[];
  themes: string[];
};

(async () => {
  const rawLines = await loadLines(INPUT_FILE);
  console.log(`Loaded ${rawLines.length} passages from bootstrap file`);

  for (let i = 0; i < rawLines.length; i += BATCH_SIZE) {
    const slice = rawLines.slice(i, i + BATCH_SIZE);
    const parsed = slice.map((line) => recordSchema.parse(JSON.parse(line)));
    const enriched = await Promise.all(parsed.map(enrichRecord));
    for (const record of enriched) {
      await upsert(record);
    }
    console.log(`Processed ${Math.min(i + BATCH_SIZE, rawLines.length)} / ${rawLines.length}`);
  }

  console.log("Ingestion complete");
})();

async function loadLines(filePath: string) {
  const exists = await fs.access(filePath).then(() => true).catch(() => false);
  if (!exists) throw new Error(`Bootstrap file not found at ${filePath}`);
  return (await fs.readFile(filePath, "utf-8")).split(/\r?\n/).filter(Boolean);
}

async function enrichRecord(record: IngestRecord): Promise<PreparedRecord> {
  const hasMetadata = Boolean(record.paraphrase && record.practice);
  if (hasMetadata) {
    return {
      ...record,
      paraphrase: record.paraphrase!.trim(),
      practice: record.practice!.trim(),
      virtues: normalizeTags(record.virtues, VIRTUES),
      states: normalizeTags(record.states, STATES),
      themes: normalizeTags(record.themes, THEMES)
    } as PreparedRecord;
  }

  const analysis = await describePassage(record.original);
  return {
    ...record,
    paraphrase: analysis.paraphrase,
    practice: analysis.practice,
    virtues: analysis.virtues,
    states: analysis.states,
    themes: analysis.themes
  } as PreparedRecord;
}

async function describePassage(original: string) {
  const prompt = `You are enriching a public-domain spiritual excerpt.
Return valid JSON with keys:
  paraphrase: <= 3 short sentences, plain gentle English.
  practice: one line micro-practice (breath/body focus).
  states: up to three items from ${STATES.join(", ")}.
  virtues: up to three items from ${VIRTUES.join(", ")}.
  themes: up to three items from ${THEMES.join(", ")}.
Original passage:\n${original}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: "Respond with JSON only." },
      { role: "user", content: prompt }
    ]
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  try {
    const parsed = JSON.parse(content);
    return {
      paraphrase: String(parsed.paraphrase ?? original.slice(0, 280)).trim(),
      practice: String(parsed.practice ?? "Notice your breathing for three cycles.").trim(),
      states: normalizeTags(parsed.states, STATES),
      virtues: normalizeTags(parsed.virtues, VIRTUES),
      themes: normalizeTags(parsed.themes, THEMES)
    };
  } catch (error) {
    console.warn("Failed to parse JSON description, using fallback", error);
    return {
      paraphrase: original.slice(0, 280).trim(),
      practice: "Notice your breathing for three cycles.",
      states: [],
      virtues: [],
      themes: []
    };
  }
}

async function upsert(record: PreparedRecord) {
  const id = deterministicUuid(`${record.scripture}:${record.ref ?? ""}:${record.original}`);
  const embeddingInput = `${record.paraphrase}\nPractice: ${record.practice}`.trim();
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: embeddingInput
  });
  const vector = embedding.data[0]?.embedding ?? [];

  const { error: passageError } = await supabase
    .from("passages")
    .upsert(
      [
        {
          id,
          scripture: record.scripture,
          ref: record.ref ?? null,
          original: record.original,
          translation: record.translation,
          paraphrase: record.paraphrase,
          virtues: record.virtues,
          states: record.states,
          themes: record.themes,
          practice: record.practice,
          weight: record.weight ?? 1
        }
      ],
      { onConflict: "id" }
    );

  if (passageError) {
    console.error("Passage upsert error", passageError);
    return;
  }

  const { error: embedError } = await supabase
    .from("embeddings")
    .upsert(
      [
        {
          passage_id: id,
          embedding: vector
        }
      ],
      { onConflict: "passage_id" }
    );

  if (embedError) {
    console.error("Embedding upsert error", embedError);
  }
}

function normalizeTags(values: unknown, allowed: string[]) {
  if (!values) return [];
  const list = Array.isArray(values) ? values : String(values).split(/[,;\n]+/);
  return list
    .map((v) => v.toString().trim().toLowerCase())
    .filter((v) => allowed.includes(v));
}

function deterministicUuid(input: string) {
  const hash = crypto.createHash("sha1").update(`talking-light:${input}`).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const bytes = Array.from(hash.slice(0, 16));
  const hex = bytes.map((b) => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}

function required(key: string) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var ${key}`);
  return value;
}
