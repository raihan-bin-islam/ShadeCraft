import { Providers } from "@/components/atoms/providers";
import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const display = Hanken_Grotesk({ subsets: ["latin"] });
const code = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "ShadeCraft – Shadcn theme generator",
  description:
    "Generate stunning themes for shadcn/ui components with OKLCH color space support. Customize colors, typography, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.className} ${code.variable}`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
