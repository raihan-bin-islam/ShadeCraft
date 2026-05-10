import { SlotComponent } from "../_types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Link2 } from "lucide-react";

export const MetaSidebar: SlotComponent = () => {
  return (
    <aside className="sticky top-8 w-64 space-y-8 p-6 text-sm">
      <div className="flex items-center gap-3 pb-4 border-b">
        <Avatar className="h-12 w-12">
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Jordan Lee</p>
          <p className="text-xs text-muted-foreground">Frontend lead at Acme</p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          On this page
        </h3>
        <nav className="space-y-2 flex flex-col">
          <a href="#intro" className="text-sm text-muted-foreground hover:text-foreground">
            Introduction
          </a>
          <a
            href="#generators"
            className="text-sm text-foreground font-medium"
          >
            Where most generators fall short
          </a>
          <a href="#narrative" className="text-sm text-muted-foreground hover:text-foreground">
            What narrative actually means
          </a>
          <a href="#practice" className="text-sm text-muted-foreground hover:text-foreground">
            Putting it into practice
          </a>
          <a href="#conclusion" className="text-sm text-muted-foreground hover:text-foreground">
            Conclusion
          </a>
        </nav>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Share
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Linkedin className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Link2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
};
