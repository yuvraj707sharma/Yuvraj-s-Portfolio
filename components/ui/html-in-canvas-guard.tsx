"use client";

import type { ReactNode } from "react";

import { useHtmlInCanvasSupport } from "@/hooks/use-html-in-canvas-support";

export const HtmlInCanvasGuard = ({ children }: { children: ReactNode }) => {
  const status = useHtmlInCanvasSupport();

  if (status === "supported") return <>{children}</>;
  if (status === "pending") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      <div className="text-codrops max-w-xl text-center text-base leading-relaxed">
        HTML-in-Canvas is still an experimental feature that requires enabling a
        flag to use it. You can enable it at{" "}
        <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm">
          chrome://flags/#canvas-draw-element
        </code>{" "}
        in any Chromium-based browser. If the flag doesn&apos;t appear, or the
        demos still don&apos;t work after enabling it, try Chrome Canary.
      </div>
    </div>
  );
};
