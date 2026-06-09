"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import fallbackProfile from "@/TextClipScroll/img/2.jpg";

const HERO_SOURCE_WIDTH = 1200;
const HERO_SOURCE_HEIGHT = 750;
const PRIMARY_PROFILE_IMAGE = "/images/yuvraj-hero.jpg";

class HtmlToCanvas {
  private element: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
  private width: number;
  private height: number;

  constructor(element: HTMLElement, width: number, height: number) {
    this.element = element;
    this.width = width;
    this.height = height;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  async update() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    const nextWidth = Math.floor(this.width * dpr);
    const nextHeight = Math.floor(this.height * dpr);
    if (this.canvas.width !== nextWidth || this.canvas.height !== nextHeight) {
      this.canvas.width = nextWidth;
      this.canvas.height = nextHeight;
    }

    const serialized = new XMLSerializer().serializeToString(this.element);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width:${this.width}px;height:${this.height}px">${serialized}</div>
      </foreignObject>
    </svg>`;

    const image = new Image();
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    await image.decode();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    this.texture.needsUpdate = true;
  }
}

const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float distanceToMouse = distance(uv, uMouse);
    pos.z += sin((uv.y + uTime * 0.2) * 10.0) * 0.02 * (1.0 - clamp(distanceToMouse, 0.0, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;

  void main() {
    vec2 uv = vUv;
    uv.x += sin((uv.y + uTime * 0.4) * 10.0) * 0.008;
    uv.y += cos((uv.x + uTime * 0.2) * 12.0) * 0.006;
    vec4 color = texture2D(uTexture, uv);
    gl_FragColor = color;
  }
`;

export const HeroCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [profileSrc, setProfileSrc] = useState(PRIMARY_PROFILE_IMAGE);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    
    const themeObserver = new MutationObserver(checkDark);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    
    return () => themeObserver.disconnect();
  }, []);

  useEffect(() => {
    let isCancelled = false;

    fetch(PRIMARY_PROFILE_IMAGE)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.blob();
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (!isCancelled && typeof reader.result === "string") {
            setProfileSrc(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch((err) => {
        console.error("Failed to load profile image as base64:", err);
        if (!isCancelled) {
          setProfileSrc("/images/yuvraj-clean.jpg");
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const source = sourceRef.current;
    const container = containerRef.current;

    if (!canvas || !source || !container) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 2.2;

    const geometry = new THREE.PlaneGeometry(2, 1.25, 32, 32);
    const htmlToCanvas = new HtmlToCanvas(
      source,
      HERO_SOURCE_WIDTH,
      HERO_SOURCE_HEIGHT,
    );

    const uniforms = {
      uTexture: { value: htmlToCanvas.texture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = async () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      htmlToCanvas.resize(HERO_SOURCE_WIDTH, HERO_SOURCE_HEIGHT);
      await htmlToCanvas.update();
    };

    const onMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      uniforms.uMouse.value.set(
        (event.clientX - bounds.left) / bounds.width,
        1 - (event.clientY - bounds.top) / bounds.height,
      );
    };

    let animationFrameId: number | null = null;
    const loop = async () => {
      uniforms.uTime.value += 0.015;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(loop);
    };

    resize().then(() => {
      animationFrameId = requestAnimationFrame(loop);
    });

    const observer = new MutationObserver(() => {
      htmlToCanvas.update();
    });
    observer.observe(source, { childList: true, subtree: true, attributes: true, characterData: true });

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onMove);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      htmlToCanvas.texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-border/60 bg-[#f3eee6] dark:bg-[#151516]">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),transparent_50%)]" />

      <div
        ref={sourceRef}
        className="fixed -top-[9999px] left-0 overflow-hidden bg-[#f5f0e8] p-10 text-[#171717]"
        style={{ width: HERO_SOURCE_WIDTH, height: HERO_SOURCE_HEIGHT }}
      >
        <div className={`flex h-full items-end justify-between gap-8 rounded-[28px] border bg-white/80 p-8 ${isDark ? 'border-[#f1875d]/30' : 'border-blue-600/30'}`}>
          <div className="max-w-xl space-y-4">
            <p className={`text-xs uppercase tracking-[0.25em] ${isDark ? 'text-[#f1875d]' : 'text-blue-600'}`}>Jaipur • IST</p>
            <h2 style={{ fontFamily: "var(--font-serif)" }} className="text-5xl leading-[1.05] font-semibold">
              I build AI-powered products, intelligent systems, and scalable software that turn ideas into real-world impact.
            </h2>
            <p className="text-base">Yuvraj Sharma — Product Builder & Software Developer</p>
          </div>
          <img
            src={profileSrc}
            alt="Yuvraj Sharma"
            className="h-[320px] w-[250px] rounded-3xl object-cover"
            onError={() => setProfileSrc(fallbackProfile.src)}
          />
        </div>
      </div>
    </div>
  );
};
