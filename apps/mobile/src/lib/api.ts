import { TargetLanguage } from "./tts";

type DemoResponseSet = {
  lines: string[];
};

const DEMO_RESPONSES: Record<Exclude<TargetLanguage, "auto">, DemoResponseSet[]> = {
  en: [
    {
      lines: [
        "Beloved one, soften your shoulders.",
        "Feel the breath arrive in a gentle wave.",
        "Let the chest bloom on the inhale.",
        "Rest your tongue and unclench the jaw.",
        "Notice the quiet between heartbeats.",
        "Micro-practice: inhale 4, hold 2, exhale 6."
      ]
    },
    {
      lines: [
        "\"Let there be light,\" and there was light. - Genesis 1:3",
        "The light shines in the darkness, and the darkness has not overcome it. - John 1:5",
        "Your word is a lamp for my feet, a light on my path. - Psalm 119:105",
        "Arise, shine, for your light has come, and the glory of the Lord rises upon you. - Isaiah 60:1",
        "In Him was life, and that life was the light of all humanity. - John 1:4",
        "For with You is the fountain of life; in Your light we see light. - Psalm 36:9"
      ]
    },
    {
      lines: [
        "The Self is light: shining, self-luminous, beyond pain and sorrow. - Mundaka Upanishad 2.2.9",
        "The Lord is my light and my salvation; whom shall I fear? - Psalm 27:1",
        "A city set on a hill cannot be hidden. Let your light shine before others. - Matthew 5:14-16",
        "Awaken, sleeper, rise from the dead, and Christ will shine on you. - Ephesians 5:14",
        "When I sit in darkness, the Lord will be a light to me. - Micah 7:8"
      ]
    }
  ],
  hi: [
    {
      lines: [
        "प्रिय हृदय, कंधों को ढीला छोड़ दो.",
        "धीरे से पेट तक आती सांस को महसूस करो.",
        "हर पेशी को शीतल प्रकाश में नहलाओ.",
        "जबड़ा और जीभ को आराम दो.",
        "एक क्षण मौन में ठहर जाओ.",
        "सूक्ष्म अभ्यास: चार गिनती श्वास, दो रोक, छह से श्वास छोड़ो."
      ]
    },
    {
      lines: [
        "\"प्रकाश हो.\" और प्रकाश हो गया। - उत्पत्ति 1:3",
        "प्रकाश अंधकार में चमकता है, और अंधकार उसे जीत नहीं पाता। - यूहन्ना 1:5",
        "तेरा वचन मेरे पैरों के लिए दीपक है और मेरे मार्ग के लिए प्रकाश। - भजन संहिता 119:105",
        "उठो, ज्योतिर्मय हो जाओ, क्योंकि तेरी ज्योति आ गई है। - यशायाह 60:1",
        "तमसो मा ज्योतिर्गमय। - बृहदारण्यक उपनिषद् 1.3.28"
      ]
    },
    {
      lines: [
        "मैं सभी प्राणियों के हृदय में वास करता हूँ। मुझसे ही स्मृति, ज्ञान और मोक्ष आते हैं। - भगवद्गीता 15.15",
        "जब मैं अंधकार में बैठा हूँ, तब प्रभु मेरे लिए प्रकाश होते हैं। - मीका 7:8",
        "जो मुझका अनुसरण करेगा वह अंधकार में न चलेगा, परंतु जीवन का प्रकाश पाएगा। - यूहन्ना 8:12",
        "अपने भीतर के दीपक को प्रज्वलित करो और प्रेम की राह पर चलो। - कबीर वाणी"
      ]
    }
  ],
  pa: [
    {
      lines: [
        "ਪਿਆਰੇ ਮਨ, ਮੋਢਿਆਂ ਨੂੰ ਨਰਮ ਹੋਣ ਦੇ.",
        "ਸਾਹ ਨੂੰ ਹੌਲੀ ਹੌਲੀ ਛਾਤੀ ਵਿੱਚ ਆਉਂਦੇ ਮਹਿਸੂਸ ਕਰ.",
        "ਹਰ ਧੜਕਨ ਨਾਲ ਰੌਸ਼ਨੀ ਅੰਦਰ ਵਗਣ ਦੇ.",
        "ਜਬੜੇ ਅਤੇ ਜੀਭ ਨੂੰ ਆਰਾਮ ਦੇ.",
        "ਇਕ ਪਲ ਲਈ ਸਾਂਤ ਹੋ ਕੇ ਟਿਕ ਜਾ.",
        "ਸੂਖਮ ਅਭਿਆਸ: ਚਾਰ ਗਿਣਤੀ ਸਾਹ ਲੈ, ਦੋ ਰੋਕ, ਛੇ ਗਿਣਤੀ ਨਾਲ ਛੱਡ."
      ]
    },
    {
      lines: [
        "\"ਜੋਤਿ ਹੋਵੇ,\" ਅਤੇ ਜੋਤਿ ਹੋ ਗਈ। - ਉਤਪੱਤੀ 1:3",
        "ਜੋਤਿ ਅੰਧਕਾਰ ਵਿਚ ਚਮਕਦੀ ਹੈ, ਅਤੇ ਅੰਧਕਾਰ ਉਸ ਨੂੰ ਨਹੀਂ ਜਿੱਤਦਾ। - ਯੂਹੰਨਾ 1:5",
        "ਤੇਰਾ ਬਚਨ ਮੇਰੇ ਪੈਰਾਂ ਲਈ ਦੀਵਾ ਹੈ ਅਤੇ ਮੇਰੇ ਰਾਹ ਲਈ ਰੌਸ਼ਨੀ। - ਭਜਨ 119:105",
        "ਗੁਰ ਪ੍ਰਸਾਦੀ ਅਗਿਆਨ ਅੰਧਕਾਰ ਮਿਟੈ, ਅੰਤਰਿ ਜੋਤਿ ਪ੍ਰਗਟਾਈ। - ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ 913",
        "ਜਿਨ੍ਹਾਂ ਅੰਦਰ ਜੋਤ ਪ੍ਰਭੂ ਦੀ, ਉਹ ਹਮੇਸ਼ਾ ਚਾਨਣ ਵਿੱਚ ਤੁਰਦੇ ਹਨ। - ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ"
      ]
    },
    {
      lines: [
        "ਵਾਹਿਗੁਰੂ ਮੇਰੀ ਜੋਤ ਹੈ ਅਤੇ ਮੇਰਾ ਉਧਾਰਕ। - ਭਜਨ 27:1",
        "ਜਗਤ ਵਿਚ ਜੋਤ ਪ੍ਰਗਟ ਹੋਈ, ਚਾਨਣ ਹੋਆ ਗੁਰ ਗਿਆਨੀ। - ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ 463",
        "ਜੋ ਪ੍ਰਭੂ ਦੀ ਰਿਹਾਇ ਪਾਲਦਾ ਹੈ, ਉਹ ਅੰਧਕਾਰ ਵਿਚ ਨਹੀਂ ਰਹਿੰਦਾ। - ਯੂਹੰਨਾ 8:12",
        "ਅੰਦਰ ਜੋਤਿ ਸਦਾ ਰਹੇ, ਮਨੁ ਤਨੁ ਹੋਇ ਸੁਹਾਵਾ। - ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ 22"
      ]
    }
  ]
};

