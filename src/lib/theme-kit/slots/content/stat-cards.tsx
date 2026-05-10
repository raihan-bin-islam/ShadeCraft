import { ArrowUpRight, ArrowDownRight } from "lucide-react";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border rounded-lg p-6 space-y-2"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {stat.label}
          </p>
          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          <div className="flex items-center gap-1 text-xs">
            {stat.positive ? (
              <ArrowUpRight className="h-3 w-3 text-emerald-600" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-rose-600" />
            )}
            <span
              className={
                stat.positive ? "text-emerald-600" : "text-rose-600"
              }
            >
              {stat.change}
            </span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        </div>
      ))}
    </div>
  );
}
