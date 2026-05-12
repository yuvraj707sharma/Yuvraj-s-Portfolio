"use client";

import { useEffect, useState } from "react";

export type HtmlInCanvasSupport = "pending" | "supported" | "unsupported";

const detect = (): boolean => {
  if (typeof window === "undefined") return false;
  const ctxProto = window.CanvasRenderingContext2D?.prototype as
    | (CanvasRenderingContext2D & {
        drawElement?: unknown;
        drawElementImage?: unknown;
      })
    | undefined;
  const canvasProto = window.HTMLCanvasElement?.prototype as
    | (HTMLCanvasElement & { requestPaint?: unknown })
    | undefined;

  const hasDraw =
    typeof ctxProto?.drawElement === "function" ||
    typeof ctxProto?.drawElementImage === "function";
  const hasPaint = typeof canvasProto?.requestPaint === "function";

  return hasDraw && hasPaint;
};

export const useHtmlInCanvasSupport = (): HtmlInCanvasSupport => {
  const [status, setStatus] = useState<HtmlInCanvasSupport>("pending");

  useEffect(() => {
    setStatus(detect() ? "supported" : "unsupported");
  }, []);

  return status;
};
