"use client";
import { useShareableDNA } from "@/hooks/theme-module/use-shareable-dna";

/**
 * Render-null component that mounts useShareableDNA. Used at the page level
 * to wire the URL query param to theme state.
 */
export function ShareableDNAEffect() {
  useShareableDNA();
  return null;
}
