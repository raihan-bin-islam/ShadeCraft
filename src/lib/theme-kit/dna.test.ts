import { describe, it, expect } from "vitest";
import { encodeDNA, decodeDNA, type ThemeDNA } from "./dna";

const sample: ThemeDNA = {
  feel: "noir",
  tone: "minimalist",
  font: "inter",
  narrative: "dark-signature",
  axes: { shadow: "glow", border: "accented", surface: "flat", component: "sharp" },
  layoutArchetype: "app-dashboard",
  layoutEngine: "template",
  seed: 0xdeadbeef,
  v: 1,
};

describe("encodeDNA / decodeDNA", () => {
  it("round-trips a full DNA without loss", () => {
    const encoded = encodeDNA(sample);
    const decoded = decodeDNA(encoded);
    expect(decoded).toEqual(sample);
  });

  it("produces URL-safe characters only", () => {
    const encoded = encodeDNA(sample);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("decodeDNA returns null for empty input", () => {
    expect(decodeDNA("")).toBeNull();
  });

  it("decodeDNA returns null for malformed input", () => {
    expect(decodeDNA("not-base64-!@#$")).toBeNull();
  });

  it("decodeDNA returns null when schema version mismatches", () => {
    const stale = { ...sample, v: 999 };
    const encoded =
      typeof btoa === "function"
        ? btoa(JSON.stringify(stale))
        : Buffer.from(JSON.stringify(stale), "utf-8").toString("base64");
    expect(decodeDNA(encoded.replace(/=+$/, ""))).toBeNull();
  });

  it("round-trips a minimal DNA (no optional fields)", () => {
    const minimal: ThemeDNA = { feel: "warm", tone: "elegant", font: "lora", seed: 1, v: 1 };
    expect(decodeDNA(encodeDNA(minimal))).toEqual(minimal);
  });
});
