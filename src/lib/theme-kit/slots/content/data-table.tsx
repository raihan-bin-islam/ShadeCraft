import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SlotComponentProps } from "../_types";

interface UserRow {
  name: string;
  email: string;
  status: "Active" | "Trial" | "Inactive";
  plan: string;
  lastActive: string;
}

const rows: UserRow[] = [
  {
    name: "Jordan Lee",
    email: "jordan@acme.com",
    status: "Active",
    plan: "Pro",
    lastActive: "2h ago",
  },
  {
    name: "Sam Chen",
    email: "sam@helix.com",
    status: "Active",
    plan: "Free",
    lastActive: "1d ago",
  },
  {
    name: "Avery Rivera",
    email: "avery@stark.com",
    status: "Trial",
    plan: "Pro",
    lastActive: "3d ago",
  },
  {
    name: "Morgan Patel",
    email: "morgan@nova.io",
    status: "Active",
    plan: "Enterprise",
    lastActive: "5h ago",
  },
  {
    name: "Riley Kim",
    email: "riley@quanta.dev",
    status: "Inactive",
    plan: "Free",
    lastActive: "2w ago",
  },
  {
    name: "Casey Morgan",
    email: "casey@forge.app",
    status: "Active",
    plan: "Pro",
    lastActive: "1h ago",
  },
];

function statusBadge(status: UserRow["status"]): React.JSX.Element {
  if (status === "Active") return <Badge>{status}</Badge>;
  if (status === "Trial") return <Badge variant="secondary">{status}</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DataTable(_props: SlotComponentProps): React.JSX.Element {
  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Recent users</h3>
        <Button variant="outline" size="sm">
          Filter
        </Button>
      </div>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Last active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.email}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {row.email}
                </TableCell>
                <TableCell>{statusBadge(row.status)}</TableCell>
                <TableCell>{row.plan}</TableCell>
                <TableCell className="text-muted-foreground">
                  {row.lastActive}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
