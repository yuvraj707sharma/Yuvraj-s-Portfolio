"use client";

import { Center, Environment, Text3D } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RefObject, Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { cn } from "@/lib/utils";

const PLANE_HEIGHT = 1;
const ROOM_DEPTH = 2;
const FOV = 50;

const usePlaneWidth = () => {
  const { size } = useThree();
  return PLANE_HEIGHT * (size.width / Math.max(1, size.height));
};

// ─── Grid shader ──────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos    = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position  = projectionMatrix * viewMatrix * wp;
  }
`;

// All scrolling is computed in world space so the direction is always world -Z
// regardless of which wall the fragment belongs to.
const gridFragment = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  uniform float uTime;

  void main() {
    float divisions = 5.0;
    float lineWidth = 0.05;
    float speed     = 0.25;

    // Back wall (normal ≈ +Z) gets Y-scrolling; all other walls scroll in world -Z.
    float isBack    = step(0.5, abs(vWorldNormal.z));
    float sideLines = step(1.0 - lineWidth, fract((vWorldPos.z + uTime * speed) * divisions));
    float backLines = step(1.0 - lineWidth, fract((vWorldPos.y - uTime * speed) * divisions));
    float scroll    = mix(sideLines, backLines, isBack);

    // Static perpendicular grid using world X and Y.
    float xLines = step(1.0 - lineWidth, fract(vWorldPos.x * divisions));
    float yLines = step(1.0 - lineWidth, fract(vWorldPos.y * divisions));
    float cross  = clamp(xLines + yLines, 0.0, 1.0);

    float grid = clamp(scroll + cross, 0.0, 1.0);

    // Black gradient: fade lines as they recede into the room (world Z → -depth).
    float fade = smoothstep(-1.0, 0.25, vWorldPos.z);
    gl_FragColor = vec4(vec3(grid) * fade * 0.6, 1.0);
  }
`;

// ─── Voronoi helpers ──────────────────────────────────────────────────────────

type P2 = [number, number];

function clipHalf(
  poly: P2[],
  mx: number,
  my: number,
  nx: number,
  ny: number,
): P2[] {
  if (!poly.length) return [];
  const out: P2[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const da = (a[0] - mx) * nx + (a[1] - my) * ny;
    const db = (b[0] - mx) * nx + (b[1] - my) * ny;
    if (da >= 0) out.push(a);
    if (da >= 0 !== db >= 0) {
      const t = da / (da - db);
      out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
    }
  }
  return out;
}

function voronoiCell(seeds: P2[], i: number, hw: number, hh: number): P2[] {
  const [sx, sy] = seeds[i];
  let poly: P2[] = [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh],
  ];
  for (let j = 0; j < seeds.length; j++) {
    if (j === i || !poly.length) continue;
    const [ox, oy] = seeds[j];
    poly = clipHalf(poly, (sx + ox) / 2, (sy + oy) / 2, sx - ox, sy - oy);
  }
  return poly;
}

function polyCenter(poly: P2[]): P2 {
  let x = 0,
    y = 0;
  for (const [px, py] of poly) {
    x += px;
    y += py;
  }
  return [x / poly.length, y / poly.length];
}

