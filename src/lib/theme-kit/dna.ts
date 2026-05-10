import type { AxisSelection } from "@/config/theme-axes";

/**
 * Encoded representation of a theme's full dimension set + seed. Encoded into
 * a URL hash, this is enough to reproduce the exact theme via the seedable
 * generator.
 */
export interface ThemeDNA {
  feel: string;
  tone: string;
  font: string;
  narrative?: string;
  axes?: AxisSelection;
  layoutArchetype?: string;
  layoutEngine?: "template" | "procedural";
  seed: number;
  /** Schema version for future migrations. */
  v: number;
}

const SCHEMA_VERSION = 1;

/**
 * Encode a ThemeDNA to a URL-safe base64 string suitable for a URL query
 * param. Output is round-trippable via decodeDNA.
 */
export function encodeDNA(dna: ThemeDNA): string {
  const payload = { ...dna, v: SCHEMA_VERSION };
  const json = JSON.stringify(payload);
  const base64 =
    typeof btoa === "function"
      ? btoa(json)
      : Buffer.from(json, "utf-8").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decode a URL-safe base64 string back into a ThemeDNA. Returns null if the
 * input is malformed, empty, or has a missing/incompatible schema version.
 */
export function decodeDNA(encoded: string): ThemeDNA | null {
  if (!encoded) return null;
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf-8");
    const parsed = JSON.parse(json);
    if (typeof parsed !== "object" || parsed === null) return null;
    if (parsed.v !== SCHEMA_VERSION) return null;
    if (
      typeof parsed.feel !== "string" ||
      typeof parsed.tone !== "string" ||
      typeof parsed.seed !== "number"
    )
      return null;
    return parsed as ThemeDNA;
  } catch {
    return null;
  }
}
