export type SecondaryMode = "neutral" | "analogous" | "complement";
export type AccentMode = "echo-primary" | "complement" | "distant";

export type Narrative = {
  id: string;
  name: string;
  description: string;
  primary: { chroma: [number, number]; lightness: [number, number] };
  secondary: { chroma: [number, number]; lightness: [number, number]; mode: SecondaryMode };
  accent: { chroma: [number, number]; lightness: [number, number]; mode: AccentMode };
  background: { chroma: [number, number]; lightness: [number, number]; saturated: boolean };
  /** Range of hue degrees added to primary hue when accent.mode === "distant". */
  accentHueOffset: [number, number];
  /** Range of hue degrees added to primary hue when secondary.mode === "analogous". */
  secondaryHueOffset: [number, number];
  preferredFeels?: string[];
  avoidedFeels?: string[];
};

export const NARRATIVES: Narrative[] = [
  {
    id: "monochrome-accent",
    name: "Monochrome + Accent",
    description: "Neutral palette with one saturated color carrying all emphasis.",
    primary: { chroma: [0.14, 0.22], lightness: [0.45, 0.65] },
    secondary: { chroma: [0.0, 0.02], lightness: [0.85, 0.95], mode: "neutral" },
    accent: { chroma: [0.0, 0.03], lightness: [0.8, 0.92], mode: "echo-primary" },
    background: { chroma: [0.0, 0.01], lightness: [0.96, 0.99], saturated: false },
    accentHueOffset: [0, 0],
    secondaryHueOffset: [0, 360],
    avoidedFeels: ["vibrant", "playful", "aurora"],
  },
  {
    id: "dark-signature",
    name: "Dark Signature",
    description: "Dark background with one bold signature color and high text contrast.",
    primary: { chroma: [0.16, 0.24], lightness: [0.55, 0.7] },
    secondary: { chroma: [0.0, 0.02], lightness: [0.4, 0.55], mode: "neutral" },
    accent: { chroma: [0.0, 0.03], lightness: [0.65, 0.8], mode: "echo-primary" },
    background: { chroma: [0.01, 0.04], lightness: [0.1, 0.2], saturated: false },
    accentHueOffset: [0, 0],
    secondaryHueOffset: [0, 360],
    preferredFeels: ["noir", "cyber", "midnight"],
    avoidedFeels: ["pastel", "frosted"],
  },
  {
    id: "dual-accent",
    name: "Dual Accent",
    description: "Two distinct saturated colors (primary + accent) with a neutral secondary bridge.",
    primary: { chroma: [0.14, 0.22], lightness: [0.45, 0.65] },
    secondary: { chroma: [0.0, 0.04], lightness: [0.7, 0.88], mode: "neutral" },
    accent: { chroma: [0.14, 0.22], lightness: [0.5, 0.65], mode: "complement" },
    background: { chroma: [0.0, 0.015], lightness: [0.95, 0.99], saturated: false },
    accentHueOffset: [150, 210],
    secondaryHueOffset: [0, 360],
    preferredFeels: ["vibrant", "jewel", "ocean"],
  },
  {
    id: "colored-canvas",
    name: "Colored Canvas",
    description: "Saturated background or chrome (sidebar/header), with a neutral content area.",
    primary: { chroma: [0.12, 0.2], lightness: [0.45, 0.6] },
    secondary: { chroma: [0.0, 0.04], lightness: [0.7, 0.88], mode: "analogous" },
    accent: { chroma: [0.1, 0.18], lightness: [0.5, 0.7], mode: "echo-primary" },
    background: { chroma: [0.06, 0.14], lightness: [0.55, 0.75], saturated: true },
    accentHueOffset: [0, 0],
    secondaryHueOffset: [-30, 30],
    preferredFeels: ["warm", "elegant", "sunset", "terracotta"],
    avoidedFeels: ["monochrome", "industrial"],
  },
  {
    id: "muted-harmony",
    name: "Muted Harmony",
    description: "Low chroma everywhere; no single color dominates. Sophisticated/editorial.",
    primary: { chroma: [0.04, 0.09], lightness: [0.4, 0.6] },
    secondary: { chroma: [0.03, 0.07], lightness: [0.55, 0.75], mode: "analogous" },
    accent: { chroma: [0.04, 0.09], lightness: [0.5, 0.7], mode: "distant" },
    background: { chroma: [0.0, 0.015], lightness: [0.94, 0.98], saturated: false },
    accentHueOffset: [60, 120],
    secondaryHueOffset: [-40, 40],
    preferredFeels: ["serene", "elegant", "vintage", "pastel"],
    avoidedFeels: ["vibrant", "cyber", "aurora"],
  },
  {
    id: "tone-on-tone",
    name: "Tone on Tone",
    description: "All tokens share one hue family. Variation comes from lightness and chroma only.",
    primary: { chroma: [0.12, 0.2], lightness: [0.45, 0.65] },
    secondary: { chroma: [0.06, 0.12], lightness: [0.65, 0.8], mode: "analogous" },
    accent: { chroma: [0.1, 0.18], lightness: [0.55, 0.7], mode: "echo-primary" },
    background: { chroma: [0.0, 0.02], lightness: [0.95, 0.99], saturated: false },
    accentHueOffset: [0, 0],
    secondaryHueOffset: [-15, 15],
    preferredFeels: ["forest", "ocean", "warm", "cool"],
  },
  {
    id: "vibrant-clash",
    name: "Vibrant Clash",
    description: "Two high-saturation colors in unexpected pairing (orange+teal, purple+lime, etc.).",
    primary: { chroma: [0.18, 0.26], lightness: [0.5, 0.65] },
    secondary: { chroma: [0.0, 0.04], lightness: [0.7, 0.88], mode: "neutral" },
    accent: { chroma: [0.18, 0.26], lightness: [0.55, 0.7], mode: "distant" },
    background: { chroma: [0.0, 0.015], lightness: [0.96, 0.99], saturated: false },
    accentHueOffset: [120, 200],
    secondaryHueOffset: [0, 360],
    preferredFeels: ["vibrant", "playful", "aurora", "cyber"],
    avoidedFeels: ["serene", "noir", "monochrome", "elegant"],
  },
];
