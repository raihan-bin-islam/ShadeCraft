import type { DesignSystemDNA } from "@/config/design-system-dnas";
import type { LayoutSpec, SlotPlacement, SlotPosition } from "@/types/theme-kit/layout";
import type { AxisSelection } from "@/config/theme-axes";
import type { Narrative } from "@/config/theme-narratives";
import { randomChoice, randomInRange } from "@/lib/utils";

interface GenerateProceduralParams {
  dna: DesignSystemDNA;
  axes: AxisSelection;
  narrative: Narrative;
}

/**
 * Builds a LayoutSpec procedurally from a design-system DNA. Samples a slot
 * count within the DNA's range, picks slot types respecting must-have / avoid
 * lists, applies first/last ordering and position overrides, then picks one
 * variant per slot from the DNA's per-slot pool.
 */
export function generateProceduralLayout(params: GenerateProceduralParams): LayoutSpec {
  const { dna } = params;

  const targetCount = sampleSlotCount(dna);
  const slotTypes = sampleSlotTypes(dna, targetCount);
  const orderedSlotTypes = orderSlots(slotTypes, dna);
  const slots: SlotPlacement[] = orderedSlotTypes.map((slotType) => ({
    slotId: slotType,
    variant: pickVariant(slotType, dna),
    position: positionFor(slotType, dna),
  }));

  return {
    engine: "procedural",
    archetype: dna.id,
    slots,
  };
}

function sampleSlotCount(dna: DesignSystemDNA): number {
  const [min, max] = dna.slotCountRange;
  return Math.floor(randomInRange(min, max + 1));
}

function sampleSlotTypes(dna: DesignSystemDNA, targetCount: number): string[] {
  const pool = Object.keys(dna.slotVariants).filter((slot) => !dna.mustNotHave?.includes(slot));
  const required = dna.mustHave.filter((slot) => pool.includes(slot));
  const optional = pool.filter((slot) => !required.includes(slot));

  const selected = new Set<string>(required);

  const remainingCapacity = Math.max(0, targetCount - selected.size);
  const shuffledOptional = [...optional].sort(() => Math.random() - 0.5);
  for (let i = 0; i < remainingCapacity && i < shuffledOptional.length; i++) {
    selected.add(shuffledOptional[i]);
  }

  return Array.from(selected);
}

function orderSlots(slotTypes: string[], dna: DesignSystemDNA): string[] {
  const others = slotTypes.filter((s) => s !== dna.firstSlot && s !== dna.lastSlot);
  const ordered: string[] = [];
  if (dna.firstSlot && slotTypes.includes(dna.firstSlot)) ordered.push(dna.firstSlot);
  ordered.push(...others);
  if (dna.lastSlot && slotTypes.includes(dna.lastSlot)) ordered.push(dna.lastSlot);
  return ordered;
}

function pickVariant(slotType: string, dna: DesignSystemDNA): string {
  const variants = dna.slotVariants[slotType];
  if (!variants || variants.length === 0) {
    return `${slotType}-unknown`;
  }
  return randomChoice(variants);
}

function positionFor(slotType: string, dna: DesignSystemDNA): SlotPosition | undefined {
  return dna.positionOverrides?.[slotType];
}
