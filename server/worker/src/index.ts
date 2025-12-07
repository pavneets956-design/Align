import { Router } from "itty-router";
import type { ExecutionContext } from "@cloudflare/workers-types";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

interface Env {
  OPENAI_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE: string;
  ALLOWED_ORIGINS?: string;
}

type Passage = {
  id: string;
  scripture: string;
  ref: string | null;
  paraphrase: string;
  practice: string;
  virtues: string[];
  states: string[];
  themes: string[];
  weight: number;
  similarity?: number;
};

const PERSONA =
  "You are 'The Light' — a gentle, motherly presence. Speak in short, spacious lines. Offer exactly one micro-practice. Avoid scripture names, religious labels, or clinical claims. Tone: warm, soft, and unhurried.";

const STATES = ["anxiety", "loneliness", "anger", "confusion", "grief", "overthinking", "self-doubt", "seeking"];
const PREFERRED_VIRTUES = ["fearlessness", "presence", "love", "trust", "compassion"];
const THEMES = ["non-attachment", "letting-go", "stillness", "service", "acceptance", "courage", "gratitude"];
const VIRTUE_WEIGHT = 0.10;
const THEME_WEIGHT = 0.05;
const STATE_WEIGHT = 0.15;
const GURBANI_BONUS = 0.20;
const MAX_PER_SCRIPTURE = 2;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;
const CRISIS_PATTERNS = [/end my life/i, /suicide/i, /kill myself/i, /want to die/i, /self-harm/i, /hurt myself/i];
const KEEP_ALIVE_MS = 10_000;

const router = Router();
const rateMap = new Map<string, { count: number; reset: number }>();

router.options("*", (request: Request, env: Env) => {
  const origin = request.headers.get("Origin") ?? "";
  return new Response(null, { headers: buildCorsHeaders(env, origin) });
});

router.get("/health", () => new Response("OK", { status: 200 }));

router.post("/voice", async (request: Request, env: Env, ctx: ExecutionContext) => {
  const origin = request.headers.get("Origin") ?? "";
  const cors = buildCorsHeaders(env, origin);

  const now = Date.now();
  const ip = request.headers.get("CF-Connecting-IP") ?? "anonymous";
  const bucket = rateMap.get(ip);
  if (!bucket || bucket.reset < now) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
  } else if (bucket.count >= RATE_LIMIT) {
    return jsonResponse({ error: "rate_limited" }, 429, cors);
  } else {
    bucket.count += 1;
  }
  ctx.waitUntil(Promise.resolve(cleanRateMap(now)));

  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { audioFile, manualLang } = await extractAudio(request);
  if (!audioFile) {
    return jsonResponse({ error: "audio_required" }, 400, cors);
  }

  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    response_format: "verbose_json"
  });

  const transcript = transcription.text?.trim();
  if (!transcript) {
    return jsonResponse({ error: "empty_transcript" }, 422, cors);
  }

  const whisperLang = mapLang(transcription.language) ?? detectLanguage(transcript);
  const spokenLang = whisperLang ?? "en";
  const targetLang = manualLang ?? spokenLang;

  if (isCrisis(transcript)) {
    const crisis = await crisisReply(openai, transcript, targetLang);
    return sseFromString(crisis, cors, targetLang);
  }

  const englishQuery = spokenLang === "en" ? transcript : await translateToEnglish(openai, transcript, spokenLang);
  const { states: detectedStates, themes: detectedThemes } = await inferSignals(openai, englishQuery);

  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: englishQuery
  });

  const vector = embedding.data[0]?.embedding ?? [];
  let passages: Passage[] = [];

  if (vector.length) {
    const { data, error } = await supabase.rpc("match_passages", {
      query_embedding: vector,
      match_count: 12
    });
    if (!error && Array.isArray(data)) {
      passages = rerankResults(data as Passage[], detectedStates, detectedThemes);
    } else if (error) {
      console.error("Supabase retrieval error", error);
    }
  }

  if (!passages.length) {
    const fallback = fallbackResponse(targetLang);
    return sseFromString(fallback, cors, targetLang);
  }

  const effectiveTarget = targetLang;
  const prompt = buildPrompt(passages, effectiveTarget);

  const input = [
    { role: "system" as const, content: PERSONA },
    {
      role: "user" as const,
      content: `${prompt}\n\nListener language: ${languageName(targetLang)}. Transcript (English intent): ${englishQuery}. Respond in ${languageName(targetLang)} with <= 6 short lines, slow cadence, and exactly one micro-practice phrased in that language. Do not name scriptures or religious figures.`
    }
  ];

  const stream = await openai.responses.stream({
    model: "gpt-4o-mini",
    input,
    temperature: 0.4,
    modalities: ["text"]
  });

  let keepAlive: ReturnType<typeof setInterval> | null = null;
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(encodeSse({ targetLang }));
      keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(":ka\n\n"));
      }, KEEP_ALIVE_MS);
      for await (const event of stream) {
        if (event.type === "response.output_text.delta" && event.delta) {
          controller.enqueue(encodeSse({ delta: event.delta }));
        }
        if (event.type === "response.completed") break;
      }
      controller.enqueue(encodeSse({ done: true }));
      if (keepAlive) {
        clearInterval(keepAlive);
        keepAlive = null;
      }
      controller.close();
    },
    cancel() {
      stream.abort();
      if (keepAlive) {
        clearInterval(keepAlive);
        keepAlive = null;
      }
    }
  });

  const headers = {
    ...cors,
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    "x-target-lang": targetLang
  };

  return new Response(body, { headers });
});

