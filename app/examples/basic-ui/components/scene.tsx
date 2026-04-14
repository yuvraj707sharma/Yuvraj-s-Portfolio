"use client";

import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  Stage,
} from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { HTMLTexture, Mesh } from "three";
import { InteractionManager } from "three/addons/interaction/InteractionManager.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { screenMaterial } from "./crt-effect";

const Mac = () => {
  const gltf = useLoader(GLTFLoader, "/mac.glb");
  const { gl, camera } = useThree();
  const screenRef = useRef<Mesh>(null);

  useEffect(() => {
    gltf.scene.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [gltf]);

  const { material, interactions } = useMemo(() => {
    const element = document.getElementById("draw_element") as HTMLElement;

    const texture = new HTMLTexture(element);

    screenMaterial.uniforms.map.value = texture;
    (screenMaterial as unknown as { map: HTMLTexture }).map = texture;

    const manager = new InteractionManager();
    return { material: screenMaterial, interactions: manager };
  }, []);

  useEffect(() => {
    interactions.connect(gl, camera);
    if (screenRef.current) interactions.add(screenRef.current);
    return () => interactions.disconnect();
  }, [interactions, gl, camera]);

  useEffect(() => {
    return () => {
      material.uniforms.map.value?.dispose();
    };
  }, [material]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    interactions.update();
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

export const MacScene = () => (
  <div className="fixed inset-0 h-svh">
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
  </div>
);
