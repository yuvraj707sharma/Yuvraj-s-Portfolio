"use client";

import { useEffect, useRef, useState } from "react";

import clipImage from "@/TextClipScroll/img/3.png";

export const ClipScrollSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const next = 1 - (rect.bottom / total);
      setProgress(Math.min(1, Math.max(0, next)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const x = 120 - progress * 260;

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32" id="about">
      <div className="space-y-4 pb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Text Clip Scroll</p>
        <h2 className="max-w-3xl text-3xl font-semibold md:text-5xl" style={{ fontFamily: "var(--font-serif)" }}>
          Builder mindset. Systems thinking. Product velocity.
        </h2>
      </div>

      <div className="rounded-3xl border border-border/60 bg-card p-4 md:p-8">
        <svg viewBox="0 0 1200 420" className="w-full overflow-visible">
          <defs>
            <clipPath id="portfolio-clip">
              <text x={x} y="220" style={{ fontSize: "170px", fontWeight: 700, fontFamily: "var(--font-serif)" }}>
                YUVRAJ
              </text>
              <text x={x + 40} y="350" style={{ fontSize: "140px", fontWeight: 600, fontFamily: "var(--font-sans)" }}>
                SHARMA
              </text>
            </clipPath>
          </defs>

          <image
            href={clipImage.src}
            width="1200"
            height="420"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#portfolio-clip)"
          />
          <rect width="1200" height="420" fill="none" stroke="currentColor" opacity="0.18" />
        </svg>
      </div>
    </section>
  );
};
