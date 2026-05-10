import { Reply, Forward, Archive } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DetailPane(_props: SlotComponentProps): React.JSX.Element {
  return (
    <div className="flex h-full flex-1 flex-col bg-background">
      <div className="border-b p-6 space-y-3">
        <h2 className="text-xl font-semibold">Weekly summary — Sprint 24</h2>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Sam Chen</p>
            <p className="text-sm text-muted-foreground">sam@acme.dev</p>
          </div>
          <span className="ml-auto text-xs text-muted-foreground">
            May 10, 2026 at 9:15 AM
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Reply className="mr-1.5 h-3.5 w-3.5" />
            Reply
          </Button>
          <Button variant="outline" size="sm">
            <Forward className="mr-1.5 h-3.5 w-3.5" />
            Forward
          </Button>
          <Button variant="outline" size="sm">
            <Archive className="mr-1.5 h-3.5 w-3.5" />
            Archive
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm leading-relaxed text-foreground">
        <p>
          Hey team — here is the weekly summary for Sprint 24. Overall it was a
          strong week. We shipped 12 pull requests across the web, API, and
          infrastructure repos. Highlights include the new upload pipeline draft
          (ENG-412), the v3 endpoint pagination fix (ENG-418), and the initial
          design system token export (ENG-421).
        </p>
        <p>
          We are currently blocked on two items. ENG-419 (database migration for
          the analytics schema) is waiting on a review from the platform team —
          Jordan has been pinged twice and we expect sign-off by Tuesday.
          ENG-423 (SSO integration) is blocked on credentials from the customer;
          Avery is following up.
        </p>
        <p>
          Link metrics for the week: the docs site saw 4,200 unique visitors
          (+18% vs last sprint), the changelog post hit 1,100 views in the first
          24 hours, and the API reference had a 12% drop in 404s after Riley
          cleaned up the broken anchor links.
        </p>
        <p>
          For next sprint we are planning to pick up ENG-432 (refactor upload
          pipeline), ENG-435 (add rate-limit headers to v3), and ENG-440 (dark
          mode polish pass). Full scope is in Linear — check the Sprint 25
          milestone if you want to grab anything.
        </p>
        <p>
          Standup notes from the week are attached as a Notion doc. Retro is
          Thursday at 3 PM — please add your items to the board before then.
          Thanks everyone, solid work this week.
        </p>
      </div>
    </div>
  );
}