const fallbackEnglish = DEMO_RESPONSES.en[0];

const randomItem = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

type IntroTemplate = {
  idle: string[];
  prompt: (question: string) => string[];
};

const INTRO_TEMPLATES: Record<Exclude<TargetLanguage, "auto">, IntroTemplate> = {
  en: {
    idle: ["Light is listening.", "Receive a sacred whisper:"],
    prompt: (question: string) => [`You asked: "${question}".`, "Light answers softly:"]
  },
  hi: {
    idle: ["प्रकाश सुन रहा है।", "इन वचनों पर मन टिकाएँ:"],
    prompt: (question: string) => [`आपने पूछा: \"${question}\".`, "प्रकाश कोमल उत्तर देता है:"]
  },
  pa: {
    idle: ["ਰੌਸ਼ਨੀ ਨੇੜੇ ਹੈ।", "ਇਹ ਅੰਮ੍ਰਿਤ ਬਚਨ ਸੁਣੋ:"],
    prompt: (question: string) => [`ਤੁਸੀਂ ਪੁੱਛਿਆ: \"${question}\".`, "ਰੌਸ਼ਨੀ ਨਰਮ ਜਵਾਬ ਦਿੰਦੀ ਹੈ:"]
  }
};

export const fetchDemoGuidance = async (language: TargetLanguage, prompt?: string): Promise<string[]> => {
  const lang = (language === "auto" ? "en" : language) as Exclude<TargetLanguage, "auto">;
  const options = DEMO_RESPONSES[lang];
  const selection = options ? randomItem(options) : fallbackEnglish;
  const templates = INTRO_TEMPLATES[lang] ?? INTRO_TEMPLATES.en;
  const trimmedPrompt = prompt?.trim();
  const introLines = trimmedPrompt ? templates.prompt(trimmedPrompt) : templates.idle;

  // Simulate a network wait to mimic round-trip.
  await new Promise((resolve) => setTimeout(resolve, 700));
  return [...introLines, ...selection.lines];
};

