import { describe, it, expect } from "vitest";
import { rng, withSeed } from "./rng";

describe("rng / withSeed", () => {
  it("default rng returns numbers in [0, 1)", () => {
    for (let i = 0; i < 50; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("withSeed produces deterministic output for the same seed", () => {
    const sequence1 = withSeed(42, () => Array.from({ length: 10 }, () => rng()));
    const sequence2 = withSeed(42, () => Array.from({ length: 10 }, () => rng()));
    expect(sequence1).toEqual(sequence2);
  });

  it("withSeed produces different output for different seeds", () => {
    const seq1 = withSeed(1, () => Array.from({ length: 10 }, () => rng()));
    const seq2 = withSeed(2, () => Array.from({ length: 10 }, () => rng()));
    expect(seq1).not.toEqual(seq2);
  });

  it("withSeed restores the previous rng after fn returns", () => {
    const before = rng;
    withSeed(42, () => rng());
    expect(rng).toBe(before);
  });

  it("withSeed restores the previous rng even on throw", () => {
    const before = rng;
    expect(() => withSeed(42, () => { throw new Error("boom"); })).toThrow();
    expect(rng).toBe(before);
  });

  it("nested withSeed restores correctly", () => {
    const outerSeq: number[] = [];
    const innerSeq: number[] = [];
    withSeed(1, () => {
      outerSeq.push(rng(), rng());
      withSeed(2, () => {
        innerSeq.push(rng(), rng());
      });
      outerSeq.push(rng());
    });

    const outerAlone = withSeed(1, () => [rng(), rng(), rng()]);
    expect(outerSeq).toEqual(outerAlone);
  });
});
