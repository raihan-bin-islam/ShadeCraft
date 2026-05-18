import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  { name: "Jordan Lee", email: "jordan@acme.com", status: "Active", plan: "Pro", lastActive: "2h ago" },
  { name: "Sam Chen", email: "sam@helix.com", status: "Active", plan: "Free", lastActive: "1d ago" },
  { name: "Avery Rivera", email: "avery@stark.com", status: "Trial", plan: "Pro", lastActive: "3d ago" },
  { name: "Morgan Patel", email: "morgan@nova.io", status: "Active", plan: "Enterprise", lastActive: "5h ago" },
  { name: "Riley Kim", email: "riley@quanta.dev", status: "Inactive", plan: "Free", lastActive: "2w ago" },
  { name: "Casey Morgan", email: "casey@forge.app", status: "Active", plan: "Pro", lastActive: "1h ago" },
];

function statusBadge(status: UserRow["status"]): React.JSX.Element {
  if (status === "Active") return <Badge>{status}</Badge>;
  if (status === "Trial") return <Badge variant="secondary">{status}</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DataTable(_props: SlotComponentProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent users</CardTitle>
        <CardAction>
          <Button variant="outline" size="sm">Filter</Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="pr-6">Last active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.email}>
                <TableCell className="pl-6 font-medium">{row.name}</TableCell>
                <TableCell className="text-muted-foreground">{row.email}</TableCell>
                <TableCell>{statusBadge(row.status)}</TableCell>
                <TableCell>{row.plan}</TableCell>
                <TableCell className="pr-6 text-muted-foreground">{row.lastActive}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
