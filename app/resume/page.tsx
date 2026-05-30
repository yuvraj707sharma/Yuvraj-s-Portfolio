import Link from "next/link";

import { FallbackImage } from "@/components/portfolio/fallback-image";
import fallbackOlderPhoto from "@/TextClipScroll/img/6.jpg";

export const metadata = {
  title: "Resume | Yuvraj Sharma",
  description: "Resume and experience highlights for Yuvraj Sharma.",
};

const timeline = [
  {
    title: "Product Builder & Software Developer",
    subtitle: "Independent / Startup Projects",
    detail:
      "Building AI products, intelligent systems, and full-stack applications from concept to execution.",
  },
  {
    title: "JUbot",
    subtitle: "AI University Assistant",
    detail:
      "Architected a retrieval and workflow system for admissions and student support using Next.js + FastAPI + RAG components.",
  },
  {
    title: "Vital Band",
    subtitle: "Wearable Health Companion",
    detail:
      "Developed hardware-software integration for preventive health tracking and behavioral feedback loops.",
  },
];

const ResumePage = () => (
  <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 md:py-14">
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Resume</p>
        <h1 className="text-4xl font-semibold md:text-6xl" style={{ fontFamily: "var(--font-serif)" }}>
          Yuvraj Sharma
        </h1>
        <p className="mt-2 text-muted-foreground">Product Builder & Software Developer · Jaipur, Rajasthan, India</p>
      </div>
      <Link href="/" className="rounded-full border border-border px-4 py-2 text-sm" data-cursor-label="Home">
        Back to Portfolio
      </Link>
    </header>

    <section className="grid gap-6 rounded-3xl border border-border/60 bg-card p-6 md:grid-cols-[220px_1fr] md:p-8">
      <FallbackImage
        src="/images/yuvraj-older.jpg"
        fallbackSrc={fallbackOlderPhoto.src}
        alt="Yuvraj Sharma portrait"
        className="h-60 w-full rounded-2xl object-cover"
      />
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          Summary
        </h2>
        <p className="text-muted-foreground">
          I build AI-powered products, intelligent systems, and scalable software that turn ideas into real-world impact. My focus spans product strategy, full-stack delivery, and practical AI application development.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            "Next.js",
            "FastAPI",
            "Generative AI",
            "RAG",
            "Product Thinking",
            "System Design",
          ].map((skill) => (
            <span key={skill} className="rounded-full border border-border/70 px-3 py-1 text-muted-foreground">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>

    <section className="space-y-4 rounded-3xl border border-border/60 bg-card p-6 md:p-8">
      <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
        Experience Timeline
      </h2>
      <ol className="space-y-4">
        {timeline.map((item) => (
          <li key={item.title} className="rounded-2xl border border-border/50 bg-background/50 p-4">
            <p className="text-sm uppercase tracking-[0.12em] text-primary">{item.subtitle}</p>
            <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
          </li>
        ))}
      </ol>
    </section>

    <section className="rounded-3xl border border-border/60 bg-card p-6 md:p-8">
      <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
        Contact & Profiles
      </h2>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <a href="mailto:nanuuv0007@gmail.com" className="rounded-full bg-primary px-4 py-2 text-primary-foreground" data-cursor-label="Email">
          nanuuv0007@gmail.com
        </a>
        <a href="https://github.com/yuvraj707sharma" target="_blank" rel="noreferrer" className="rounded-full border border-border px-4 py-2" data-cursor-label="GitHub">
          GitHub
        </a>
        <a href="https://linkedin.com/in/yuvraj-sharma-3138b4312" target="_blank" rel="noreferrer" className="rounded-full border border-border px-4 py-2" data-cursor-label="LinkedIn">
          LinkedIn
        </a>
      </div>
    </section>
  </main>
);

export default ResumePage;
