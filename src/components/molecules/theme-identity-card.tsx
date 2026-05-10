"use client";
import React from "react";
import { useAtomValue } from "jotai";
import { currentThemeAtom } from "@/store/theme";
import { DnaBadge } from "./dna-badge";

interface ThemeIdentityCardProps {
  className?: string;
}

/**
 * Displays the current theme's identity: name, tagline, designedFor use case,
 * and DNA badge. If no theme is loaded or identity is missing, renders nothing.
 */
export function ThemeIdentityCard({ className }: ThemeIdentityCardProps) {
  const theme = useAtomValue(currentThemeAtom);
  if (!theme?.identity) return null;

  const { name, tagline, designedFor } = theme.identity;

  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground ${className ?? ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight">{name}</h3>
        <DnaBadge theme={theme} />
      </div>
      <p className="text-sm text-muted-foreground">{tagline}</p>
      <p className="text-xs text-muted-foreground">
        Designed for <span className="text-foreground">{designedFor}</span>
      </p>
    </div>
  );
}
