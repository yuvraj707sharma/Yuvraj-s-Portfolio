import clsx from "clsx";

import { Button } from "@/components/ui/button";

export const EFFECT_OPTIONS = [
  "Default",
  "Fluid",
  "Rain",
  "Pixelated",
] as const;

export type Effect = (typeof EFFECT_OPTIONS)[number];

export interface FilterProps {
  activeEffect: Effect;
  onEffectChange: (effect: Effect) => void;
}

export const Filter = ({ activeEffect, onEffectChange }: FilterProps) => (
  <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2">
    {EFFECT_OPTIONS.map((label) => (
      <Button
        key={label}
        onClick={() => onEffectChange?.(label)}
        className={clsx(
          "text-background rounded-full border text-xs uppercase transition-colors",
          activeEffect === label
            ? "border-background/40 bg-background/25"
            : "border-background/25 bg-background/5 hover:bg-background/14",
        )}
      >
        {label}
      </Button>
    ))}
  </div>
);
