"use client";

import { useEffect, useState } from "react";

import dustTexture from "@/WebGPU-clair-obscur-gommage-codrops/public/textures/dustParticle.png";
import perlinTexture from "@/WebGPU-clair-obscur-gommage-codrops/public/textures/perlin.webp";

export const GommageTransition = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(() => setActive(false), 1200);
    return () => window.clearTimeout(id);
  }, [active]);

  return (
    <div className="relative my-16 overflow-hidden rounded-3xl border border-border/60 bg-card p-6">
      <div
        className={`pointer-events-none absolute inset-0 transition-all duration-1000 ${active ? "opacity-100" : "opacity-30"}`}
        style={{
          backgroundImage: `url(${perlinTexture.src}), url(${dustTexture.src})`,
          backgroundSize: active ? "160% 160%, 180px 180px" : "120% 120%, 80px 80px",
          backgroundPosition: active ? "80% 20%, 20% 80%" : "50% 50%, 50% 50%",
          mixBlendMode: "multiply",
          filter: active ? "contrast(180%) saturate(120%)" : "contrast(110%)",
        }}
      />
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xl text-sm text-muted-foreground">
          Gommage-inspired dissolve transition adapted from the bundled WebGPU experiment into a browser-friendly layered texture blend.
        </p>
        <button
          type="button"
          onClick={() => setActive(true)}
          className="rounded-full border border-border bg-background px-4 py-2 text-xs uppercase tracking-[0.16em] text-foreground transition hover:border-primary/60 hover:text-primary"
          data-cursor-label="Dissolve"
        >
          Trigger Dissolve
        </button>
      </div>
    </div>
  );
};
