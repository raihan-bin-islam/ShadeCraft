import { Button } from "@/components/ui/button";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HeaderMinimal(_props: SlotComponentProps) {
  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-border bg-background px-6">
      <span className="text-base font-semibold text-foreground">Acme</span>
      <nav className="hidden gap-6 md:flex">
        <a
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          href="#"
        >
          Product
        </a>
        <a
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          href="#"
        >
          Pricing
        </a>
        <a
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          href="#"
        >
          Docs
        </a>
        <a
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          href="#"
        >
          Blog
        </a>
      </nav>
      <Button size="sm" variant="outline">
        Sign in
      </Button>
    </header>
  );
}
