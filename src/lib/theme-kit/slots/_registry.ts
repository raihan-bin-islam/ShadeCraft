/**
 * Aggregates all slot variant registrations. Import this module (not
 * _registry-base) anywhere you need the fully-populated SLOT_REGISTRY.
 * Each slot index.ts registers itself into _registry-base via registerSlot;
 * the side-effect imports below trigger that registration.
 */
export { SLOT_REGISTRY, registerSlot } from "./_registry-base";

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
import "./settings";
import "./auth";
import "./editorial";
import "./bento";
import "./cards";
