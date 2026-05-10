"use client";
import React, { useState } from "react";
import { useAtomValue } from "jotai";
import { Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentThemeAtom } from "@/store/theme";

interface PermalinkButtonProps {
  className?: string;
}

/**
 * Copies the current page URL (which includes the encoded DNA query param)
 * to the clipboard. Shows a brief check-mark confirmation after a successful
 * copy.
 */
export function PermalinkButton({ className }: PermalinkButtonProps) {
  const theme = useAtomValue(currentThemeAtom);
  const [copied, setCopied] = useState(false);

  if (!theme) return null;

  const handleCopy = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write may fail in non-secure contexts; silently no-op
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={className}
      title="Copy permalink to this theme"
      aria-label="Copy permalink"
    >
      {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      <span className="ml-2">{copied ? "Copied" : "Permalink"}</span>
    </Button>
  );
}
