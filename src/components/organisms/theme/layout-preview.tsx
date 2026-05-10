"use client";
import React from "react";
import type { LayoutSpec, SlotPlacement } from "@/types/theme-kit/layout";
import { SLOT_REGISTRY } from "@/lib/theme-kit/slots/_registry";

interface LayoutPreviewProps {
  spec: LayoutSpec | undefined;
}

/**
 * Renders a generated theme on its picked layout archetype. Reads the
 * LayoutSpec, looks up each slot variant in SLOT_REGISTRY, and renders
 * them in order. If the spec is missing or the archetype has no slots,
 * shows a fallback message.
 *
 * Layout shaping (left/right sidebars vs top/bottom headers) is achieved
 * via flex/grid containers that group slots by their `position`. v1 uses
 * a simple stacked layout that respects top/bottom/left/right hints.
 */
export function LayoutPreview({ spec }: LayoutPreviewProps) {
  if (!spec || spec.slots.length === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center text-muted-foreground">
        Generate a theme to see the preview.
      </div>
    );
  }

  const topSlots = spec.slots.filter((s) => s.position === "top");
  const bottomSlots = spec.slots.filter((s) => s.position === "bottom");
  const leftSlots = spec.slots.filter((s) => s.position === "left");
  const rightSlots = spec.slots.filter((s) => s.position === "right");
  const flowSlots = spec.slots.filter((s) => !s.position || s.position === "flow");

  const hasSides = leftSlots.length > 0 || rightSlots.length > 0;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {topSlots.map((slot) => renderSlot(slot))}

      {hasSides ? (
        <div className="flex flex-1">
          {leftSlots.map((slot) => renderSlot(slot))}
          <main className="flex flex-1 flex-col gap-8 p-8">
            {flowSlots.map((slot) => renderSlot(slot))}
          </main>
          {rightSlots.map((slot) => renderSlot(slot))}
        </div>
      ) : (
        <main className="flex flex-1 flex-col gap-12">
          {flowSlots.map((slot) => renderSlot(slot))}
        </main>
      )}

      {bottomSlots.map((slot) => renderSlot(slot))}
    </div>
  );
}

function renderSlot(slot: SlotPlacement) {
  const Component = SLOT_REGISTRY[slot.variant];
  if (!Component) {
    return (
      <div key={slot.slotId} className="border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Missing slot variant: <code>{slot.variant}</code>
      </div>
    );
  }
  return <Component key={slot.slotId} position={slot.position} />;
}
