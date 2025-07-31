"use client";

import { AppSidebar } from "@/components/blocks/sidebar-16/app-sidebar";
import { SiteHeader } from "@/components/blocks/sidebar-16/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Archive, Clock, Mail, MoreHorizontal, Reply, ReplyAll, Search, Star, Trash2, Forward, Tag } from "lucide-react";
import { useState } from "react";

export const iframeHeight = "800px";
export const description = "An inbox previewer with sidebar and email management.";

// Mock email data
const emails = [
  {
    id: 1,
    sender: "Sarah Chen",
    senderEmail: "sarah.chen@company.com",
    subject: "Q4 Marketing Campaign Review",
    preview: "Hi team, I've attached the latest performance metrics for our Q4 campaigns. The results look promising...",
    time: "2 min ago",
    isRead: false,
    isStarred: true,
    labels: ["Work", "Important"],
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    sender: "Alex Rodriguez",
    senderEmail: "alex.r@startup.io",
    subject: "Project Timeline Update",
    preview: "The development team has made significant progress on the new features. Here's the updated timeline...",
    time: "1 hour ago",
    isRead: false,
    isStarred: false,
    labels: ["Work"],
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    sender: "Emma Thompson",
    senderEmail: "emma.thompson@design.co",
    subject: "Design System Guidelines",
    preview: "I've updated our design system documentation with the new component specifications...",
    time: "3 hours ago",
    isRead: true,
    isStarred: false,
    labels: ["Design"],
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    sender: "Michael Park",
    senderEmail: "m.park@techcorp.com",
    subject: "Weekly Team Sync Notes",
    preview: "Thanks everyone for a productive meeting today. Here are the key takeaways and action items...",
    time: "1 day ago",
    isRead: true,
    isStarred: true,
    labels: ["Work", "Meeting"],
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    sender: "Lisa Wang",
    senderEmail: "lisa.wang@analytics.com",
    subject: "Monthly Performance Report",
    preview: "The monthly analytics report is ready for review. Overall performance has improved by 15%...",
    time: "2 days ago",
    isRead: true,
    isStarred: false,
    labels: ["Analytics", "Report"],
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

export const InboxPreview = () => {
  const [selectedEmail, setSelectedEmail] = useState(emails[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmails = emails.filter(
    (email) =>
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="text-foreground [--header-height:calc(--spacing(14))] flex flex-col overflow-y-auto">
      <SidebarProvider className="relative flex flex-col min-h-0  overflow-y-auto">
        <div className="flex flex-1 h-full overflow-y-auto">
          <AppSidebar collapsible="icon" variant="inset" className="relative h-full" />
          <SidebarInset className="flex flex-col relative overflow-y-auto">
            <SiteHeader />
            <div className="grow overflow-y-auto flex flex-1 flex-col">
              {/* Inbox Header */}
              <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <h1 className="text-xl font-semibold">Inbox</h1>
                    <Badge variant="secondary" className="ml-2">
                      {filteredEmails.filter((e) => !e.isRead).length} unread
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Email List */}
                <div className="w-96 border-r bg-muted/10">
                  <ScrollArea className="h-full [overflow-y:overlay]">
                    <div className="relative p-2 bg-gradient-to-b from-primary/20 to-50%">
                      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-background from-20%" />
                      {filteredEmails.map((email) => (
                        <Card
                          key={email.id}
                          className={cn(
                            `mb-2 mr-2 cursor-pointer transition-colors hover:bg-accent/40 hover:text-foreground p-0`,
                            selectedEmail.id === email.id ? "bg-accent text-accent-foreground border-primary" : "",
                            !email.isRead ? "border-l-4 border-primary" : ""
                          )}
                          onClick={() => setSelectedEmail(email)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={email.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-muted-foreground">
                                  {email.sender
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className={`text-sm truncate ${!email.isRead ? "font-semibold" : "font-medium"}`}>
                                    {email.sender}
                                  </p>
                                  <div className="flex items-center gap-1">
                                    {email.isStarred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                                    <span className="text-xs text-muted-foreground">{email.time}</span>
                                  </div>
                                </div>
                                <p className={`text-sm truncate mb-2 ${!email.isRead ? "font-medium" : "text-muted-foreground"}`}>
                                  {email.subject}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{email.preview}</p>
                                <div className="flex gap-1">
                                  {email.labels.map((label) => (
                                    <Badge
                                      variant={label.toLowerCase() === "work" ? "default" : "secondary"}
                                      key={label}
                                      className={cn("text-xs px-1 py-0")}
                                    >
                                      {label}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Email Content */}
                <div className="flex-1 flex flex-col">
                  {selectedEmail && (
                    <>
                      {/* Email Header */}
                      <div className="border-b bg-background p-4 text-foreground">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 ">
                              <AvatarImage src={selectedEmail.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-accent-foreground">
                                {selectedEmail.sender
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h2 className="text-lg font-semibold">{selectedEmail.subject}</h2>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{selectedEmail.sender}</span>
                                <span>
                                  {"<"}
                                  {selectedEmail.senderEmail}
                                  {">"}
                                </span>
                                <Badge variant="outline">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {selectedEmail.time}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Star className={`h-4 w-4 ${selectedEmail.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Tag className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {selectedEmail.labels.map((label) => (
                            <Badge key={label} variant="secondary" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Email Body */}
                      <ScrollArea className="flex-1 p-6">
                        <div className="prose prose-sm max-w-none text-foreground">
                          <p className="text-sm leading-relaxed mb-4">{selectedEmail.preview}</p>
                          <p className="text-sm leading-relaxed mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                            aliquip ex ea commodo consequat.
                          </p>
                          <p className="text-sm leading-relaxed mb-4">
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                            laborum.
                          </p>
                          <p className="text-sm leading-relaxed">
                            Best regards,
                            <br />
                            {selectedEmail.sender}
                          </p>
                        </div>
                      </ScrollArea>

                      {/* Email Actions */}
                      <Separator />
                      <div className="p-4 bg-muted/20">
                        <div className="flex items-center gap-2">
                          <Button size="sm">
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </Button>
                          <Button variant="outline" size="sm">
                            <ReplyAll className="h-4 w-4 mr-2" />
                            Reply All
                          </Button>
                          <Button variant="outline" size="sm">
                            <Forward className="h-4 w-4 mr-2" />
                            Forward
                          </Button>
                          <div className="flex-1" />
                          <Button variant="outline" size="sm">
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};
