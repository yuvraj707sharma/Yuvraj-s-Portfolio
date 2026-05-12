"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { GridBackground } from "@/components/ui/grid-background";
import { HtmlInCanvasGuard } from "@/components/ui/html-in-canvas-guard";

import { BackPage,FrontPage } from "./components/pages";
import { Source } from "./components/source";

const Curl = dynamic(() => import("./components/curl").then((m) => m.Curl), {
  ssr: false,
});

const PageCurl = () => {
  const [showingBack, setShowingBack] = useState(false);

  return (
    <HtmlInCanvasGuard>
      <Header />
      <GridBackground className="bg-codrops" />
      <main className="absolute inset-0 flex flex-col items-center justify-center px-4 py-16">
        <div className="relative aspect-[1/1.6] w-full max-w-lg border border-blue-950/50 shadow-2xl">
          <Source id="back" active={showingBack}>
            <BackPage />
          </Source>
          <Source id="front" active={!showingBack}>
            <FrontPage />
          </Source>
          <Curl
            showingBack={showingBack}
            onToggle={() => setShowingBack((s) => !s)}
          />
        </div>
      </main>
      <Footer />
    </HtmlInCanvasGuard>
  );
};

export default PageCurl;
