"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useRef } from "react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const storedPrefersDark = localStorage.getItem("portfolio-theme") === "dark";
      if (storedPrefersDark !== isDark) {
        requestAnimationFrame(() => setIsDark(storedPrefersDark));
        return;
      }
    }

    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const onToggle = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle color theme"
      data-cursor-label="Theme"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground transition hover:border-primary/60"
    >
      {isDark ? <SunIcon size={18} weight="duotone" /> : <MoonIcon size={18} weight="duotone" />}
    </button>
  );
};
