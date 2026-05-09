import { randomChoice } from "@/lib/utils";

const COLOR_NAMES = [
  "Crimson",
  "Azure",
  "Emerald",
  "Amber",
  "Violet",
  "Coral",
  "Teal",
  "Rose",
  "Sage",
  "Indigo",
];

const SUFFIXES = ["Dream", "Mist", "Glow", "Bloom", "Zen", "Vibe", "Flow", "Spark", "Aura", "Wave"];

/**
 * Returns a randomized two-word theme name like "Crimson Dream".
 */
export function generateThemeName(): string {
  return `${randomChoice(COLOR_NAMES)} ${randomChoice(SUFFIXES)}`;
}