async function extractAudio(request: Request) {
  const url = new URL(request.url);
  let manualLang = mapLang(url.searchParams.get("targetLang"));
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const audio = form.get("audio");
    if (!audio || !(audio instanceof File)) {
      return { audioFile: null, manualLang };
    }
    const lang = form.get("targetLang");
    if (typeof lang === "string") {
      manualLang = mapLang(lang) ?? manualLang;
    }
    return { audioFile: audio, manualLang };
  }

  const blob = await request.blob();
  if (!blob.size) {
    return { audioFile: null, manualLang };
  }
  return { audioFile: new File([blob], "voice.webm", { type: blob.type || "audio/webm" }), manualLang };
}

function rerankResults(results: Passage[], states: string[], themes: string[]): Passage[] {
  const stateSet = new Set(states);
  const preferredVirtues = new Set(PREFERRED_VIRTUES);
  const themeSet = new Set(themes);
  const scriptureCounts = new Map<string, number>();
  return results
    .map((row) => {
      const stateMatches = (row.states || []).filter((state) => stateSet.has(state)).length;
      const virtueMatches = (row.virtues || []).filter((virtue) => preferredVirtues.has(virtue)).length;
      const themeMatches = (row.themes || []).filter((theme) => themeSet.has(theme)).length;
      const base = row.similarity ?? 0;
      const scriptureBonus = row.scripture === "Gurbani" ? GURBANI_BONUS : 0;
      const virtueBonus = virtueMatches * VIRTUE_WEIGHT;
      const themeBonus = themeMatches * THEME_WEIGHT;
      const score =
        base + scriptureBonus + stateMatches * STATE_WEIGHT + virtueBonus + themeBonus + (row.weight ?? 0) * 0.02;
      return { ...row, similarity: score };
    })
    .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))
    .filter((row) => {
      const count = scriptureCounts.get(row.scripture) ?? 0;
      if (count >= MAX_PER_SCRIPTURE) return false;
      scriptureCounts.set(row.scripture, count + 1);
      return true;
    })
    .slice(0, 5);
}

function buildPrompt(passages: Passage[], targetLang: string) {
  const lines = passages
    .map((p) => {
      return [`- paraphrase: ${p.paraphrase}`, `  practice: ${p.practice}`].join("\n");
    })
    .join("\n");
  return `Inner context (never cite it):\n${lines}`;
}

