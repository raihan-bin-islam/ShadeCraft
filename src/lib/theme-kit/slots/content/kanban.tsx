import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { SlotComponentProps } from "../_types";

interface KanbanCard {
  title: string;
  description?: string;
  priority?: "high" | "medium" | "low";
  assigneeInitials: string;
}

interface KanbanColumn {
  name: string;
  cards: KanbanCard[];
}

const columns: KanbanColumn[] = [
  {
    name: "To do",
    cards: [
      { title: "Update auth flow", description: "Refresh the login and signup screens", priority: "high", assigneeInitials: "AL" },
      { title: "Refactor table component", description: "Improve reusability and type safety", assigneeInitials: "SC" },
      { title: "Add dark mode toggle", description: "System-level and manual override", assigneeInitials: "MP" },
    ],
  },
  {
    name: "In progress",
    cards: [
      { title: "Build pricing page", description: "3-tier pricing with annual toggle", priority: "medium", assigneeInitials: "JL" },
      { title: "Migrate to Tailwind v4", description: "Update config and resolve breakpoints", priority: "high", assigneeInitials: "RK" },
    ],
  },
  {
    name: "Done",
    cards: [
      { title: "Set up CI", description: "GitHub Actions for lint and build", assigneeInitials: "CM" },
      { title: "Write API docs", description: "Endpoints documented with examples", assigneeInitials: "AR" },
      { title: "Deploy preview env", description: "Vercel preview deployments on PRs", assigneeInitials: "JL" },
    ],
  },
];

function priorityBadge(priority: KanbanCard["priority"]): React.JSX.Element | null {
  if (!priority) return null;
  if (priority === "high") return <Badge variant="destructive">High</Badge>;
  if (priority === "medium") return <Badge variant="secondary">Medium</Badge>;
  return <Badge variant="outline">Low</Badge>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Kanban(_props: SlotComponentProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => (
        <div key={col.name} className="bg-muted/40 rounded-lg p-4 space-y-3 min-h-[400px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">{col.name}</span>
            <span className="text-xs text-muted-foreground bg-background rounded-full px-2 py-0.5">
              {col.cards.length}
            </span>
          </div>
          {col.cards.map((card) => (
            <Card key={card.title} className="gap-2 py-3 shadow-none">
              <CardContent className="space-y-2 px-3">
                <p className="text-sm font-medium text-foreground">{card.title}</p>
                {card.description && (
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                )}
                <div className="flex items-center justify-between pt-1">
                  <div>{priorityBadge(card.priority)}</div>
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{card.assigneeInitials}</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
