"use client";
import React from "react";
import type { LayoutSpec, SlotPlacement } from "@/types/theme-kit/layout";
import { SLOT_REGISTRY } from "@/lib/theme-kit/slots/_registry";
import { useAtomValue } from "jotai";
import { previewArchetypeAtom, currentThemeAtom } from "@/store/theme";
import { LAYOUT_ARCHETYPES } from "@/config/layout-archetypes";
import { DESIGN_SYSTEM_DNAS } from "@/config/design-system-dnas";
import { generateLayoutTemplate } from "@/lib/theme-kit/generators/layout/template";
import { generateProceduralLayout } from "@/lib/theme-kit/generators/layout/procedural";

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
  const previewArchetype = useAtomValue(previewArchetypeAtom);
  const theme = useAtomValue(currentThemeAtom);

  // If an archetype override is set and differs from the spec's archetype,
  // regenerate a spec for the override using the current theme's axes + narrative.
  // The `as never` cast on narrative is intentional — we only have the narrative
  // ID on the current theme, not the full Narrative object, but the override path
  // only consumes id-derived properties.
  const effectiveSpec: LayoutSpec | undefined = (() => {
    if (!previewArchetype || !theme?.layout || previewArchetype === spec?.archetype) {
      return spec;
    }
    if (!theme.axes || !theme.narrative) return spec;

    const archetype = LAYOUT_ARCHETYPES.find((a) => a.id === previewArchetype);
    if (archetype) {
      return generateLayoutTemplate({
        archetype,
        axes: theme.axes,
        narrative: { id: theme.narrative } as never,
      });
    }
    const dna = DESIGN_SYSTEM_DNAS.find((d) => d.id === previewArchetype);
    if (dna) {
      return generateProceduralLayout({
        dna,
        axes: theme.axes,
        narrative: { id: theme.narrative } as never,
      });
    }
    return spec;
  })();

  if (!effectiveSpec || effectiveSpec.slots.length === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center text-muted-foreground">
        Generate a theme to see the preview.
      </div>
    );
  }

  const topSlots = effectiveSpec.slots.filter((s) => s.position === "top");
  const bottomSlots = effectiveSpec.slots.filter((s) => s.position === "bottom");
  const leftSlots = effectiveSpec.slots.filter((s) => s.position === "left");
  const rightSlots = effectiveSpec.slots.filter((s) => s.position === "right");
  const flowSlots = effectiveSpec.slots.filter((s) => !s.position || s.position === "flow");

  const hasSides = leftSlots.length > 0 || rightSlots.length > 0;

  const isAppSurface = hasSides && flowSlots.some((s) => s.variant === "stat-cards" || s.variant === "chart-area" || s.variant === "data-table" || s.variant === "kanban" || s.variant === "form-section");

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {topSlots.map((slot) => renderSlot(slot))}

      {hasSides ? (
        <div className="flex flex-1 min-h-0">
          {leftSlots.map((slot) => renderSlot(slot))}
          <main className={isAppSurface ? "flex flex-1 flex-col gap-6 p-6 overflow-auto" : "flex flex-1 flex-col"}>
            {flowSlots.map((slot) => renderSlot(slot))}
          </main>
          {rightSlots.map((slot) => renderSlot(slot))}
        </div>
      ) : (
        <main className="flex flex-1 flex-col">
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
