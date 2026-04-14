import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { GridBackground } from "@/components/ui/grid-background";

import { Filter, FilterProps } from "./filter";
import { Form } from "./form";

export const Content = ({ activeEffect, onEffectChange }: FilterProps) => (
  <>
    <GridBackground className="bg-codrops" />
    <Header />
    <main className="relative z-10 flex h-full w-full flex-1 items-center justify-center">
      <Form />
    </main>
    <Footer />
    <Filter activeEffect={activeEffect} onEffectChange={onEffectChange} />
  </>
);