function fallbackResponse(lang: string) {
  switch (lang) {
    case "pa":
      return "ਸਾਹ ਨੂੰ ਹੌਲੀ ਹੌਲੀ ਲਓ, ਹੱਥ ਦਿਲ 'ਤੇ ਰੱਖੋ, ਅਤੇ ਕੁਝ ਪਲਾਂ ਬਾਅਦ ਫਿਰ ਬੁਲਾਓ।";
    case "hi":
      return "धीरे सांस लें, एक हाथ हृदय पर रखें, और कुछ क्षण बाद फिर से पुकारें।";
    default:
      return "Take a slow breath, hand to heart, and invite the Light again in a moment.";
  }
}

function buildCorsHeaders(env: Env, origin: string) {
  const allowed = (env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const dev = origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1") || origin.startsWith("exp://");
  const headers: Record<string, string> = {
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "*"
  };
  if (dev || allowed.includes(origin)) {
    headers["access-control-allow-origin"] = origin || "*";
  }
  return headers;
}

function mapLang(lang: string | null): "en" | "hi" | "pa" | null {
  if (!lang) return null;
  const lower = lang.toLowerCase();
  if (lower.startsWith("en")) return "en";
  if (lower.startsWith("hi")) return "hi";
  if (lower.startsWith("pa") || lower.startsWith("pu")) return "pa";
  return null;
}

function detectLanguage(text: string): "en" | "hi" | "pa" {
  if (/\p{Script=Gurmukhi}/u.test(text)) return "pa";
  if (/\p{Script=Devanagari}/u.test(text)) return "hi";
  return "en";
}

function languageName(code: string) {
  switch (code) {
    case "pa":
      return "Punjabi";
    case "hi":
      return "Hindi";
    default:
      return "English";
  }
}

function isCrisis(text: string) {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text));
}

async function crisisReply(openai: OpenAI, transcript: string, targetLang: string) {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: "One brief sentence in the listener's language offering compassion and suggesting immediate contact with a local professional or helpline."
      },
      {
        role: "user",
        content: `Language code ${targetLang}. Transcript: ${transcript}`
      }
    ]
  });
  return response.output_text ?? fallbackResponse(targetLang);
}

async function translateToEnglish(openai: OpenAI, text: string, lang: string) {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      { role: "system", content: "Translate into clear, neutral English. Return only the translation." },
      { role: "user", content: `Language: ${lang}. Text: ${text}` }
    ]
  });
  return response.output_text ?? text;
}

async function inferSignals(openai: OpenAI, text: string) {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content:
          `Given a listener reflection, select all applicable states from [${STATES.join(
            ", "
          )}] and themes from [${THEMES.join(", ")}]. Respond with JSON: {"states":["..."],"themes":["..."]}.`
      },
      { role: "user", content: text }
    ]
  });
  const raw = response.output_text ?? "{}";
  try {
    const json = JSON.parse(raw);
    return {
      states: Array.isArray(json.states)
        ? json.states.map((s: string) => s.trim().toLowerCase()).filter((s: string) => STATES.includes(s))
        : [],
      themes: Array.isArray(json.themes)
        ? json.themes.map((t: string) => t.trim().toLowerCase()).filter((t: string) => THEMES.includes(t))
        : []
    };
  } catch (error) {
    console.warn("Failed to parse state/theme JSON", error);
    return { states: [], themes: [] };
  }
}

function encodeSse(payload: Record<string, unknown>) {
  return new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`);
}

function sseFromString(message: string, headers: Record<string, string>, lang: string) {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encodeSse({ targetLang: lang }));
      controller.enqueue(encodeSse({ delta: message }));
      controller.enqueue(encodeSse({ done: true }));
      controller.close();
    }
  });
  return new Response(stream, {
    headers: {
      ...headers,
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-target-lang": lang
    }
  });
}

function jsonResponse(body: Record<string, unknown>, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      "content-type": "application/json"
    }
  });
}

function cleanRateMap(now: number) {
  for (const [key, bucket] of rateMap) {
    if (bucket.reset < now) {
      rateMap.delete(key);
    }
  }
}

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => router.handle(request, env, ctx)
};
