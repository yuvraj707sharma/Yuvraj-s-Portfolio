"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type TransitionPhase = "idle" | "out" | "in";

const OUT_DURATION_MS = 120;
const IN_DURATION_MS = 180;

const isModifiedClick = (event: MouseEvent) =>
  event.defaultPrevented ||
  event.button !== 0 ||
  event.metaKey ||
  event.ctrlKey ||
  event.shiftKey ||
  event.altKey;

export const PageTransition = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [reducedMotion, setReducedMotion] = useState(false);
  const lastPathRef = useRef(pathname);
  const pendingHrefRef = useRef<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMediaChange = () => setReducedMotion(mediaQuery.matches);

    onMediaChange();
    mediaQuery.addEventListener("change", onMediaChange);
    return () => mediaQuery.removeEventListener("change", onMediaChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    if (lastPathRef.current === pathname) return;

    lastPathRef.current = pathname;
    setPhase("in");

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setPhase("idle");
      timeoutRef.current = null;
    }, IN_DURATION_MS);
  }, [pathname, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const onClickCapture = (event: MouseEvent) => {
      if (isModifiedClick(event) || pendingHrefRef.current) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("rel")?.includes("external")
      ) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const currentUrl = new URL(window.location.href);
      const nextUrl = new URL(anchor.href, window.location.href);
      const isSamePath =
        nextUrl.origin === currentUrl.origin &&
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search;
      const isInternal = nextUrl.origin === currentUrl.origin;

      if (!isInternal || isSamePath) return;

      event.preventDefault();
      pendingHrefRef.current = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
      setPhase("out");

      window.setTimeout(() => {
        if (pendingHrefRef.current) {
          router.push(pendingHrefRef.current);
        }
        pendingHrefRef.current = null;
      }, OUT_DURATION_MS);
    };

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [reducedMotion, router]);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className={`transition-[opacity,filter,transform] duration-200 will-change-[opacity,filter,transform] ${
          phase === "out"
            ? "opacity-0 blur-[2px] translate-y-[2px]"
            : "opacity-100 blur-0 translate-y-0"
        }`}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[70] transition-opacity duration-200 ${
          phase === "idle" ? "opacity-0" : "opacity-100"
        }`}
        style={{
          background:
            "radial-gradient(70% 45% at 25% 20%, rgba(37,99,235,0.08), transparent 70%), radial-gradient(55% 35% at 75% 70%, rgba(241,135,93,0.07), transparent 75%), linear-gradient(180deg, rgba(245,245,248,0.08), rgba(10,10,14,0.04))",
          backdropFilter: "blur(2px)",
          mixBlendMode: "soft-light",
        }}
      />
    </>
  );
};
