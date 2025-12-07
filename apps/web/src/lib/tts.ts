export type TargetLanguage = "auto" | "pa" | "hi" | "en";

const VOICE_MAP: Record<Exclude<TargetLanguage, "auto">, string[]> = {
  pa: ["pa-IN", "pa-IN-language", "en-US"],
  hi: ["hi-IN", "en-US"],
  en: ["en-US"]
};

let speechSynthesis: SpeechSynthesis | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

const ensureVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined') return [];
  
  if (!speechSynthesis) {
    speechSynthesis = window.speechSynthesis;
  }
  
  if (cachedVoices.length === 0) {
    cachedVoices = speechSynthesis.getVoices();
    
    // If voices aren't loaded yet, wait for the voiceschanged event
    if (cachedVoices.length === 0) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        cachedVoices = speechSynthesis!.getVoices();
      }, { once: true });
    }
  }
  
  return cachedVoices;
};

const resolveLanguage = (voice: SpeechSynthesisVoice | null, target: TargetLanguage): string => {
  if (voice?.lang) {
    return voice.lang;
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

const pickVoice = (target: TargetLanguage): SpeechSynthesisVoice | null => {
  if (target === "auto") {
    return null;
  }
  const voices = ensureVoices();
  const preferences = VOICE_MAP[target] ?? ["en-US"];
  
  for (const pref of preferences) {
    const match = voices.find(
      (voice) => voice.lang?.toLowerCase() === pref.toLowerCase() || 
                 voice.name?.toLowerCase().includes(pref.toLowerCase())
    );
    if (match) {
      return match;
    }
  }

  return null;
};

export const speakSacred = async (text: string, target: TargetLanguage) => {
  if (typeof window === 'undefined') return;
  if (!text?.trim()) return;

  const voice = pickVoice(target);
  let speakLanguage = resolveLanguage(voice, target);

  // Stop any ongoing speech
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speakLanguage;
  utterance.voice = voice;
  utterance.pitch = 0.9;
  utterance.rate = 0.95;
  utterance.volume = 1.0;

  if (!voice && target !== "en" && target !== "auto") {
    // First speak a notice, then the actual text
    const notice = new SpeechSynthesisUtterance("Punjabi or Hindi voice not installed; speaking in English.");
    notice.lang = "en-US";
    notice.pitch = 0.9;
    notice.rate = 0.95;
    notice.volume = 1.0;
    
    notice.onend = () => {
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    };
    
    window.speechSynthesis.speak(notice);
  } else {
    window.speechSynthesis.speak(utterance);
  }
};

export const stopSpeaking = () => {
  if (typeof window === 'undefined') return;
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

