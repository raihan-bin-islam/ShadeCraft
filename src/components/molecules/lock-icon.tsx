"use client";
import React from "react";
import { useAtom } from "jotai";
import { Lock, Unlock } from "lucide-react";
import { lockedDimensionsAtom, type LockableDimension } from "@/store/theme";

interface LockIconProps {
  dimension: LockableDimension;
  className?: string;
}

/**
 * Toggles the lock state for a single dimension. Renders a Lock icon when
 * locked, Unlock icon when unlocked. Used next to each dimension selector
 * (feel / tone / font / narrative / axes / layout).
 */
export function LockIcon({ dimension, className }: LockIconProps) {
  const [locks, setLocks] = useAtom(lockedDimensionsAtom);
  const isLocked = locks[dimension];

  return (
    <button
      type="button"
      onClick={() => setLocks({ ...locks, [dimension]: !isLocked })}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground ${
        isLocked ? "text-foreground" : ""
      } ${className ?? ""}`}
      aria-label={`${isLocked ? "Unlock" : "Lock"} ${dimension}`}
      title={`${isLocked ? "Locked" : "Click to lock"} ${dimension}`}
    >
      {isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
    </button>
  );
}
