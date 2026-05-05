import "./globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import clsx from "clsx";
import type { Metadata } from "next";
import { Geist, Literata } from "next/font/google";

import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HTML in Canvas Demo",
  description: `A quick look at the HTML-in-Canvas proposal, how it works, and what it enables with a few practical demos.`,
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="en" className={cn(clsx(geistSans.variable, literata.variable))}>
    <body>{children}</body>
    <GoogleAnalytics gaId="G-234XRZV28M" />
  </html>
);

export default RootLayout;
