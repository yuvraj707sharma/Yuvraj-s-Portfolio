"use client";

import "./styles.css";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { GridBackground } from "@/components/ui/grid-background";
import { HtmlInCanvasGuard } from "@/components/ui/html-in-canvas-guard";

import { DrawElement } from "./components/content";
import { MacScene } from "./components/scene";

const MacModel = () => {
  return (
    <HtmlInCanvasGuard>
      <Header />
      <GridBackground className="bg-codrops" />
      <DrawElement />
      <main>
        <MacScene />
      </main>
      <Footer />
    </HtmlInCanvasGuard>
  );
};

export default MacModel;
