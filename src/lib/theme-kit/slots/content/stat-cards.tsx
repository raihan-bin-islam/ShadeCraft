import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { SlotComponentProps } from "../_types";

interface StatCardData {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

const stats: StatCardData[] = [
  { label: "Revenue", value: "$12,345", change: "+12.5%", positive: true },
  { label: "Active users", value: "8,432", change: "+4.7%", positive: true },
  { label: "Conversion", value: "4.7%", change: "-1.2%", positive: false },
  { label: "Sessions", value: "23,891", change: "+8.3%", positive: true },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function StatCards(_props: SlotComponentProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const ArrowIcon = stat.positive ? ArrowUpRight : ArrowDownRight;
        const trendClass = stat.positive
          ? "text-[color:var(--chart-1)]"
          : "text-destructive";
        return (
          <Card key={stat.label} className="gap-2 p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <div className="flex items-center gap-1 text-xs">
              <ArrowIcon className={`h-3 w-3 ${trendClass}`} />
              <span className={trendClass}>{stat.change}</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
