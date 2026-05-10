import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SlotComponentProps } from "../_types";

interface MessageItem {
  id: number;
  sender: string;
  timestamp: string;
  subject: string;
  snippet: string;
  selected?: boolean;
}

const messages: MessageItem[] = [
  {
    id: 1,
    sender: "Jordan Lee",
    timestamp: "10:32",
    subject: "Re: design review notes",
    snippet:
      "Looking great overall — a few small comments on the spacing in section 3...",
  },
  {
    id: 2,
    sender: "Sam Chen",
    timestamp: "9:15",
    subject: "Weekly summary — Sprint 24",
    snippet:
      "Shipped 12 PRs this week, blocked on 2. Standup notes attached...",
    selected: true,
  },
  {
    id: 3,
    sender: "Stripe",
    timestamp: "Yesterday",
    subject: "Invoice #4521 - $1,200.00",
    snippet:
      "Your invoice for the period ending May 9 is ready...",
  },
  {
    id: 4,
    sender: "GitHub",
    timestamp: "Yesterday",
    subject: "[acme/web] PR #142 was merged",
    snippet: "Morgan Patel merged your pull request...",
  },
  {
    id: 5,
    sender: "Avery Rivera",
    timestamp: "Mon",
    subject: "Quick question about the API",
    snippet:
      "Hey - is there a way to filter by created_at on the v3 endpoint?",
  },
  {
    id: 6,
    sender: "Linear",
    timestamp: "Mon",
    subject: "ENG-432 was assigned to you",
    snippet: "Refactor the upload pipeline. Estimated 3 days.",
  },
  {
    id: 7,
    sender: "Figma",
    timestamp: "Sun",
    subject: "3 comments on Design System v2",
    snippet:
      "Riley Kim left feedback on the button component variations...",
  },
  {
    id: 8,
    sender: "Casey Morgan",
    timestamp: "Sun",
    subject: "Coffee next week?",
    snippet:
      "Free Tuesday morning if you want to catch up. Cuisine of your choice...",
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ListPane(_props: SlotComponentProps): React.JSX.Element {
  return (
    <div className="flex h-full w-80 flex-col border-r bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-semibold">Inbox</span>
        <Button variant="outline" size="sm">
          <Search className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <button
            key={msg.id}
            className={
              "w-full border-b px-4 py-3 text-left hover:bg-accent" +
              (msg.selected ? " bg-accent" : "")
            }
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{msg.sender}</span>
              <span className="text-xs text-muted-foreground">
                {msg.timestamp}
              </span>
            </div>
            <p className="mt-1 line-clamp-1 text-sm font-medium">
              {msg.subject}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {msg.snippet}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
