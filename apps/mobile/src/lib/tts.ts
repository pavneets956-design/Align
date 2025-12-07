import * as Speech from "expo-speech";

export type TargetLanguage = "auto" | "pa" | "hi" | "en";

const VOICE_MAP: Record<Exclude<TargetLanguage, "auto">, string[]> = {
  pa: ["pa-IN", "pa-IN-language", "en-US"],
  hi: ["hi-IN", "en-US"],
  en: ["en-US"]
};

const BASE_OPTIONS = {
  pitch: 0.9,
  rate: 0.95,
  volume: 1.0
};

let cachedVoices: Speech.SpeechVoice[] | null = null;

const ensureVoices = async () => {
  if (!cachedVoices) {
    try {
      cachedVoices = await Speech.getAvailableVoicesAsync();
    } catch {
      cachedVoices = [];
    }
  }
  return cachedVoices ?? [];
};

const resolveLanguage = (voice: Speech.SpeechVoice | null, target: TargetLanguage): string => {
  if (voice?.language) {
    return voice.language;
  }
  switch (target) {
    case "pa":
      return "pa-IN";
    case "hi":
      return "hi-IN";
    default:
      return "en-US";
  }
};

const pickVoice = async (target: TargetLanguage): Promise<Speech.SpeechVoice | null> => {
  if (target === "auto") {
    return null;
  }
  const voices = await ensureVoices();
  const preferences = VOICE_MAP[target] ?? ["en-US"];
  for (const pref of preferences) {
    const match = voices.find(
      (voice) => voice.identifier === pref || voice.language?.toLowerCase() === pref.toLowerCase()
    );
    if (match) {
      return match;
    }
  }

  return null;
};

export const speakSacred = async (text: string, target: TargetLanguage) => {
  if (!text?.trim()) return;

  const voice = await pickVoice(target);
  let speakLanguage = resolveLanguage(voice, target);

  if (!voice && target !== "en" && target !== "auto") {
    await Speech.speak("Punjabi or Hindi voice not installed; speaking in English.", {
      language: "en-US",
      ...BASE_OPTIONS
    });
    speakLanguage = "en-US";
  }

  await Speech.speak(text, {
    ...BASE_OPTIONS,
    language: speakLanguage,
    voice: voice?.identifier
  });
};

export const stopSpeaking = () => {
  Speech.stop();
};

