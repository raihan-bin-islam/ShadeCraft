import { Providers } from "@/components/atoms/providers";
import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import type React from "react";
import "./globals.css";

const display = Hanken_Grotesk({ subsets: ["latin"] });

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
      <body className={display.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
