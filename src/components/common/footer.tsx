"use client";
import React from "react";
import { useAtomValue } from "jotai";
import { focusModeAtom } from "@/store/theme";

export const Footer = () => {
  const focus = useAtomValue(focusModeAtom);
  if (focus) return null;

  return (
    <footer className="z-30 sticky bottom-0 backdrop-blur-2xl w-full flex items-center justify-center h-8 text-xs bg-foreground/3 border-t">
      <h2>
        Built by{" "}
        <a target="_blank" href="https://raihanbinislam.vercel.app/" className="text-primary">
          Raihan Bin Islam
        </a>
      </h2>
    </footer>
  );
};
