import type { SlotComponent } from "./_types";

/**
 * Central map from slot variant id to component. Populated by importing each
 * variant module and assigning into this object. The renderer (LayoutPreview)
 * looks up components by id from this registry.
 *
 * Keys follow the kebab-case convention used everywhere else (variant ids in
 * archetype slot definitions, data attributes, etc.).
 */
export const SLOT_REGISTRY: Record<string, SlotComponent> = {};

/**
 * Helper used by each variant module's index/registration block to register
 * itself. Keeps registration co-located with the component file.
 */
export function registerSlot(id: string, component: SlotComponent) {
  SLOT_REGISTRY[id] = component;
}

import "./header";
import "./hero";
import "./logo-cloud";
import "./features";
import "./testimonials";
import "./pricing";
import "./cta";
import "./footer";
import "./sidebar";
import "./content";
import "./workspace";
