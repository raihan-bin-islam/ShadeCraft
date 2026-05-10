import {
  User,
  UserCircle,
  Shield,
  Bell,
  CreditCard,
  Plug,
  Code,
} from "lucide-react";
import type { SlotComponentProps } from "../_types";

interface NavItem {
  label: string;
  icon: React.ElementType;
  active?: boolean;
}

const navItems: NavItem[] = [
  { label: "Account", icon: User, active: true },
  { label: "Profile", icon: UserCircle },
  { label: "Security", icon: Shield },
  { label: "Notifications", icon: Bell },
  { label: "Billing", icon: CreditCard },
  { label: "Integrations", icon: Plug },
  { label: "API", icon: Code },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SettingsSidebar(_props: SlotComponentProps): React.JSX.Element {
  return (
    <div className="flex h-full w-56 flex-col gap-1 border-r bg-background p-4">
      <p className="mb-3 px-3 text-sm font-semibold text-foreground">
        Settings
      </p>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.label}
            href="#"
            className={
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground" +
              (item.active ? " bg-accent text-accent-foreground" : "")
            }
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </a>
        );
      })}
    </div>
  );
}
