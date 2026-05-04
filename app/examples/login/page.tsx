"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { GridBackground } from "@/components/ui/grid-background";

import { LoginElement } from "./components/login-element";

interface PaintCanvas extends HTMLCanvasElement {
  requestPaint: () => void;
  onpaint: (() => void) | null;
}

interface DrawCtx extends CanvasRenderingContext2D {
  drawElementImage: (el: HTMLElement, x: number, y: number) => void;
}

const Scene = dynamic(() => import("./components/scene").then((m) => m.Scene), {
  ssr: false,
});

const Login = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  const canvasRef = useRef<PaintCanvas>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const content = contentRef.current;
    if (!canvas || !content) return;

    const ctx = canvas.getContext("2d") as DrawCtx | null;
    if (!ctx) return;

    canvas.onpaint = () => {
      ctx.reset();
      ctx.drawElementImage(content, 0, 0);
    };

    const resize = () => {
      const w = Math.max(1, canvas.clientWidth);
      const h = Math.max(1, canvas.clientHeight);
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      canvas.requestPaint();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    // Wait two frames so the first onpaint runs before the WebGL texture samples it.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setSceneReady(true));
    });

    return () => {
      observer.disconnect();
      canvas.onpaint = null;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  return (
    <>
      <Header />
      <GridBackground className="bg-codrops" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative overflow-hidden rounded-3xl border-2 border-white/10 shadow-2xl">
          <canvas
            ref={canvasRef}
            // @ts-expect-error layoutsubtree is a canvas html-in-canvas attribute
            layoutsubtree="true"
            suppressHydrationWarning
            className={clsx(
              "relative aspect-square h-96 w-96",
              loggedIn && "pointer-events-none",
            )}
          >
            <div ref={contentRef} className="h-96 w-96">
              <LoginElement
                onLogin={() => setLoggedIn(true)}
                loggedIn={loggedIn}
              />
            </div>
          </canvas>

          {sceneReady && <Scene loginCanvas={canvasRef} exploded={loggedIn} />}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
