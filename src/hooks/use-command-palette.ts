"use client";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { commandPaletteOpenAtom } from "@/store/theme";

export function useCommandPalette() {
  const [open, setOpen] = useAtom(commandPaletteOpenAtom);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  return { open, setOpen };
}
