import { Check, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SlotComponentProps } from "../_types";

type CellValue = true | false | string;

interface ComparisonRow {
  feature: string;
  free: CellValue;
  pro: CellValue;
  enterprise: CellValue;
}

const rows: ComparisonRow[] = [
  { feature: "Themes", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Exports", free: true, pro: true, enterprise: true },
  { feature: "Premium themes", free: false, pro: true, enterprise: true },
  { feature: "Team collaboration", free: false, pro: true, enterprise: true },
  { feature: "SSO & SAML", free: false, pro: false, enterprise: true },
  { feature: "Custom branding", free: false, pro: true, enterprise: true },
  { feature: "Priority support", free: false, pro: true, enterprise: true },
  { feature: "Dedicated CSM", free: false, pro: false, enterprise: true },
];

function CellContent({ value }: { value: CellValue }): React.JSX.Element {
  if (typeof value === "string") {
    return <span className="text-sm">{value}</span>;
  }
  if (value) {
    return <Check className="h-4 w-4 text-primary mx-auto" />;
  }
  return <Minus className="h-4 w-4 text-muted-foreground mx-auto" />;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PricingComparison(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold tracking-tight">Compare plans</h2>
        <p className="mt-4 text-muted-foreground">
          A full breakdown of what each plan includes so you can choose with confidence.
        </p>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2 px-6 py-4">Feature</TableHead>
              <TableHead className="text-center px-6 py-4">Free</TableHead>
              <TableHead className="text-center px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <span>Pro</span>
                  <Badge className="bg-primary text-primary-foreground">
                    Popular
                  </Badge>
                </div>
              </TableHead>
              <TableHead className="text-center px-6 py-4">Enterprise</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.feature}>
                <TableCell className="px-6 py-4 font-medium">
                  {row.feature}
                </TableCell>
                <TableCell className="text-center px-6 py-4">
                  <CellContent value={row.free} />
                </TableCell>
                <TableCell className="text-center px-6 py-4">
                  <CellContent value={row.pro} />
                </TableCell>
                <TableCell className="text-center px-6 py-4">
                  <CellContent value={row.enterprise} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
