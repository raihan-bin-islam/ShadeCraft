"use client";
import React from "react";
import MailPage from "@/components/templates/mail/page";
import type { SlotComponentProps } from "../_types";

/**
 * Wraps the original full-fidelity MailPage demo as a single slot variant.
 * Renders the entire 3-pane mail/inbox composition, intended for the
 * `app-workspace-classic` archetype where one slot fills the page.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function WorkspaceMailClassic(_: SlotComponentProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <MailPage />
    </div>
  );
}
