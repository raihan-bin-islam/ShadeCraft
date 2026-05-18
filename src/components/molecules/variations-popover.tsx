"use client";
import React from "react";
import { LayoutGrid } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { VariationsPanel } from "@/components/molecules/variations-panel";

interface Props {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function VariationsPopover({ trigger, open, onOpenChange }: Props) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <button type="button" aria-label="Variations" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
            <LayoutGrid className="h-4 w-4" />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent align="center" side="top" sideOffset={12} className="w-[420px] p-4">
        <VariationsPanel />
      </PopoverContent>
    </Popover>
  );
}
