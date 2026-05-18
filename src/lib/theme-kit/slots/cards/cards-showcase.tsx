"use client";

import * as React from "react";
import {
  Bell,
  Check,
  ChevronsUpDown,
  CircleDashed,
  CreditCard,
  Github,
  GitFork,
  Mail,
  Minus,
  Plus,
  Send,
  Star,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { SlotComponentProps } from "../_types";

/* -------------------------------------------------------------------------- */
/*  Account                                                                   */
/* -------------------------------------------------------------------------- */

function CardCreateAccount(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cards-acc-email">Email</Label>
          <Input id="cards-acc-email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cards-acc-password">Password</Label>
          <Input id="cards-acc-password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create account</Button>
      </CardFooter>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Payment method                                                            */
/* -------------------------------------------------------------------------- */

function CardPaymentMethod(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment method</CardTitle>
        <CardDescription>
          Add a new payment method to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-4">
          <Label
            htmlFor="cards-pay-card"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground has-[[data-state=checked]]:border-primary"
          >
            <RadioGroupItem id="cards-pay-card" value="card" className="sr-only" />
            <CreditCard className="mb-3 h-6 w-6" />
            Card
          </Label>
          <Label
            htmlFor="cards-pay-paypal"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground has-[[data-state=checked]]:border-primary"
          >
            <RadioGroupItem id="cards-pay-paypal" value="paypal" className="sr-only" />
            <CircleDashed className="mb-3 h-6 w-6" />
            PayPal
          </Label>
          <Label
            htmlFor="cards-pay-apple"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground has-[[data-state=checked]]:border-primary"
          >
            <RadioGroupItem id="cards-pay-apple" value="apple" className="sr-only" />
            <CircleDashed className="mb-3 h-6 w-6" />
            Apple
          </Label>
        </RadioGroup>
        <div className="grid gap-2">
          <Label htmlFor="cards-pay-name">Name</Label>
          <Input id="cards-pay-name" placeholder="First Last" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cards-pay-number">Card number</Label>
          <Input id="cards-pay-number" placeholder="" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cards-pay-month">Expires</Label>
            <Select>
              <SelectTrigger id="cards-pay-month">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">January</SelectItem>
                <SelectItem value="2">February</SelectItem>
                <SelectItem value="3">March</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cards-pay-year">Year</Label>
            <Select>
              <SelectTrigger id="cards-pay-year">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
                <SelectItem value="2028">2028</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cards-pay-cvc">CVC</Label>
            <Input id="cards-pay-cvc" placeholder="CVC" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Continue</Button>
      </CardFooter>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Team members                                                              */
/* -------------------------------------------------------------------------- */

const teamMembers = [
  { name: "Sofia Davis", email: "m@example.com", role: "Owner", initials: "SD" },
  { name: "Jackson Lee", email: "p@example.com", role: "Developer", initials: "JL" },
  { name: "Isabella Nguyen", email: "i@example.com", role: "Billing", initials: "IN" },
];

function CardTeamMembers(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardDescription>
          Invite your team members to collaborate.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {teamMembers.map((member) => (
          <div key={member.email} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>
            <Select defaultValue={member.role.toLowerCase()}>
              <SelectTrigger className="ml-auto w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Share document                                                            */
/* -------------------------------------------------------------------------- */

const sharedWith = [
  { name: "Olivia Martin", email: "olivia@example.com", access: "Edit", initials: "OM" },
  { name: "Isabella Nguyen", email: "isabella@example.com", access: "View", initials: "IN" },
  { name: "Sofia Davis", email: "sofia@example.com", access: "View", initials: "SD" },
];

function CardShare(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share this document</CardTitle>
        <CardDescription>
          Anyone with the link can view this document.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Input
            value="https://shadecraft.app/themes/atlas-7f3a"
            readOnly
          />
          <Button variant="secondary" className="shrink-0">
            Copy link
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="space-y-4">
          <h4 className="text-sm font-medium">People with access</h4>
          <div className="grid gap-6">
            {sharedWith.map((person) => (
              <div
                key={person.email}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{person.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.email}</p>
                  </div>
                </div>
                <Select defaultValue={person.access.toLowerCase()}>
                  <SelectTrigger className="ml-auto w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit">Edit</SelectItem>
                    <SelectItem value="view">View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Date picker                                                               */
/* -------------------------------------------------------------------------- */

function CardDatePicker(): React.JSX.Element {
  return (
    <Card className="p-0 overflow-hidden">
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 4, 1)}
        numberOfMonths={1}
        className="bg-card"
      />
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Notifications (forms-stack)                                               */
/* -------------------------------------------------------------------------- */

function CardNotifications(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what you want to be notified about.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="rounded-md border p-4 flex items-center gap-4">
          <Bell className="h-5 w-5" />
          <div className="flex-1 space-y-0.5">
            <p className="text-sm font-medium leading-none">Everything</p>
            <p className="text-sm text-muted-foreground">
              Email digest, mentions, all activity.
            </p>
          </div>
        </div>
        {[
          {
            title: "Available",
            description: "Only notify me when I'm available.",
            defaultChecked: true,
          },
          {
            title: "Mentions",
            description: "Notify me when someone mentions me.",
            defaultChecked: true,
          },
          {
            title: "Nothing",
            description: "Turn off all notifications.",
            defaultChecked: false,
          },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between gap-4 px-1 py-2"
          >
            <div className="space-y-0.5">
              <Label className="text-sm">{item.title}</Label>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <Switch defaultChecked={item.defaultChecked} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Cookie settings                                                           */
/* -------------------------------------------------------------------------- */

function CardCookieSettings(): React.JSX.Element {
  const items = [
    {
      id: "strictly-necessary",
      title: "Strictly necessary",
      description: "Required for the site to function.",
      defaultChecked: true,
    },
    {
      id: "functional",
      title: "Functional cookies",
      description: "Remember your preferences and choices.",
      defaultChecked: false,
    },
    {
      id: "performance",
      title: "Performance cookies",
      description: "Help us understand how you use the site.",
      defaultChecked: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cookie settings</CardTitle>
        <CardDescription>
          Manage your cookie preferences. Update anytime.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4"
          >
            <div className="space-y-0.5">
              <Label htmlFor={`cookie-${item.id}`} className="text-sm font-medium">
                {item.title}
              </Label>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <Switch id={`cookie-${item.id}`} defaultChecked={item.defaultChecked} />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Save preferences
        </Button>
      </CardFooter>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Report issue                                                              */
/* -------------------------------------------------------------------------- */

function CardReportIssue(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an issue</CardTitle>
        <CardDescription>
          We&apos;ll investigate and get back to you within 24 hours.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cards-issue-area">Area</Label>
            <Select defaultValue="billing">
              <SelectTrigger id="cards-issue-area">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="deployments">Deployments</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cards-issue-severity">Severity</Label>
            <Select defaultValue="2">
              <SelectTrigger id="cards-issue-severity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Severity 1</SelectItem>
                <SelectItem value="2">Severity 2</SelectItem>
                <SelectItem value="3">Severity 3</SelectItem>
                <SelectItem value="4">Severity 4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cards-issue-subject">Subject</Label>
          <Input id="cards-issue-subject" placeholder="I need help with..." />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cards-issue-description">Description</Label>
          <Textarea
            id="cards-issue-description"
            placeholder="Please include all information relevant to your issue."
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter className="justify-between space-x-2">
        <Button variant="ghost">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Chat                                                                      */
/* -------------------------------------------------------------------------- */

const chatMessages: Array<{ role: "me" | "them"; text: string }> = [
  { role: "them", text: "Hey, how's it going?" },
  { role: "me", text: "Pretty good. Working on the design system rebuild." },
  { role: "them", text: "Need any help with it?" },
  { role: "me", text: "I'm good for now, thanks!" },
];

function CardChat(): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar>
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base">Sofia Davis</CardTitle>
          <CardDescription>sofia@example.com</CardDescription>
        </div>
        <Button
          size="icon"
          variant="outline"
          className="ml-auto rounded-full"
          aria-label="New message"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={
                msg.role === "me"
                  ? "ml-auto max-w-[75%] rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm"
                  : "max-w-[75%] rounded-lg bg-muted px-3 py-2 text-sm"
              }
            >
              {msg.text}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <form className="flex w-full items-center gap-2">
          <Input
            placeholder="Type your message..."
            className="flex-1"
            aria-label="Message"
          />
          <Button size="icon" type="submit" aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stats — subscriptions / revenue                                           */
/* -------------------------------------------------------------------------- */

const subsData = [
  { x: "Jan", v: 245 },
  { x: "Feb", v: 312 },
  { x: "Mar", v: 380 },
  { x: "Apr", v: 408 },
  { x: "May", v: 502 },
  { x: "Jun", v: 588 },
  { x: "Jul", v: 642 },
];

function CardStatsSubscriptions(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Subscriptions</CardDescription>
        <CardTitle className="text-3xl font-bold tracking-tight">+2,350</CardTitle>
        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
      </CardHeader>
      <CardContent>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={subsData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <Line
                type="monotone"
                dataKey="v"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

const revenueData = [
  { x: "Mon", v: 1240 },
  { x: "Tue", v: 1820 },
  { x: "Wed", v: 1450 },
  { x: "Thu", v: 2100 },
  { x: "Fri", v: 2880 },
  { x: "Sat", v: 3210 },
  { x: "Sun", v: 2960 },
];

function CardStatsRevenue(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Total revenue</CardDescription>
        <CardTitle className="text-3xl font-bold tracking-tight">$15,231.89</CardTitle>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardHeader>
      <CardContent>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <Bar dataKey="v" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  GitHub repo card                                                          */
/* -------------------------------------------------------------------------- */

function CardGithub(): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            shadcn-ui/ui
          </CardTitle>
          <CardDescription>
            Beautifully designed components you can copy and paste.
          </CardDescription>
        </div>
        <Button size="sm" variant="secondary" className="px-3">
          <Star className="mr-1.5 h-3.5 w-3.5" />
          Star
          <Separator orientation="vertical" className="mx-2 h-4" />
          84.2k
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[var(--chart-2)]" />
            TypeScript
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5" />
            84.2k
          </div>
          <div className="flex items-center gap-1.5">
            <GitFork className="h-3.5 w-3.5" />
            5.6k
          </div>
          <div>Updated 2 days ago</div>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Activity goal (slider + tiny bar chart)                                   */
/* -------------------------------------------------------------------------- */

const activityData = [
  { x: "Mon", v: 320 },
  { x: "Tue", v: 412 },
  { x: "Wed", v: 286 },
  { x: "Thu", v: 380 },
  { x: "Fri", v: 510 },
  { x: "Sat", v: 244 },
  { x: "Sun", v: 366 },
];

function CardActivityGoal(): React.JSX.Element {
  const [goal, setGoal] = React.useState(350);
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Move goal</CardTitle>
        <CardDescription>Set your daily activity goal.</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-center gap-6">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full shrink-0"
            onClick={() => setGoal((g) => Math.max(200, g - 10))}
            aria-label="Decrease"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <div className="text-5xl font-bold tracking-tighter">{goal}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              Calories / day
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full shrink-0"
            onClick={() => setGoal((g) => Math.min(600, g + 10))}
            aria-label="Increase"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-6 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <Bar dataKey="v" fill="var(--primary)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Set goal</Button>
      </CardFooter>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Exercise minutes                                                          */
/* -------------------------------------------------------------------------- */

const exerciseData = [
  { x: "Mon", v: 30, b: 22 },
  { x: "Tue", v: 45, b: 28 },
  { x: "Wed", v: 38, b: 34 },
  { x: "Thu", v: 52, b: 40 },
  { x: "Fri", v: 41, b: 36 },
  { x: "Sat", v: 60, b: 48 },
  { x: "Sun", v: 24, b: 30 },
];

function CardExerciseMinutes(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise minutes</CardTitle>
        <CardDescription>
          Your exercise minutes are ahead of where you normally are.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={exerciseData}
              margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
            >
              <XAxis
                dataKey="x"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="v"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="b"
                stroke="var(--muted-foreground)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Payments (recent transactions)                                            */
/* -------------------------------------------------------------------------- */

const payments = [
  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", initials: "OM" },
  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", initials: "JL" },
  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", initials: "IN" },
  { name: "William Kim", email: "will@email.com", amount: "+$99.00", initials: "WK" },
  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", initials: "SD" },
];

function CardPayments(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent sales</CardTitle>
        <CardDescription>You made 265 sales this month.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {payments.map((payment) => (
          <div key={payment.email} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{payment.initials}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">{payment.name}</p>
              <p className="text-sm text-muted-foreground">{payment.email}</p>
            </div>
            <div className="ml-auto font-medium">{payment.amount}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Forms (compact notifications-style stack)                                 */
/* -------------------------------------------------------------------------- */

function CardForms(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Forms</CardTitle>
        <CardDescription>
          Tweak the defaults that ship with every workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between space-x-2">
          <Label
            htmlFor="forms-marketing"
            className="flex flex-col space-y-1 cursor-pointer"
          >
            <span>Marketing emails</span>
            <span className="font-normal text-sm text-muted-foreground">
              Receive emails about new products and features.
            </span>
          </Label>
          <Switch id="forms-marketing" />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label
            htmlFor="forms-security"
            className="flex flex-col space-y-1 cursor-pointer"
          >
            <span>Security emails</span>
            <span className="font-normal text-sm text-muted-foreground">
              Receive emails about your account activity.
            </span>
          </Label>
          <Switch id="forms-security" defaultChecked />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Checkbox id="forms-newsletter" defaultChecked />
          <Label htmlFor="forms-newsletter" className="font-normal">
            Subscribe to the weekly newsletter.
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Upgrade plan (small CTA card)                                             */
/* -------------------------------------------------------------------------- */

function CardUpgrade(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Unlock unlimited themes, premium exports, and priority support.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {["Unlimited themes", "Premium exports", "Priority support"].map(
            (line) => (
              <li key={line} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                {line}
              </li>
            )
          )}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Upgrade plan</Button>
      </CardFooter>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Combobox / picker (account switcher demo)                                 */
/* -------------------------------------------------------------------------- */

function CardWorkspacePicker(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Switch workspace</CardTitle>
        <CardDescription>Pick the workspace you want to view.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Button
          variant="outline"
          className="w-full justify-between font-normal"
        >
          <span className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[10px]">AC</AvatarFallback>
            </Avatar>
            Acme Inc.
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-60" />
        </Button>
        <div className="text-xs text-muted-foreground">
          You belong to 3 workspaces.
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Showcase composition                                                       */
/* -------------------------------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CardsShowcase(_props: SlotComponentProps): React.JSX.Element {
  const cards: Array<{ key: string; node: React.ReactNode }> = [
    { key: "subs", node: <CardStatsSubscriptions /> },
    { key: "revenue", node: <CardStatsRevenue /> },
    { key: "create-account", node: <CardCreateAccount /> },
    { key: "exercise", node: <CardExerciseMinutes /> },
    { key: "activity", node: <CardActivityGoal /> },
    { key: "payment", node: <CardPaymentMethod /> },
    { key: "team", node: <CardTeamMembers /> },
    { key: "chat", node: <CardChat /> },
    { key: "share", node: <CardShare /> },
    { key: "forms", node: <CardForms /> },
    { key: "report", node: <CardReportIssue /> },
    { key: "cookie", node: <CardCookieSettings /> },
    { key: "notifications", node: <CardNotifications /> },
    { key: "date", node: <CardDatePicker /> },
    { key: "github", node: <CardGithub /> },
    { key: "workspace", node: <CardWorkspacePicker /> },
    { key: "payments", node: <CardPayments /> },
    { key: "upgrade", node: <CardUpgrade /> },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl py-12 px-6">
      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 [column-fill:balance]">
        {cards.map(({ key, node }) => (
          <div key={key} className="mb-4 break-inside-avoid">
            {node}
          </div>
        ))}
      </div>
    </section>
  );
}
