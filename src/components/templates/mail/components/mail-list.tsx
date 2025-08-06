import { ComponentProps } from "react";
import { formatDistanceToNow } from "date-fns";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Mail } from "@/components/templates/mail/data";
import { useMail } from "@/components/templates/mail/use-mail";
import { Card, CardContent } from "@/components/ui/card";

interface MailListProps {
  items: Mail[];
}

export function MailList({ items }: MailListProps) {
  const [mail, setMail] = useMail();

  return (
    <ScrollArea className="h-full bg-gradient-to-b from-secondary/20 to-50%">
      <div className="flex flex-col gap-2 p-4 pt-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className={cn(
              "cursor-pointer backdrop-blur-2xl flex flex-col items-start gap-2 border p-3 text-left text-sm transition-all hover:bg-background hover:border-border hover:text-card-foreground",
              mail.selected === item.id &&
                "bg-primary/75 text-primary-foreground border-primary hover:bg-primary/80 hover:text-primary-foreground hover:border-primary",
              !item?.read && "border-l-6 border-secondary hover:border-secondary"
            )}
            onClick={() =>
              setMail({
                ...mail,
                selected: item.id,
              })
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.name}</div>
                  {!item.read && <span className="flex h-2 w-2 rounded-full bg-secondary" />}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    mail.selected === item.id ? "text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
            </div>
            <div
              className={cn(
                "line-clamp-2 text-xs text-muted-foreground",
                mail.selected === item.id && "text-primary-foreground/70"
              )}
            >
              {item.text.substring(0, 300)}
            </div>
            {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)} className="border">
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(label: string): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
