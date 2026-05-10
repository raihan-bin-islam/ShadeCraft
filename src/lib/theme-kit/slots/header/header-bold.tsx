import { Button } from "@/components/ui/button";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HeaderBold(_props: SlotComponentProps) {
  return (
    <header className="relative flex h-20 w-full items-center justify-between bg-background px-6">
      <span className="text-3xl font-bold tracking-tight text-foreground">
        Acme
      </span>
      <nav className="hidden gap-8 md:flex">
        <a
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          href="#"
        >
          Product
        </a>
        <a
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          href="#"
        >
          Pricing
        </a>
        <a
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          href="#"
        >
          Docs
        </a>
        <a
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          href="#"
        >
          Blog
        </a>
      </nav>
      <Button size="sm">Sign in</Button>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-primary" />
    </header>
  );
}
