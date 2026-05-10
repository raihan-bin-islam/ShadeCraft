import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FormSection(_props: SlotComponentProps): React.JSX.Element {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-8">
      {/* Section 1 — Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Profile information
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Update your personal details and how others see you.
        </p>
      </div>

      {/* Section 2 — Avatar upload */}
      <div className="space-y-2">
        <Label>Profile photo</Label>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <Button variant="outline">Upload new</Button>
            <Button variant="ghost">Remove</Button>
          </div>
        </div>
      </div>

      {/* Section 3 — Form fields */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="full-name">Full name</Label>
          <Input
            id="full-name"
            defaultValue="Jordan Lee"
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            defaultValue="jordan@acme.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            defaultValue="Frontend lead working on design systems and tooling. Coffee enthusiast."
            rows={3}
          />
        </div>
      </div>

      {/* Section 4 — Footer action row */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button variant="ghost">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
}
