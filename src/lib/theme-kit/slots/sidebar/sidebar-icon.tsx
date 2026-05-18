import {
  Calendar,
  Home,
  Inbox,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SidebarIcon(_props: SlotComponentProps): React.JSX.Element {
  const navItems = [
    { icon: Home, label: "Home", active: false },
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Inbox, label: "Inbox", active: false },
    { icon: Calendar, label: "Calendar", active: false },
    { icon: Settings, label: "Settings", active: false },
    { icon: User, label: "Profile", active: false },
  ];

  return (
    <aside className="flex h-auto w-16 flex-col items-center gap-2 border-r bg-card py-4">
      <nav className="flex flex-col items-center gap-2">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            aria-label={label}
            className={
              "flex h-10 w-10 items-center justify-center rounded-md transition-colors" +
              (active
                ? " bg-accent text-accent-foreground"
                : " text-muted-foreground hover:bg-accent hover:text-accent-foreground")
            }
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <Avatar className="h-9 w-9">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </aside>
  );
}
