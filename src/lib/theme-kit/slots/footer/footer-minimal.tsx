import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FooterMinimal(_props: SlotComponentProps): React.JSX.Element {
  return (
    <footer className="border-t bg-background py-8 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="font-semibold">Acme</div>
        <div className="text-sm text-muted-foreground">
          © 2026 Acme. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
