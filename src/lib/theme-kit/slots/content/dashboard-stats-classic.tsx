"use client";
import React from "react";
import { CardsStats } from "@/components/templates/stats";
import type { SlotComponentProps } from "../_types";

/**
 * Wraps the original full-fidelity CardsStats demo as a single slot variant.
 * Intended for the `app-dashboard-classic` archetype where one slot fills the
 * page with the original stat cards + chart composition.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DashboardStatsClassic(_: SlotComponentProps) {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-6">
      <CardsStats />
    </div>
  );
}
