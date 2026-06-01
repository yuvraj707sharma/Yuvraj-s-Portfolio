import "./globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

import { PageTransition } from "@/components/portfolio/page-transition";

const SITE_URL = "https://yuvraj.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Yuvraj Sharma — Product Builder & Software Developer",
    template: "%s | Yuvraj Sharma",
  },
  description:
    "I build AI-powered products, intelligent systems, and scalable software that turn ideas into real-world impact.",
  keywords: [
    "AI Product Builder",
    "Software Developer India",
    "Product Management Portfolio",
    "AI Developer",
    "Generative AI Developer",
    "RAG Developer",
    "Full Stack Developer",
    "Startup Founder",
    "AI Engineer India",
    "Student Builder",
    "Next.js Developer",
    "FastAPI Developer",
    "Product Manager Portfolio",
    "University AI Solutions",
    "AI Applications Developer",
    "Yuvraj Sharma",
    "yuvraj.dev",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Yuvraj Sharma — Product Builder & Software Developer",
    description:
      "AI-powered products, intelligent systems, and scalable software built for real-world impact.",
    siteName: "Yuvraj Sharma Portfolio",
    images: [
      {
        url: "/images/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Yuvraj Sharma portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yuvraj Sharma — Product Builder & Software Developer",
    description:
      "AI-powered products, intelligent systems, and scalable software built for real-world impact.",
    images: ["/images/og-cover.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/icon.svg" }],
  },
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  // Needed because the theme class is persisted client-side.
  <html lang="en" suppressHydrationWarning>
    <body>
      <PageTransition>{children}</PageTransition>
    </body>
    <Analytics />
    <GoogleAnalytics gaId="G-234XRZV28M" />
  </html>
);

export default RootLayout;
