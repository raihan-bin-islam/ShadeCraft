import { AppSidebar } from "@/components/blocks/sidebar-16/app-sidebar";
import { SiteHeader } from "@/components/blocks/sidebar-16/site-header";
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
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  <div className="bg-muted/50 aspect-video rounded-xl" />
                  <div className="bg-muted/50 aspect-video rounded-xl" />
                  <div className="bg-muted/50 aspect-video rounded-xl" />
                </div>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
};
