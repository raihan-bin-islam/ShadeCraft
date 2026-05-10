import type { LayoutArchetype } from "@/config/layout-archetypes";
import type { LayoutSpec, SlotPlacement } from "@/types/theme-kit/layout";
import type { AxisSelection } from "@/config/theme-axes";
import type { Narrative } from "@/config/theme-narratives";
import { randomChoice } from "@/lib/utils";

interface GenerateTemplateParams {
  archetype: LayoutArchetype;
  axes: AxisSelection;
  narrative: Narrative;
}

/**
 * Builds a LayoutSpec from an archetype by picking one variant per slot.
 * For Phase 3 v1, picks uniformly at random from each slot's eligible
 * variants. Phase 4+ may extend this with axis/narrative-aware filtering
 * and weighted choice based on coupling rules.
 *
 * Optional slots appear ~70% of the time; required slots always appear.
 */
export function generateLayoutTemplate(params: GenerateTemplateParams): LayoutSpec {
  const { archetype } = params;

  const slots: SlotPlacement[] = archetype.slots
    .filter((slotDef) => slotDef.required || Math.random() < 0.7)
    .map((slotDef) => ({
      slotId: slotDef.id,
      variant: randomChoice(slotDef.variants),
      position: slotDef.position,
    }));

  return {
    engine: "template",
    archetype: archetype.id,
    slots,
  };
}
