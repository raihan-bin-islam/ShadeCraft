import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomHueFromRanges(ranges: [number, number][]): number {
  if (!ranges.length) throw new Error("No hue ranges provided");

  const [start, end] = ranges[Math.floor(Math.random() * ranges.length)];
  return start + Math.random() * (end - start);
}

export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

type WeightedItem<T> = { item: T; weight: number };
export function weightedChoice<T>(items: WeightedItem<T>[]): T {
  const total = items.reduce((acc, item) => acc + item.weight, 0);
  const roll = Math.random() * total;

  let sum = 0;
  for (const { item, weight } of items) {
    sum += weight;
    if (roll <= sum) return item;
  }

  return items[items.length - 1].item; // fallback
}

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(Math.max(value, min), max);
}

//! Binary Search
type PredicateFn<T> = (value: T) => boolean;

/**
 * Generic binary search utility for numeric values.
 *
 * @param low - start of range
 * @param high - end of range
 * @param predicate - function that returns true if candidate value meets condition
 *                    Should return true for "good" values.
 * @param options - optional settings for max iterations and tolerance
 * @returns best value that satisfies predicate or null if none found
 */
export function binarySearch(
  low: number,
  high: number,
  predicate: PredicateFn<number>,
  options?: { tolerance?: number; maxIterations?: number }
): number | null {
  const tolerance = options?.tolerance ?? 0.001;
  const maxIterations = options?.maxIterations ?? 20;

  let best: number | null = null;

  for (let i = 0; i < maxIterations && high - low > tolerance; i++) {
    const mid = (low + high) / 2;

    if (predicate(mid)) {
      best = mid;
      // Search left half (try to find better / lower value)
      high = mid;
    } else {
      // Search right half
      low = mid;
    }
  }

  return best;
}
