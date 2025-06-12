import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CustomThemeProvider } from "@/components/theme/custom-theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beautiful shadcn Themes",
  description: "Five stunning themes for shadcn/ui components with OKLCH color space support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CustomThemeProvider defaultTheme="aurora">{children}</CustomThemeProvider>
      </body>
    </html>
  );
}
