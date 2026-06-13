"use client";

import { useEffect, useRef, useState } from "react";

const LEFT_WORDS = [
  "AI",
  "SYSTEMS",
  "PRODUCT",
  "RAG",
  "CANVASUI",
  "JUBOT",
  "VITAL BAND",
  "NEXT.JS",
  "FASTAPI",
  "DEVELOPER",
  "DESIGN",
  "CREATIVE",
  "SCALABLE",
  "EMBEDDINGS",
  "VECTOR",
  "BLE",
  "FIRMWARE",
  // Repeated to create a dense continuous ring
  "AI",
  "SYSTEMS",
  "PRODUCT",
  "RAG",
  "CANVASUI",
  "JUBOT",
  "VITAL BAND",
  "NEXT.JS",
  "FASTAPI",
  "DEVELOPER",
  "DESIGN",
  "CREATIVE",
  "SCALABLE",
  "EMBEDDINGS",
  "VECTOR",
  "BLE",
  "FIRMWARE",
  // Triplicate
  "AI",
  "SYSTEMS",
  "PRODUCT",
  "RAG",
  "CANVASUI",
  "JUBOT",
  "VITAL BAND",
  "NEXT.JS",
  "FASTAPI",
  "DEVELOPER",
  "DESIGN",
  "CREATIVE",
  "SCALABLE",
  "EMBEDDINGS",
  "VECTOR",
  "BLE",
  "FIRMWARE",
];

const RIGHT_WORDS = [
  "YUVRAJ SHARMA",
  "PORTFOLIO",
  "PROCESS",
  "PROTOTYPES",
  "MOTION",
  "BUILDER",
  "CODE",
  "ENGINEERING",
  "WORKSPACE",
  "INTELLIGENCE",
  "IMPACT",
  "DEPLOY",
  "ITERATION",
  "EXPERIMENTS",
  // Repeated to create a dense continuous ring
  "YUVRAJ SHARMA",
  "PORTFOLIO",
  "PROCESS",
  "PROTOTYPES",
  "MOTION",
  "BUILDER",
  "CODE",
  "ENGINEERING",
  "WORKSPACE",
  "INTELLIGENCE",
  "IMPACT",
  "DEPLOY",
  "ITERATION",
  "EXPERIMENTS",
  // Triplicate
  "YUVRAJ SHARMA",
  "PORTFOLIO",
  "PROCESS",
  "PROTOTYPES",
  "MOTION",
  "BUILDER",
  "CODE",
  "ENGINEERING",
  "WORKSPACE",
  "INTELLIGENCE",
  "IMPACT",
  "DEPLOY",
  "ITERATION",
  "EXPERIMENTS",
];

export const TextScrollBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLUListElement>(null);
  const rightRef = useRef<HTMLUListElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Dimensions state
    let width = window.innerWidth;
    let height = window.innerHeight;
    let leftRadius = width * 0.52;
    let rightRadius = width * 0.52;
    let leftCenterX = width * -0.15;
    let leftCenterY = height * 0.5;
    let rightCenterX = width * 1.15;
    let rightCenterY = height * 0.5;

    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height; // Height of the actual parent container (#about section)
      const isMobile = width < 768;

      if (isMobile) {
        // Larger circles on mobile, pushed further off-screen to frame margins
        leftRadius = width * 0.95;
        rightRadius = width * 0.95;
        leftCenterX = width * -0.55;
        rightCenterX = width * 1.55;
      } else {
        // Desktop framing centered on parent container width
        leftRadius = width * 0.52;
        rightRadius = width * 0.52;
        leftCenterX = width * -0.15;
        rightCenterX = width * 1.15;
      }
      
      // Center Y coordinates vertically in the middle of the #about section parent
      leftCenterY = height * 0.5;
      rightCenterY = height * 0.5;
    };

    updateDimensions();

    const leftItems = leftRef.current
      ? Array.from(leftRef.current.children) as HTMLElement[]
      : [];
    const rightItems = rightRef.current
      ? Array.from(rightRef.current.children) as HTMLElement[]
      : [];

    const totalLeft = leftItems.length;
    const totalRight = rightItems.length;

    // Distribute words around the full 360-degree circle
    const spacingLeft = (2 * Math.PI) / totalLeft;
    const spacingRight = (2 * Math.PI) / totalRight;

    let tickId: number | null = null;
    let currentScrollY = window.scrollY;

    const updatePositions = (scroll: number) => {
      const scrollFactor = prefersReducedMotion ? 0 : scroll * 0.00025;

      // Left circle positioning (Clockwise direction)
      leftItems.forEach((item, index) => {
        const angle = index * spacingLeft - scrollFactor * Math.PI * 2;
        const x = leftCenterX + Math.cos(angle) * leftRadius;
        const y = leftCenterY + Math.sin(angle) * leftRadius;
        const rotation = (angle * 180) / Math.PI;

        item.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, 0px) rotate(${rotation}deg)`;
      });

      // Right circle positioning (Counter-clockwise direction)
      rightItems.forEach((item, index) => {
        const angle = index * spacingRight + scrollFactor * Math.PI * 2;
        const x = rightCenterX + Math.cos(angle) * rightRadius;
        const y = rightCenterY + Math.sin(angle) * rightRadius;
        const rotation = (angle * 180) / Math.PI + 180;

        item.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, 0px) rotate(${rotation}deg)`;
      });
    };

    // Initial render position
    updatePositions(currentScrollY);

    const onScroll = () => {
      currentScrollY = window.scrollY;
      if (tickId === null) {
        tickId = requestAnimationFrame(() => {
          updatePositions(currentScrollY);
          tickId = null;
        });
      }
    };

    const onResize = () => {
      updateDimensions();
      updatePositions(currentScrollY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // Extra trigger for measuring height once fully loaded/hydrated
    const initialMeasureTimeout = setTimeout(onResize, 100);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(initialMeasureTimeout);
      if (tickId !== null) {
        cancelAnimationFrame(tickId);
      }
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden preserve-3d"
    >
      {/* Left Circle */}
      <ul
        ref={leftRef}
        className="absolute inset-0 list-none p-0 m-0"
      >
        {LEFT_WORDS.map((word, index) => {
          const colorVar = "var(--bg-text-color-1)";

          return (
            <li
              key={`${word}-${index}`}
              className="absolute top-0 left-0 w-80 text-center font-serif text-2xl font-bold tracking-widest uppercase transition-colors duration-300 md:text-3xl"
              style={{
                fontFamily: "var(--font-serif)",
                willChange: "transform",
                color: colorVar,
              }}
            >
              {word}
            </li>
          );
        })}
      </ul>

      {/* Right Circle */}
      <ul
        ref={rightRef}
        className="absolute inset-0 list-none p-0 m-0"
      >
        {RIGHT_WORDS.map((word, index) => {
          const colorVar = "var(--bg-text-color-1)";

          return (
            <li
              key={`${word}-${index}`}
              className="absolute top-0 left-0 w-80 text-center font-serif text-2xl font-bold tracking-widest uppercase transition-colors duration-300 md:text-3xl"
              style={{
                fontFamily: "var(--font-serif)",
                willChange: "transform",
                color: colorVar,
              }}
            >
              {word}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
