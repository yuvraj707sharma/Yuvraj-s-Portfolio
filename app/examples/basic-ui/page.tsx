"use client";

import "./styles.css";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { GridBackground } from "@/components/ui/grid-background";

import { DrawElement } from "./components/content";
import { MacScene } from "./components/scene";

const MacModel = () => {
  return (
    <>
      <Header />
      <GridBackground className="bg-codrops" />
      <DrawElement />
      <main>
        <MacScene />
      </main>
      <Footer />
    </>
  );
};

export default MacModel;
