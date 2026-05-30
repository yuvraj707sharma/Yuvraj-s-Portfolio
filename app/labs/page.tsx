import Link from "next/link";

import webgpuPreview from "@/WebGPU-clair-obscur-gommage-codrops/public/preview.png";

export const metadata = {
  title: "Labs | Yuvraj Sharma",
  description: "Creative experiments and interaction labs used in the portfolio.",
};

const labs = [
  {
    title: "HTML → Canvas Hero Treatment",
    source: "three-html-to-canvas/",
    note: "Adapted the HTML rasterization + projection approach for the homepage WebGL hero panel.",
  },
  {
    title: "Scroll Clip Typography",
    source: "TextClipScroll/",
    note: "Adapted clip-path typography movement for the About section in the portfolio homepage.",
  },
  {
    title: "Gommage Dissolve",
    source: "WebGPU-clair-obscur-gommage-codrops/",
    note: "Used bundled textures and dissolve behavior inspiration for a cross-browser transition block.",
  },
];

const LabsPage = () => (
  <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 md:py-14">
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Labs</p>
        <h1 className="text-4xl font-semibold md:text-6xl" style={{ fontFamily: "var(--font-serif)" }}>
          Process, Prototypes, Motion Studies
        </h1>
      </div>
      <Link href="/" className="rounded-full border border-border px-4 py-2 text-sm" data-cursor-label="Home">
        Back to Portfolio
      </Link>
    </header>

    <section className="overflow-hidden rounded-3xl border border-border/60 bg-card">
      <img src={webgpuPreview.src} alt="WebGPU gommage lab preview" className="h-56 w-full object-cover" />
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          This page documents where each bundled internal resource is actively used in the live portfolio implementation.
        </p>
      </div>
    </section>

    <section className="grid gap-4 md:grid-cols-3">
      {labs.map((lab) => (
        <article key={lab.title} className="rounded-2xl border border-border/60 bg-card p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-primary">{lab.source}</p>
          <h2 className="mt-2 text-lg font-semibold">{lab.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{lab.note}</p>
        </article>
      ))}
    </section>

    <section className="rounded-3xl border border-border/60 bg-card p-6">
      <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
        External Inspiration Threads
      </h2>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        <li>Codrops rhythm: cinematic section pacing and layered transitions.</li>
        <li>damarberlari CodePens: magnetic hover behavior and kinetic pointer context.</li>
        <li>Cullen Webber demo: HTML snapshotting onto canvas-like surfaces.</li>
        <li>dextersulit.com: typography-led layout hierarchy with restrained motion.</li>
      </ul>
    </section>
  </main>
);

export default LabsPage;
