"use client";

import { ContactShadows, Float, OrbitControls, Stage } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { HTMLTexture, Mesh, type ShaderMaterial } from "three";
import { InteractionManager } from "three/addons/interaction/InteractionManager.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { screenMaterial } from "./crt-effect";

type ScreenMaterial = ShaderMaterial & { map: HTMLTexture | null };
const material = screenMaterial as ScreenMaterial;

const Mac = () => {
  const gltf = useLoader(GLTFLoader, "/mac.glb");
  const { gl, camera } = useThree();
  const screenRef = useRef<Mesh>(null);

  const interactions = useRef<InteractionManager | null>(null);

  useEffect(() => {
    const element = document.getElementById("computer_screen");
    if (!element) throw new Error("#computer_screen element not found");

    const texture = new HTMLTexture(element);

    interactions.current = new InteractionManager();

    material.uniforms.map.value = texture;
    material.map = texture;

    interactions.current.connect(gl, camera);
    if (screenRef.current) interactions.current.add(screenRef.current);

    window.dispatchEvent(new Event("mac-canvas-ready"));
  }, [gl, camera]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    interactions.current?.update();
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.05}>
      <primitive object={gltf.scene} />
      <mesh
        ref={screenRef}
        position={[0, 0.102, 0.183]}
        rotation={[(-Math.PI / 180) * 6.5, 0, 0]}
        material={material}
      >
        <planeGeometry args={[562 * 0.00062, 408 * 0.00062]} />
      </mesh>
    </Float>
  );
};

export const Scene = () => (
  <main className="fixed inset-0 h-svh">
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ position: [0.02, 0.01, 0.05], fov: 24, near: 0.1, far: 100 }}
    >
      <Suspense fallback={null}>
        <Stage
          intensity={0.5}
          environment="forest"
          shadows={false}
          adjustCamera={false}
        >
          <Mac />
        </Stage>
      </Suspense>

      <ContactShadows
        position={[0, -0.35, 0]}
        opacity={0.5}
        blur={2}
        far={4}
        resolution={128}
      />

      <OrbitControls
        enableDamping
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  </main>
);
