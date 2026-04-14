"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector4 } from "three";

import { Curl as CurlComponent } from "./curl";
import type { DragState } from "./types";

const DRAG_ACTIVATE_PX = 24;
const COMMIT_THRESHOLD = 0.75;

interface CurlProps {
  showingBack: boolean;
  onToggle: () => void;
}

export const Curl = ({ showingBack, onToggle }: CurlProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const dragRef = useRef<DragState>({
    phase: "idle",
    x: 0,
    y: 0,
    target: new Vector4(0, 0, 0, 0),
    current: new Vector4(0, 0, 0, 0),
  });

  useEffect(() => {
    const container = containerRef.current;
    const handle = handleRef.current;
    if (!container || !handle) return;

    const toLocal = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: rect.height - (e.clientY - rect.top),
      };
    };

    const onDown = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (drag.phase === "completing" || drag.phase === "rollback") return;
      const { x, y } = toLocal(e);
      drag.phase = "idle";
      drag.x = x;
      drag.y = y;
      handle.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (drag.phase === "completing" || drag.phase === "rollback") return;
      if (!e.buttons && drag.phase === "idle") return;
      const { x, y } = toLocal(e);
      const dx = x - drag.x;
      if (drag.phase === "idle") {
        if (dx > -DRAG_ACTIVATE_PX) return;
        drag.phase = "dragging";
        drag.current.set(x, y, drag.x, drag.y);
      }
      drag.target.set(x, y, drag.x, drag.y);
    };

    const onUp = () => {
      const drag = dragRef.current;
      if (drag.phase !== "dragging") {
        drag.phase = "idle";
        return;
      }
      const rect = container.getBoundingClientRect();
      const traveled = drag.target.x - drag.x;
      if (-traveled / rect.width > COMMIT_THRESHOLD) {
        drag.phase = "completing";
        drag.target.set(-rect.width, drag.y, drag.x, drag.y);
      } else {
        drag.phase = "rollback";
        drag.target.set(drag.x, drag.y, drag.x, drag.y);
      }
    };

    handle.addEventListener("pointerdown", onDown);
    handle.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      handle.removeEventListener("pointerdown", onDown);
      handle.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const onCommitDone = () => {
    dragRef.current.phase = "idle";
    onToggle();
  };

  const onRollbackDone = () => {
    dragRef.current.phase = "idle";
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
    >
      <Canvas style={{ pointerEvents: "none" }}>
        <CurlComponent
          dragRef={dragRef}
          showingBack={showingBack}
          onCommitDone={onCommitDone}
          onRollbackDone={onRollbackDone}
        />
      </Canvas>
      <div
        ref={handleRef}
        className="absolute bottom-0 right-0 size-32 rounded-tl-full  touch-none pointer-events-auto cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
