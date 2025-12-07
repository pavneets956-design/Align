export type ThemeKey = "underStars" | "mountainSummit" | "aboveClouds" | "oceanNight";

export interface ThemeMeta {
  key: ThemeKey;
  label: string;
  description: string;
}

export const THEME_SEQUENCE: ThemeMeta[] = [
  {
    key: "underStars",
    label: "Under Stars",
    description: "Deep cosmos with gentle twinkles."
  },
  {
    key: "mountainSummit",
    label: "Mountain Summit",
    description: "Pre-dawn glow over a distant silhouette."
  },
  {
    key: "aboveClouds",
    label: "Above the Clouds",
    description: "Soft aurora drifting across high skies."
  },
  {
    key: "oceanNight",
    label: "Ocean Night",
    description: "Moonlit water shimmering in stillness."
  }
];

export const getNextTheme = (current: ThemeKey): ThemeKey => {
  const index = THEME_SEQUENCE.findIndex((t) => t.key === current);
  if (index === -1) return THEME_SEQUENCE[0].key;
  return THEME_SEQUENCE[(index + 1) % THEME_SEQUENCE.length].key;
};

