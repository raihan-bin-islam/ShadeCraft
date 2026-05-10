/**
 * Centralized random number generator used by all theme-kit utilities. Default
 * implementation delegates to Math.random for unseeded operation. Wrap a
 * generation pipeline in `withSeed(seed, fn)` to make it deterministic — every
 * call to `rng()` inside `fn` will use a Mulberry32-seeded PRNG instead.
 */
let currentRng: () => number = Math.random;

export function rng(): number {
  return currentRng();
}

/**
 * Run `fn` with a deterministic RNG seeded by `seed`. Restores the previous
 * RNG implementation after fn returns, even on throw. Synchronous only —
 * async fn would race other callers of rng().
 */
export function withSeed<T>(seed: number, fn: () => T): T {
  const previous = currentRng;
  currentRng = mulberry32(seed >>> 0);
  try {
    return fn();
  } finally {
    currentRng = previous;
  }
}

/**
 * Mulberry32: a simple, fast 32-bit PRNG. Identical seed => identical output
 * sequence. Good enough for theme generation determinism (we don't need
 * cryptographic quality; we need reproducibility).
 */
function mulberry32(a: number): () => number {
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
