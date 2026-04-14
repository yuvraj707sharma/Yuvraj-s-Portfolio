import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { CanvasTexture, LinearFilter, ShaderMaterial, Vector4 } from "three";

import { fragmentShader, vertexShader } from "./shaders";
import type { DragState } from "./types";

const IDLE_CORNER_OFFSET = 0;
const EASE = 0.1;
const SETTLE_EPSILON = 0.5;

const makeCanvasTexture = (canvas: HTMLCanvasElement) => {
  const tex = new CanvasTexture(canvas);
  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;
  return tex;
};

interface CurlProps {
  dragRef: React.RefObject<DragState>;
  showingBack: boolean;
  onCommitDone: () => void;
  onRollbackDone: () => void;
}

export const Curl = ({
  dragRef,
  showingBack,
  onCommitDone,
  onRollbackDone,
}: CurlProps) => {
  const { viewport, size } = useThree();
  const materialRef = useRef<ShaderMaterial | null>(null);
  const frontTexRef = useRef<CanvasTexture | null>(null);
  const backTexRef = useRef<CanvasTexture | null>(null);

  const meshRefCallback = (mesh: { material: ShaderMaterial } | null) => {
    if (!mesh || materialRef.current) return;

    const front = document.getElementById("front") as HTMLCanvasElement | null;
    const back = document.getElementById("back") as HTMLCanvasElement | null;
    if (!front || !back) return;

    const frontTex = makeCanvasTexture(front);
    const backTex = makeCanvasTexture(back);

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        iResolution: { value: [1, 1, 1] },
        iMouse: { value: new Vector4(0, 0, 0, 0) },
        iActive: { value: 0 },
        iChannel0: { value: backTex },
        iChannel1: { value: frontTex },
      },
    });

    mesh.material = material;
    frontTexRef.current = frontTex;
    backTexRef.current = backTex;
    materialRef.current = material;
  };

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.iResolution.value = [size.width, size.height, 1];
  }, [size]);

  useEffect(() => {
    const material = materialRef.current;
    const frontTex = frontTexRef.current;
    const backTex = backTexRef.current;
    if (!material || !frontTex || !backTex) return;
    material.uniforms.iChannel1.value = showingBack ? frontTex : backTex;
    material.uniforms.iChannel0.value = showingBack ? backTex : frontTex;
  }, [showingBack]);

  useFrame(() => {
    const material = materialRef.current;
    const drag = dragRef.current;
    if (!material || !drag) return;

    const frontTex = frontTexRef.current;
    const backTex = backTexRef.current;
    if (frontTex) frontTex.needsUpdate = true;
    if (backTex) backTex.needsUpdate = true;

    const cur = drag.current;
    const tgt = drag.target;

    if (drag.phase === "idle") {
      tgt.set(
        size.width - IDLE_CORNER_OFFSET,
        IDLE_CORNER_OFFSET,
        size.width,
        0,
      );
      cur.copy(tgt);
    } else {
      cur.x += (tgt.x - cur.x) * EASE;
      cur.y += (tgt.y - cur.y) * EASE;
      cur.z += (tgt.z - cur.z) * EASE;
      cur.w += (tgt.w - cur.w) * EASE;
    }

    material.uniforms.iActive.value = 1;
    material.uniforms.iMouse.value.set(cur.x, cur.y, cur.z, cur.w);

    const settledX = Math.abs(cur.x - tgt.x) < SETTLE_EPSILON;
    const settledY = Math.abs(cur.y - tgt.y) < SETTLE_EPSILON;
    if (drag.phase === "completing" && settledX) onCommitDone();
    else if (drag.phase === "rollback" && settledX && settledY) onRollbackDone();
  });

  return (
    <mesh ref={meshRefCallback} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial />
    </mesh>
  );
};
