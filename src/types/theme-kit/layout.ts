/**
 * The compiled output of a layout engine (Engine A or Engine B). Slots are
 * rendered in array order. `engine` and `archetype` (or DNA) are recorded for
 * debugging, persistence, and future variations features.
 */
export type LayoutEngine = "template" | "procedural";

export type SlotPosition = "top" | "bottom" | "left" | "right" | "flow";

export interface SlotPlacement {
  /** Identifies the slot in the archetype (e.g., "header", "hero", "footer"). */
  slotId: string;
  /** Variant component id (key in SLOT_REGISTRY), e.g. "header-minimal". */
  variant: string;
  /** Optional positional hint used by the renderer for stacking direction. */
  position?: SlotPosition;
}

export interface LayoutSpec {
  engine: LayoutEngine;
  /** Archetype id (Engine A) or DNA id (Engine B). */
  archetype: string;
  slots: SlotPlacement[];
}
