import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Pixelation,
  Vignette,
} from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";
import { useEffect, useMemo, useRef } from "react";
import { CanvasTexture, LinearFilter } from "three";

import type { Effect } from "../filter";
import { RainEffect } from "./rain";

const Rain = () => {
  const effect = useMemo(() => new RainEffect(), []);
  return <primitive object={effect} dispose={null} />;
};

const SourceTexture = () => {
  const { viewport } = useThree();

  const canvas = document.getElementById("source") as HTMLCanvasElement;

  const texture = useMemo(() => {
    const nextTexture = new CanvasTexture(canvas);
    nextTexture.minFilter = LinearFilter;
    nextTexture.magFilter = LinearFilter;
    return nextTexture;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, viewport]);

  const textureRef = useRef(texture);

  useEffect(() => {
    textureRef.current = texture;
  }, [texture]);

  useFrame(() => (textureRef.current.needsUpdate = true));

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

const EffectStack = ({ mode }: { mode: Effect }) => {
  if (mode === "Default") return null;

  if (mode === "Pixelated") {
    return (
      <EffectComposer>
        <Pixelation granularity={8} />
      </EffectComposer>
    );
  }

  if (mode === "Rain") {
    return (
      <EffectComposer>
        <Rain />
        <Vignette darkness={0.75} offset={0} />
      </EffectComposer>
    );
  }

  if (mode === "Fluid") {
    return (
      <EffectComposer>
        <Fluid fluidColor="#253ddd" />
      </EffectComposer>
    );
  }

  return null;
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
