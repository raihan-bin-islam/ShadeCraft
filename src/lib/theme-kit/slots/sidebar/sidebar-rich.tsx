import {
  Calendar,
  CheckSquare,
  CreditCard,
  FileText,
  Inbox,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { SlotComponentProps } from "../_types";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}

interface NavSection {
  heading: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    heading: "Workspace",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", active: true },
      { icon: Inbox, label: "Inbox" },
      { icon: Calendar, label: "Calendar" },
      { icon: CheckSquare, label: "Tasks" },
      { icon: FileText, label: "Files" },
    ],
  },
  {
    heading: "Team",
    items: [
      { icon: Users, label: "Members" },
      { icon: Settings, label: "Settings" },
      { icon: CreditCard, label: "Billing" },
    ],
  },
];

export function SidebarRichInner(): React.JSX.Element {
  return (
    <>
      {/* Brand header */}
      <div className="flex h-14 items-center gap-2 border-b px-6">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
          <span className="text-xs font-bold text-primary-foreground">A</span>
        </div>
        <span className="text-sm font-semibold">Acme</span>
      </div>

      {/* Navigation body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {sections.map((section) => (
          <div key={section.heading}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {section.heading}
            </p>
            <nav className="space-y-1">
              {section.items.map(({ icon: Icon, label, active }) => (
                <a
                  key={label}
                  href="#"
                  className={
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground" +
                    (active ? " bg-accent text-accent-foreground" : "")
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Jordan Lee</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SidebarRich(_props: SlotComponentProps): React.JSX.Element {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <SidebarRichInner />
    </aside>
  );
}
