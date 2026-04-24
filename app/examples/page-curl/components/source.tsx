"use client";

import clsx from "clsx";
import { ReactNode, useEffect, useRef } from "react";

interface PaintCanvas extends HTMLCanvasElement {
  requestPaint: () => void;
  onpaint: (() => void) | null;
}

interface DrawCtx extends CanvasRenderingContext2D {
  drawElementImage: (el: HTMLElement, x: number, y: number) => void;
}

interface SourceProps {
  id: string;
  children: ReactNode;
  active?: boolean;
}

export const Source = ({ id, children, active = true }: SourceProps) => {
  const canvasRef = useRef<PaintCanvas>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    if (!canvas || !scene) return;

    const ctx = canvas.getContext("2d") as DrawCtx | null;
    if (!ctx) return;

    canvas.onpaint = () => {
      ctx.reset();
      ctx.drawElementImage(scene, 0, 0);
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

    return () => {
      observer.disconnect();
      canvas.onpaint = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      // @ts-expect-error layoutsubtree is a canvas html-in-canvas attribute
      layoutsubtree="true"
      suppressHydrationWarning
      className={clsx(
        "absolute inset-0 h-full w-full",
        active ? "" : "pointer-events-none",
      )}
    >
      <div ref={sceneRef} className="h-full w-full">
        {children}
      </div>
    </canvas>
  );
};
