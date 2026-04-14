import { Vector4 } from "three";

export type Phase = "idle" | "dragging" | "completing" | "rollback";

export interface DragState {
  phase: Phase;
  x: number;
  y: number;
  target: Vector4;
  current: Vector4;
}
