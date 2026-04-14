"use client";

import { useEffect, useState } from "react";

import { Content } from "./components/content";
import { ShaderCanvas } from "./components/shader";

const GettingStarted = () => {
  const [effectMode, setEffectMode] = useState("Default");

  useEffect(() => {
    const canvas = document.getElementById("source");
    const content = document.getElementById("content");
    const ctx = canvas.getContext("2d");

    canvas.onpaint = () => {
      ctx.reset();
      ctx.drawElementImage(content, 0, 0);
    };

    canvas.requestPaint();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.requestPaint();
    };

    onResize();

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <canvas
        layoutsubtree="true"
        suppressHydrationWarning
        className="absolute inset-0"
        id="source"
      >
        <div
          id="content"
          className="relative flex h-svh w-full flex-col overflow-scroll"
        >
          <Content activeEffect={effectMode} onEffectChange={setEffectMode} />
        </div>
      </canvas>

      <ShaderCanvas mode={effectMode} />
    </>
  );
};

export default GettingStarted;
