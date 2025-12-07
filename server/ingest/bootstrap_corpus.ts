import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fetch from "node-fetch";

// Public domain sources used in v1 corpus
// Tao Te Ching - James Legge: https://www.gutenberg.org/cache/epub/216/pg216.txt
// Dhammapada - F. Max Muller: https://www.gutenberg.org/cache/epub/2017/pg2017.txt
// Bhagavad Gita (Song Celestial) - Sir Edwin Arnold: https://www.gutenberg.org/cache/epub/2388/pg2388.txt
// Meditations - Marcus Aurelius (trans. George Long): https://www.gutenberg.org/cache/epub/2680/pg2680.txt
// Bible (KJV) - Psalms & Proverbs: https://www.gutenberg.org/cache/epub/10/pg10.txt

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const OUTPUT_FILE = path.join(DATA_DIR, "bootstrap.jsonl");

const MIN_CHARS = 200;
const MAX_CHARS = 400;
const OVERLAP_CHARS = 50;

interface PublicSource {
  id: string;
  scripture: string;
  url: string;
  filter?: (text: string) => string;
}

interface CorpusRecord {
  scripture: string;
  ref: string;
  original: string;
  translation: string;
  paraphrase: string;
  virtues: string[];
  states: string[];
  themes: string[];
  practice: string;
  weight: number;
}

const SOURCES: PublicSource[] = [
  {
    id: "tao",
    scripture: "Tao Te Ching",
    url: "https://www.gutenberg.org/cache/epub/216/pg216.txt"
  },
  {
    id: "dhammapada",
    scripture: "Dhammapada",
    url: "https://www.gutenberg.org/cache/epub/2017/pg2017.txt"
  },
  {
    id: "gita",
    scripture: "Bhagavad Gita (Song Celestial)",
    url: "https://www.gutenberg.org/cache/epub/2388/pg2388.txt"
  },
  {
    id: "meditations",
    scripture: "Meditations",
    url: "https://www.gutenberg.org/cache/epub/2680/pg2680.txt"
  },
  {
    id: "psalms",
    scripture: "Psalms (KJV)",
    url: "https://www.gutenberg.org/cache/epub/10/pg10.txt",
    filter: (text) => extractBookSection(text, "PSALMS", "PROVERBS")
  },
  {
    id: "proverbs",
    scripture: "Proverbs (KJV)",
    url: "https://www.gutenberg.org/cache/epub/10/pg10.txt",
    filter: (text) => extractBookSection(text, "PROVERBS", "ECCLESIASTES")
  }
];

(async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const handle = await fs.open(OUTPUT_FILE, "w");
  try {
    for (const source of SOURCES) {
      console.log(`Downloading ${source.scripture} ...`);
      const raw = await fetchText(source.url);
      const cleaned = normalizeText(source.filter ? source.filter(raw) : raw);
      const chunks = chunkSource(cleaned, source);
      for (const chunk of chunks) {
        await handle.write(JSON.stringify(chunk) + "\n");
      }
      console.log(`  -> ${chunks.length} chunks`);
    }
  } finally {
    await handle.close();
  }
  console.log(`Bootstrap corpus written to ${OUTPUT_FILE}`);
})();

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

function normalizeText(input: string): string {
  let text = input;
  const start = text.indexOf("*** START OF");
  const end = text.indexOf("*** END OF");
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end);
  }
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[\t\f\r]+/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractBookSection(text: string, startMarker: string, endMarker: string): string {
  const upper = text.toUpperCase();
  const startIdx = upper.indexOf(startMarker);
  const endIdx = upper.indexOf(endMarker, startIdx + startMarker.length);
  if (startIdx === -1) return text;
  return text.slice(startIdx, endIdx !== -1 ? endIdx : text.length);
}

function chunkSource(text: string, source: PublicSource) {
  const records: CorpusRecord[] = [];
  const paragraphs = text.split(/\n\s*\n+/);
  let chunkBuffer = "";
  let chunkId = 1;
  let lastHeading: string | null = null;

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;

    const heading = detectHeading(trimmed);
    if (heading) {
      lastHeading = heading;
      continue;
    }

    const versePieces = splitParagraph(trimmed);
    for (const piece of versePieces) {
      addPiece(piece);
    }
  }

  if (chunkBuffer.trim().length) {
    pushChunk(chunkBuffer.trim());
  }
  return records;

  function addPiece(piece: string) {
    if (!piece) return;
    const candidate = chunkBuffer ? `${chunkBuffer} ${piece}`.trim() : piece.trim();
    if (candidate.length > MAX_CHARS && chunkBuffer.length >= MIN_CHARS) {
      pushChunk(chunkBuffer.trim());
      const overlapTail = chunkBuffer.slice(-OVERLAP_CHARS).trim();
      chunkBuffer = overlapTail ? `${overlapTail} ${piece}`.trim() : piece.trim();
    } else {
      chunkBuffer = candidate;
    }

    if (chunkBuffer.length >= MAX_CHARS) {
      pushChunk(chunkBuffer.trim());
      chunkBuffer = chunkBuffer.slice(-OVERLAP_CHARS).trim();
    }
  }

  function pushChunk(content: string) {
    if (!content || content.length < MIN_CHARS) return;
    const ref = lastHeading ? `${source.scripture} ${lastHeading} - ${chunkId}` : `${source.scripture} ${chunkId}`;
    records.push({
      scripture: source.scripture,
      ref,
      original: content,
      translation: content,
      paraphrase: "",
      virtues: [],
      states: [],
      themes: [],
      practice: "",
      weight: 1
    });
    chunkBuffer = "";
    chunkId += 1;
  }
}

function detectHeading(paragraph: string): string | null {
  const trimmed = paragraph.trim();
  if (/^(CHAPTER|BOOK|PART|SECTION)\b/i.test(trimmed)) return trimmed.split("\n")[0].trim();
  if (/^PSALM\s+\d+/i.test(trimmed)) return trimmed.match(/^PSALM\s+\d+/i)?.[0] ?? trimmed;
  if (/^PROVERBS\s+\d+/i.test(trimmed)) return trimmed.match(/^PROVERBS\s+\d+/i)?.[0] ?? trimmed;
  return null;
}

function splitParagraph(paragraph: string): string[] {
  const lines = paragraph.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  if (lines.length <= 1) {
    return paragraph.split(/(?<=[.!?;:])\s+/).filter(Boolean);
  }
  return lines;
}
