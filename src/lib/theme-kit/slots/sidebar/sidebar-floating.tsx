import type { SlotComponentProps } from "../_types";
import { SidebarRichInner } from "./sidebar-rich";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SidebarFloating(_props: SlotComponentProps): React.JSX.Element {
  return (
    <aside className="m-4 flex w-64 flex-col self-stretch rounded-xl border bg-card shadow-md">
      <SidebarRichInner />
    </aside>
  );
}
