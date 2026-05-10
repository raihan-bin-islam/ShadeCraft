import { Badge } from "@/components/ui/badge";
import type { SlotComponentProps } from "../_types";

interface PropertyRow {
  key: string;
  value: string;
}

const properties: PropertyRow[] = [
  { key: "From", value: "Sam Chen" },
  { key: "Date", value: "May 10, 2026" },
  { key: "Thread", value: "Sprint 24" },
  { key: "Labels", value: "weekly, sprint" },
];

const tags = ["Engineering", "Sprint 24", "Status", "Read"];

interface ActivityItem {
  id: number;
  description: string;
  timestamp: string;
}

const activity: ActivityItem[] = [
  {
    id: 1,
    description: "Sam Chen sent this message",
    timestamp: "10:32 AM today",
  },
  {
    id: 2,
    description: "You opened the message",
    timestamp: "10:34 AM today",
  },
  {
    id: 3,
    description: "Casey Morgan starred the thread",
    timestamp: "10:45 AM today",
  },
  {
    id: 4,
    description: "You added the 'Sprint 24' label",
    timestamp: "11:02 AM today",
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function MetaPane(_props: SlotComponentProps): React.JSX.Element {
  return (
    <div className="flex h-full w-72 flex-col border-l bg-muted/30 p-6 space-y-6 overflow-y-auto">
      {/* Properties */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Properties
        </p>
        <div>
          {properties.map((row) => (
            <div
              key={row.key}
              className="flex justify-between text-sm py-2 border-b last:border-0"
            >
              <span className="text-muted-foreground">{row.key}</span>
              <span className="font-medium">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Tags
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Activity
        </p>
        <div className="space-y-3">
          {activity.map((item) => (
            <div key={item.id} className="flex gap-3 items-start text-sm">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
              <div>
                <p className="text-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground">{item.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
