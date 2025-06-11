import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shadcn Theme Palette Previewer",
  description: "Preview and customize shadcn UI themes with different color harmonies",
};

export default function PalettePreviewerLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
