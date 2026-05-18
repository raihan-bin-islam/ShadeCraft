"use client";
import React from "react";
import { useAtomValue } from "jotai";
import { currentThemeAtom } from "@/store/theme";
import { DnaBadge } from "./dna-badge";

interface ThemeIdentityCardProps {
  className?: string;
}

/**
 * Compact one-line pill: name · tagline · "for X" · DNA badge.
 * If no theme is loaded or identity is missing, renders nothing.
 */
export function ThemeIdentityCard({ className }: ThemeIdentityCardProps) {
  const theme = useAtomValue(currentThemeAtom);
  if (!theme?.identity) return null;

  const { name, tagline, designedFor } = theme.identity;

  return (
    <div
      className={`flex items-center gap-3 rounded-md border bg-card px-3 py-1.5 text-card-foreground ${className ?? ""}`}
    >
      <h3 className="text-sm font-semibold tracking-tight shrink-0">{name}</h3>
      <span className="text-muted-foreground/40 shrink-0">·</span>
      <p className="text-xs text-muted-foreground truncate min-w-0">{tagline}</p>
      <span className="text-muted-foreground/40 shrink-0 hidden md:inline">·</span>
      <p className="text-xs text-muted-foreground shrink-0 hidden md:inline">
        for <span className="text-foreground">{designedFor}</span>
      </p>
      <div className="ml-auto shrink-0">
        <DnaBadge theme={theme} />
      </div>
    </div>
  );
}