function cellGeo(
  poly: P2[],
  cx: number,
  cy: number,
  hw: number,
  hh: number,
  depth: number,
): THREE.BufferGeometry {
  const halfD = depth / 2;
  const n = poly.length;
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];

  // Front cap (z = +halfD), then back cap (z = -halfD). Both share the canvas UV.
  for (const [x, y] of poly) {
    pos.push(x - cx, y - cy, halfD);
    uv.push((x + hw) / (2 * hw), (y + hh) / (2 * hh));
  }
  for (const [x, y] of poly) {
    pos.push(x - cx, y - cy, -halfD);
    uv.push((x + hw) / (2 * hw), (y + hh) / (2 * hh));
  }

  for (let i = 1; i < n - 1; i++) idx.push(0, i, i + 1);
  for (let i = 1; i < n - 1; i++) idx.push(n, n + i + 1, n + i);

  // Side quads — poly is CCW so (a, b, b2, a2) winds outward.
  for (let i = 0; i < n; i++) {
    const a = i;
    const b = (i + 1) % n;
    const a2 = a + n;
    const b2 = b + n;
    idx.push(a, b, b2, a, b2, a2);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

// ─── Camera ───────────────────────────────────────────────────────────────────

function CameraFit() {
  const { size } = useThree();
  const cw = usePlaneWidth();
  const ch = PLANE_HEIGHT;

  // useFrame gives us a mutable camera ref — same pattern as the original orthographic fit.
  useFrame(({ camera }) => {
    const cam = camera as THREE.PerspectiveCamera;
    const fovRad = (cam.fov * Math.PI) / 180;
    const aspect = size.width / size.height;
    const zH = ch / 2 / Math.tan(fovRad / 2);
    const zW = cw / 2 / (Math.tan(fovRad / 2) * aspect);
    const targetZ = Math.max(zH, zW);
    if (Math.abs(cam.position.z - targetZ) > 0.0001) {
      cam.position.z = targetZ;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

// ─── Room ─────────────────────────────────────────────────────────────────────

// Module-level singletons: neither hook return values nor refs, so they are freely mutable.
const planeGeo = new THREE.PlaneGeometry(1, 1);
const roomMat = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader: gridFragment,
  uniforms: { uTime: { value: 0 } },
  side: THREE.FrontSide,
});

function Room() {
  const planeWidth = usePlaneWidth();
  useFrame(({ clock }) => {
    roomMat.uniforms.uTime.value = clock.elapsedTime;
  });

  const hw = planeWidth / 2;
  const hh = PLANE_HEIGHT / 2;
  const d = ROOM_DEPTH;

  return (
    <>
      {/* back wall */}
      <mesh
        geometry={planeGeo}
        position={[0, 0, -d]}
        scale={[planeWidth, PLANE_HEIGHT, 1]}
      >
        <meshBasicMaterial color="black" />
      </mesh>
      {/* left wall */}
      <mesh
        geometry={planeGeo}
        material={roomMat}
        position={[-hw, 0, -d / 2]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[d, PLANE_HEIGHT, 1]}
      />
      {/* right wall */}
      <mesh
        geometry={planeGeo}
        material={roomMat}
        position={[hw, 0, -d / 2]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[d, PLANE_HEIGHT, 1]}
      />
      {/* ceiling */}
      <mesh
        geometry={planeGeo}
        material={roomMat}
        position={[0, hh, -d / 2]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[planeWidth, d, 1]}
      />
      {/* floor */}
      <mesh
        geometry={planeGeo}
        material={roomMat}
        position={[0, -hh, -d / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[planeWidth, d, 1]}
      />
    </>
  );
}

// ─── Normal login plane ───────────────────────────────────────────────────────

const LoginPlane = ({
  loginCanvas,
}: {
  loginCanvas: RefObject<HTMLCanvasElement | null>;
}) => {
  const planeWidth = usePlaneWidth();
  const { mat, canvasTex } = useMemo(() => {
    const el = loginCanvas.current;
    const canvasTex = el ? new THREE.CanvasTexture(el) : null;
    if (canvasTex) canvasTex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({
      map: canvasTex,
      side: THREE.DoubleSide,
      transparent: true,
    });
    return { mat, canvasTex };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const geo = useMemo(
    () => new THREE.PlaneGeometry(planeWidth, PLANE_HEIGHT),
    [planeWidth],
  );

  useFrame(() => {
    if (canvasTex) canvasTex.needsUpdate = true;
  });
  useEffect(
    () => () => {
      geo.dispose();
      mat.dispose();
      canvasTex?.dispose();
    },
    [geo, mat, canvasTex],
  );
  return <mesh geometry={geo} material={mat} />;
};

// ─── Voronoi explosion ────────────────────────────────────────────────────────

interface Frag {
  geo: THREE.BufferGeometry;
  mat: THREE.MeshBasicMaterial;
  x0: number;
  y0: number;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  rz: number;
}

const SEED_COUNT = 96;
const GRAVITY = 1.4;
const FADE_SPEED = 0.5;
const FRAG_DEPTH = 0.025;

const VoronoiExplosion = ({
  loginCanvas,
}: {
  loginCanvas: RefObject<HTMLCanvasElement | null>;
}) => {
  const planeWidth = usePlaneWidth();
  const t0 = useRef(performance.now());
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const { frags, canvasTex } = useMemo(() => {
    const el = loginCanvas.current;
    const canvasTex = el ? new THREE.CanvasTexture(el) : null;
    if (canvasTex) canvasTex.colorSpace = THREE.SRGBColorSpace;

    const hw = planeWidth / 2;
    const hh = PLANE_HEIGHT / 2;

    const seeds: P2[] = Array.from({ length: SEED_COUNT }, () => [
      (Math.random() - 0.5) * 0.92 * planeWidth,
      (Math.random() - 0.5) * 0.92 * PLANE_HEIGHT,
    ]);

    const frags: Frag[] = [];
    for (let i = 0; i < SEED_COUNT; i++) {
      const poly = voronoiCell(seeds, i, hw, hh);
      if (poly.length < 3) continue;
      const [cx, cy] = polyCenter(poly);
      const geo = cellGeo(poly, cx, cy, hw, hh, FRAG_DEPTH);

      const dist = Math.hypot(cx, cy);
      const base =
        dist < 1e-4 ? Math.random() * Math.PI * 2 : Math.atan2(cy, cx);
      const jitter = (Math.random() - 0.5) * 0.7;
      const speed = 0.35 + Math.random() * 0.65;

      frags.push({
        geo,
        mat: new THREE.MeshBasicMaterial({
          map: canvasTex,
          side: THREE.DoubleSide,
          transparent: true,
          depthTest: false,
          depthWrite: false,
        }),
        x0: cx,
        y0: cy,
        vx: Math.cos(base + jitter) * speed,
        vy: Math.sin(base + jitter) * speed,
        vz: (Math.random() - 0.5) * 0.4,
        rx: (Math.random() - 0.5) * 6,
        ry: (Math.random() - 0.5) * 6,
        rz: (Math.random() - 0.5) * 10,
      });
    }

    return { frags, canvasTex };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(() => {
    const t = (performance.now() - t0.current) / 1000;
    if (canvasTex) canvasTex.needsUpdate = true;
    const opacity = Math.max(0, 1 - t * FADE_SPEED);

    frags.forEach((f, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;
      mesh.position.set(
        f.x0 + f.vx * t,
        f.y0 + f.vy * t - 0.5 * GRAVITY * t * t,
        f.vz * t,
      );
      mesh.rotation.set(f.rx * t, f.ry * t, f.rz * t);
      f.mat.opacity = opacity;
    });
  });

  useEffect(() => {
    return () => {
      frags.forEach((f) => {
        f.geo.dispose();
        f.mat.dispose();
      });
      canvasTex?.dispose();
    };
  }, [frags, canvasTex]);

  return (
    <>
      {frags.map((f, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          geometry={f.geo}
          material={f.mat}
          position={[f.x0, f.y0, 0]}
          renderOrder={999}
        />
      ))}
    </>
  );
};

// ─── Success text (idle bob, mouse-driven rotation once exploded) ─────────────

type Rotation = { x: number; y: number };

const SuccessText = ({
  rotationRef,
  interactive,
}: {
  rotationRef: RefObject<Rotation>;
  interactive: boolean;
}) => {
  const dragGroup = useRef<THREE.Group>(null);
  const idleGroup = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const drag = dragGroup.current;
    const idle = idleGroup.current;
    if (!drag || !idle) return;

    const targetX = interactive ? rotationRef.current.x : 0;
    const targetY = interactive ? rotationRef.current.y : 0;
    const lambda = 3.5;
    drag.rotation.x = THREE.MathUtils.damp(
      drag.rotation.x,
      targetX,
      lambda,
      delta,
    );
    drag.rotation.y = THREE.MathUtils.damp(
      drag.rotation.y,
      targetY,
      lambda,
      delta,
    );

    const t = clock.elapsedTime;
    idle.rotation.y = t * 1.2;
    idle.rotation.x = Math.sin(t * 0.9) * 0.15;
    idle.position.y = Math.sin(t * 1.6) * 0.06;
  });

  const lines = ["Welcome", "Back!"];
  const size = 0.15;
  const lineHeight = 1.5;
  const lineGap = size * lineHeight;

  return (
    <group ref={dragGroup} position={[0, 0, -ROOM_DEPTH / 2]}>
      <group ref={idleGroup}>
        <Center>
          <group>
            {lines.map((line, i) => (
              <Center key={i} position={[0, -i * lineGap, 0]} disableY>
                <Text3D
                  font="/inter.json"
                  size={size}
                  height={0.025}
                  bevelEnabled
                  bevelSize={0.002}
                  bevelThickness={0.003}
                  bevelSegments={4}
                  curveSegments={8}
                >
                  {line}
                  <meshStandardMaterial
                    color="#eaeaea"
                    metalness={1}
                    roughness={0.18}
                  />
                </Text3D>
              </Center>
            ))}
          </group>
        </Center>
      </group>
    </group>
  );
};

// ─── Scene root ───────────────────────────────────────────────────────────────

type SceneProps = {
  loginCanvas: RefObject<HTMLCanvasElement | null>;
  exploded: boolean;
};

export const Scene = ({ loginCanvas, exploded }: SceneProps) => {
  const rotationRef = useRef<Rotation>({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!exploded) return;
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    rotationRef.current.y += dx * 0.01;
    rotationRef.current.x += dy * 0.01;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      className={
        exploded
          ? "absolute inset-0 cursor-grab active:cursor-grabbing"
          : "pointer-events-none absolute inset-0"
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <Canvas
        dpr={2}
        gl={{
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
        camera={{ near: 0.01, far: 20, position: [0, 0, 1.2], fov: FOV }}
        className={cn(!exploded && "pointer-events-none!")}
      >
        <CameraFit />
        <Room />
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <SuccessText rotationRef={rotationRef} interactive={exploded} />
        </Suspense>
        {exploded ? (
          <VoronoiExplosion key="exploded" loginCanvas={loginCanvas} />
        ) : (
          <LoginPlane key="normal" loginCanvas={loginCanvas} />
        )}
      </Canvas>
    </div>
  );
};
