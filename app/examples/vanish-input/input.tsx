"use client";

import { useEffect, useEffectEvent, useRef } from "react";

import { Input as InputComponent } from "@/components/ui/input";

import { luminance, particleColor } from "./utils";

const PARTICLE_CONFIG = { speed: 2, dispersion: 0.33, decay: 0.01 };

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  alpha: number;
  color: string;
}

interface CustomHTMLCanvasElement extends HTMLCanvasElement {
  requestPaint: () => void;
  onpaint: () => void;
}

interface CustomCanvasRenderingContext2D extends CanvasRenderingContext2D {
  drawElementImage: (element: HTMLElement, dx: number, dy: number) => void;
}

export const Input = () => {
  const canvasRef = useRef<CustomHTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ctxRef = useRef<CustomCanvasRenderingContext2D>(null);

  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const stepRef = useRef<() => void>(() => {});
  const captureRequestedRef = useRef<boolean>(false);
  const animatingRef = useRef<boolean>(false);
  const sweepEdgeRef = useRef<number>(0);

  const stepAnimation = useEffectEvent(() => {
    const { speed, decay, dispersion } = PARTICLE_CONFIG;

    const nextSweepEdge = sweepEdgeRef.current - speed;
    const activeParticles = [];

    for (const particle of particlesRef.current) {
      if (particle.originX < nextSweepEdge) {
        activeParticles.push(particle);
        continue;
      }

      const alpha = particle.alpha - decay * Math.random();

      if (alpha <= 0.02) continue;

      activeParticles.push({
        ...particle,
        alpha,
        x: particle.x + (Math.random() > 0.5 ? 1 : -1) * dispersion,
        y: particle.y + (Math.random() > 0.5 ? 1 : -1) * dispersion,
      });
    }

    particlesRef.current = activeParticles;
    sweepEdgeRef.current = nextSweepEdge;

    canvasRef.current?.requestPaint();

    if (activeParticles.length > 0) {
      animationRef.current = requestAnimationFrame(() => stepRef.current());
      return;
    }

    animatingRef.current = false;
    particlesRef.current = [];
    sweepEdgeRef.current = 0;

    if (inputRef.current) {
      inputRef.current.style.color = "";
      inputRef.current.style.caretColor = "";
      inputRef.current.value = "";
      inputRef.current.focus();
    }

    canvasRef.current?.requestPaint();
  });

  useEffect(() => (stepRef.current = stepAnimation), []);

  const startAnimation = useEffectEvent(() => {
    if (!particlesRef.current.length) return;

    animatingRef.current = true;

    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    animationRef.current = requestAnimationFrame(() => stepRef.current());
  });

  const captureParticles = useEffectEvent(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    const image = ctx.getImageData(0, 0, w, h).data;
    const nextParticles = [];
    let maxX = 0;

    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const index = (y * w + x) * 4;

        const alpha = image[index + 3];
        if (alpha < 24) continue;

        const color = [image[index], image[index + 1], image[index + 2]];

        const luma = luminance(color[0], color[1], color[2]);
        if (luma > 245) continue;

        nextParticles.push({
          originX: x,
          originY: y,
          x,
          y,
          alpha: 1,
          color: particleColor(color[0], color[1], color[2], alpha),
        });

        if (x > maxX) maxX = x;
      }
    }

    particlesRef.current = nextParticles;
    sweepEdgeRef.current = maxX;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = sceneRef.current;

    if (!canvas || !scene) return;

    const ctx = canvas.getContext("2d") as CustomCanvasRenderingContext2D;

    if (!ctx) return;

    ctxRef.current = ctx;

    canvas.onpaint = () => {
      ctx.reset();

      ctx.drawElementImage(scene, 0, 0);

      if (captureRequestedRef.current) {
        captureRequestedRef.current = false;
        captureParticles();
        startAnimation();

        canvas.requestPaint();
        return;
      }

      if (!animatingRef.current) return;

      if (inputRef.current) {
        inputRef.current.style.color = "transparent";
        inputRef.current.style.caretColor = "transparent";
      }

      ctx.drawElementImage(scene, 0, 0);

      for (const particle of particlesRef.current) {
        const { originX, originY, x, y, alpha, color } = particle;

        const dx = originX < sweepEdgeRef.current ? originX : x;
        const dy = originX < sweepEdgeRef.current ? originY : y;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fillRect(dx, dy, 1, 1);
      }
    };

    const resizeObserver = new ResizeObserver(([entry]) => {
      canvas.width = Math.round(entry.contentRect.width);
      canvas.height = Math.round(entry.contentRect.height);

      canvas.requestPaint();
    });

    resizeObserver.observe(canvas);

    canvas.requestPaint();

    return () => {
      resizeObserver.disconnect();
      canvas.onpaint = () => {};
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key !== "Enter" ||
      !inputRef.current?.value.trim() ||
      animatingRef.current
    )
      return;

    captureRequestedRef.current = true;
    canvasRef.current?.requestPaint();
  };

  return (
    <div className="relative z-10 w-full max-w-2xl">
      <div className="rounded-3xl border border-white/25 bg-white/10 p-2 shadow-2xl backdrop-blur">
        <canvas
          ref={canvasRef}
          // @ts-expect-error - canvas.layoutsubtree is not typed
          layoutsubtree="true"
          suppressHydrationWarning
          className="block h-16 w-full"
        >
          <div
            ref={sceneRef}
            className="flex h-full w-full items-center gap-3 rounded-xl bg-white p-4"
          >
            <InputComponent
              ref={inputRef}
              onKeyDown={handleSubmit}
              placeholder="What's your secret?"
              className="h-16 border-0 px-0 text-xl! font-bold focus-visible:border-0 focus-visible:ring-0 bg-white!"
            />
          </div>
        </canvas>
      </div>
    </div>
  );
};
