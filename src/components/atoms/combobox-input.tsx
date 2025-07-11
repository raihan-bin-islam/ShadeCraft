"use client";

import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxItem {
  value: string;
  label: string;
  className?: string;
}
export interface GroupedComboboxItem {
  heading: string;
  items: ComboboxItem[];
}
interface ComboboxInputProps {
  items?: ComboboxItem[];
  groupedItems?: GroupedComboboxItem[];
  value: string;
  onChange: (value?: string) => void;
  placeholder: string;
  noneLabel?: string;
}

export function ComboboxInput({ items, groupedItems, value, onChange, placeholder, noneLabel = "None" }: ComboboxInputProps) {
  const [open, setOpen] = useState(false);
  const current =
    items?.find((item) => item.value === value) ??
    groupedItems?.flatMap((item) => item.items).find((item) => item.value === value);

  const showGroup = !!groupedItems && groupedItems?.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className={cn("min-w-32 justify-between")}>
          {current?.label ?? noneLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[--radix-popover-trigger-width] p-0")}>
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} className="h-9" />
          {showGroup ? (
            <CommandList>
              <CommandEmpty>No font found.</CommandEmpty>
              {groupedItems.map(({ heading, items }) => (
                <Fragment key={heading}>
                  <CommandGroup heading={heading}>
                    {items?.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={() => {
                          onChange(value === item.value ? undefined : item.value);
                          setOpen(false);
                        }}
                        className={cn(item.className, "flex items-center")}
                      >
                        {item.label}
                        <Check className={cn("ml-auto h-4 w-4", item.value === value ? "opacity-100" : "opacity-0")} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </Fragment>
              ))}
            </CommandList>
          ) : (
            <CommandList>
              <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {items?.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => {
                      onChange(value === item.value ? undefined : item.value);
                      setOpen(false);
                    }}
                    className={cn(item.className, "flex items-center")}
                  >
                    {item.label}
                    <Check className={cn("ml-auto h-4 w-4", item.value === value ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
