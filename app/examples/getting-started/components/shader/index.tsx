import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Pixelation,
  Vignette,
} from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";
import { useEffect, useMemo } from "react";
import { CanvasTexture, LinearFilter } from "three";

import type { Effect } from "../filter";
import { RainEffect } from "./rain";

const Rain = () => {
  const effect = useMemo(() => new RainEffect(), []);
  return <primitive object={effect} dispose={null} />;
};

const SourceTexture = () => {
  const { viewport } = useThree();

  const texture = useMemo(() => {
    const canvas = document.getElementById("source") as HTMLCanvasElement;
    const nextTexture = new CanvasTexture(canvas);
    nextTexture.minFilter = LinearFilter;
    nextTexture.magFilter = LinearFilter;
    return nextTexture;
  }, []);

  useFrame(() => (texture.needsUpdate = true));

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

const EffectStack = ({ mode }: { mode: Effect }) => {
  switch (mode) {
    case "Pixelated":
      return (
        <EffectComposer>
          <Pixelation granularity={8} />
        </EffectComposer>
      );
    case "Rain":
      return (
        <EffectComposer>
          <Rain />
          <Vignette darkness={0.75} offset={0} />
        </EffectComposer>
      );
    case "Fluid":
      return (
        <EffectComposer>
          <Fluid fluidColor="#253ddd" />
        </EffectComposer>
      );
    default:
      return null;
  }
};

export const ShaderCanvas = ({ mode }: { mode: Effect }) => (
  <div className="pointer-events-none fixed inset-0 h-svh">
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      className="pointer-events-none!"
    >
      <SourceTexture />
      <EffectStack mode={mode} />
    </Canvas>
  </div>
);
