import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import "dotenv/config";

const fileArg = process.argv.find((arg) => arg.startsWith("--file="));
if (!fileArg) {
  throw new Error("Usage: npm run ingest:import -- --file=/path/to/custom.json");
}
const filePath = path.resolve(fileArg.replace("--file=", ""));

const openai = new OpenAI({ apiKey: required("OPENAI_API_KEY") });
const supabase = createClient(required("SUPABASE_URL"), required("SUPABASE_SERVICE_ROLE"), {
  auth: { persistSession: false, autoRefreshToken: false }
});

const rowSchema = z.object({
  scripture: z.string(),
  ref: z.string().optional().nullable(),
  paraphrase: z.string(),
  practice: z.string(),
  states: z.array(z.string()).optional().default([]),
  virtues: z.array(z.string()).optional().default([]),
  themes: z.array(z.string()).optional().default([]),
  original: z.string().optional(),
  translation: z.string().optional(),
  weight: z.number().int().optional().default(1)
});

type CustomRow = z.infer<typeof rowSchema>;

(async () => {
  const rows = await loadRows(filePath);
  console.log(`Importing ${rows.length} custom passages from ${filePath}`);
  for (const row of rows) {
    await upsertRow(row);
  }
  console.log("Custom import complete");
})();

async function loadRows(filePath: string): Promise<CustomRow[]> {
  const ext = path.extname(filePath).toLowerCase();
  const raw = await fs.readFile(filePath, "utf-8");
  if (ext === ".json") {
    const parsed = JSON.parse(raw);
    return z.array(rowSchema).parse(parsed.map(normalizeRow));
  }
  if (ext === ".csv") {
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const header = lines.shift();
    if (!header) return [];
    const columns = header.split(",").map((c) => c.trim());
    return lines.map((line) => {
      const cells = line.split(",");
      const record: Record<string, string> = {};
      columns.forEach((col, idx) => {
        record[col] = cells[idx]?.trim() ?? "";
      });
      return rowSchema.parse(normalizeRow(record));
    });
  }
  throw new Error(`Unsupported file extension ${ext}`);
}

function normalizeRow(input: any): CustomRow {
  const parseList = (value: unknown) => {
    if (!value) return [] as string[];
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    return String(value)
      .split(/[,;\n]+/)
      .map((v) => v.trim())
      .filter(Boolean);
  };

  return {
    scripture: String(input.scripture ?? ""),
    ref: input.ref ? String(input.ref).trim() : null,
    paraphrase: String(input.paraphrase ?? "").trim(),
    practice: String(input.practice ?? "").trim(),
    states: parseList(input.states),
    virtues: parseList(input.virtues),
    themes: parseList(input.themes),
    original: input.original ? String(input.original).trim() : undefined,
    translation: input.translation ? String(input.translation).trim() : undefined,
    weight: input.weight ? Number(input.weight) : 1
  };
}

async function upsertRow(row: CustomRow) {
  const originalText = row.original || row.paraphrase;
  const translationText = row.translation || row.paraphrase;

  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: `${row.paraphrase}\nPractice: ${row.practice}`.trim()
  });
  const vector = embedding.data[0]?.embedding ?? [];
  const id = deterministicUuid(`custom:${row.scripture}:${row.ref ?? ""}:${row.paraphrase}`);

  const { error } = await supabase
    .from("passages")
    .upsert(
      [
        {
          id,
          scripture: row.scripture,
          ref: row.ref ?? null,
          original: originalText,
          translation: translationText,
          paraphrase: row.paraphrase,
          virtues: row.virtues,
          states: row.states,
          themes: row.themes,
          practice: row.practice,
          weight: row.weight
        }
      ],
      { onConflict: "id" }
    );

  if (error) {
    console.error("Custom upsert error", error);
    return;
  }

  const { error: embedError } = await supabase
    .from("embeddings")
    .upsert([
      {
        passage_id: id,
        embedding: vector
      }
    ]);

  if (embedError) {
    console.error("Embedding error", embedError);
  }
}

function deterministicUuid(value: string) {
  const hash = crypto.createHash("sha1").update(`talking-light:${value}`).digest();
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
