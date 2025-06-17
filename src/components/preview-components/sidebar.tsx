import { AppSidebar } from "@/components/blocks/sidebar-16/app-sidebar";
import { SiteHeader } from "@/components/blocks/sidebar-16/site-header";
import { ChartDemo } from "@/components/preview-components/chart";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const iframeHeight = "800px";

export const description = "A sidebar with a header and a search form.";

export const SidebarPreview = () => {
  return (
    <>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="relative flex flex-col h-fit min-h-fit max-h-fit">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar collapsible="icon" variant="inset" className="relative h-[calc(70vh)]" />
            <SidebarInset className="">
              <div className="flex flex-1 flex-col gap-4 p-4">
                <Calendar className="bg-background dark:text-foreground border rounded-lg" mode="range" />
                <div className="flex w-full flex-wrap gap-2">
                  <Badge>Badge</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
                <ChartDemo />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
};
