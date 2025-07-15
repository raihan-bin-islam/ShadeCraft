import Calendar27 from "@/components/blocks/calendar-27";
import { AppSidebar } from "@/components/blocks/sidebar-16/app-sidebar";
import { SiteHeader } from "@/components/blocks/sidebar-16/site-header";
import { Logo } from "@/components/icons/Logo";
import { ChartAreaLegend } from "@/components/templates/preview-components/chart/area-chart-legend";
import { ChartPieInteractive } from "@/components/templates/preview-components/chart/pie-chart-interactive";
import { LoginForm } from "@/components/templates/preview-components/form/login-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const iframeHeight = "800px";

export const description = "A sidebar with a header and a search form.";

export const SidebarPreview = () => {
  return (
    <>
      <div className="[--header-height:calc(--spacing(14))] flex flex-col overflow-y-auto">
        <SidebarProvider className="relative flex flex-col min-h-0 h-[calc(100vh-200px)] overflow-y-auto">
          <div className="flex flex-1 h-full overflow-y-auto">
            <AppSidebar collapsible="icon" variant="inset" className="relative h-full" />
            <SidebarInset className="flex flex-col relative overflow-y-auto">
              <SiteHeader />
              <div className="grow overflow-y-auto flex flex-1 flex-col gap-4 p-4">
                <div className="flex gap-2">
                  <div className="space-y-4 w-full">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex h-fit flex-wrap gap-2">
                        <Badge>Badge</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="outline">Outline</Badge>
                      </div>
                      <div className="grow h-px bg-border" />
                      <div className="flex items-center gap-2">
                        <Button>Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="link">Link</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="destructive">Destructive</Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-5">
                      <div className="flex flex-col h-full space-y-5">
                        <Calendar className="bg-background dark:text-foreground border rounded-lg" mode="range" />
                        <div className="p-8.5 w-full flex h-full bg-sidebar rounded-lg items-center justify-center gap-3">
                          <Logo className="size-8 [&>path:nth-of-type(1)]:fill-primary [&>path:nth-of-type(2)]:fill-secondary [&>path:nth-of-type(3)]:stroke-foreground" />
                          <h2 className="flex-1 text-primary font-bold text-2xl">ShadeCraft</h2>
                        </div>
                      </div>
                      <div className="min-w-sm h-full">
                        <LoginForm />
                      </div>
                      <Calendar27 />
                      {/* <div className="w-full bg-red-100"></div> */}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="basis-1/3">
                    <ChartAreaLegend />
                  </div>
                  <div className="basis-2/3">
                    <ChartPieInteractive />
                  </div>
                </div>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
};
