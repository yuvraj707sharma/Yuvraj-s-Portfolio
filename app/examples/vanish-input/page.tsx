"use client";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { GridBackground } from "@/components/ui/grid-background";
import { HtmlInCanvasGuard } from "@/components/ui/html-in-canvas-guard";

import { Input } from "./input";

const SmallFeature = () => (
  <HtmlInCanvasGuard>
    <Header />
    <GridBackground className="bg-codrops" />
    <main className="absolute inset-0 flex flex-col items-center justify-center">
      <Input />
    </main>
    <Footer />
  </HtmlInCanvasGuard>
);

export default SmallFeature;
