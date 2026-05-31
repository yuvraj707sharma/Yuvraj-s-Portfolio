import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Resume | Yuvraj Sharma",
  description: "Resume and experience highlights for Yuvraj Sharma.",
};

const RESUME = {
  name: "Yuvraj Sharma",
  title: "Product Builder & Software Developer",
  location: "Jaipur, Rajasthan, India",
  summary:
    "I build AI-powered products, intelligent systems, and scalable software from strategy to delivery, with a focus on practical outcomes and mobile-first execution.",
  actions: {
    email: "mailto:nanuuv0007@gmail.com",
    download: "/resume/yuvraj-sharma-resume.pdf",
  },
  timeline: [
    {
      period: "Now",
      title: "Independent Product Builder",
      subtitle: "AI + Full-stack systems",
      detail:
        "Building end-to-end products, from user problem framing and architecture to deployment and iteration.",
    },
    {
      period: "Case Study",
      title: "JUbot",
      subtitle: "AI University Assistant",
      detail:
        "Architected retrieval-backed support workflows for admission and campus guidance with confidence guardrails.",
    },
    {
      period: "Case Study",
      title: "Vital Band",
      subtitle: "Wearable Health Companion",
      detail:
        "Built sensing-to-feedback loops with firmware, BLE sync, and mobile app touchpoints.",
    },
    {
      period: "Case Study",
      title: "CanvasUI",
      subtitle: "Visual builder",
      detail:
        "Designed a node-based editor model to convert drag-and-drop layouts into implementation-ready structures.",
    },
  ],
  skills: [
    "Next.js",
    "TypeScript",
    "React",
    "FastAPI",
    "Generative AI",
    "RAG",
    "PostgreSQL",
    "Product strategy",
    "System design",
  ],
  education: [
    {
      title: "Engineering & Product-focused learning",
      detail: "Hands-on project-first development through AI systems, full-stack apps, and hardware prototypes.",
    },
  ],
  links: [
    { label: "GitHub", href: "https://github.com/yuvraj707sharma" },
    { label: "LinkedIn", href: "https://linkedin.com/in/yuvraj-sharma-3138b4312" },
  ],
};

const jumpPills = [
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Timeline" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "viewer", label: "2-page view" },
  { id: "contact", label: "Contact" },
];

const ResumePage = () => (
  <>
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/92 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--signature)] uppercase">Resume</p>
          <h1 className="text-xl font-semibold md:text-2xl" style={{ fontFamily: "var(--font-serif)" }}>
            {RESUME.name}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <a href={RESUME.actions.download} className="rounded-full border border-border px-4 py-2" download>
            Download PDF
          </a>
          <a href={RESUME.actions.email} className="rounded-full bg-primary px-4 py-2 text-primary-foreground">
            Email
          </a>
          <Link href="/" className="rounded-full border border-border px-4 py-2">
            Portfolio
          </Link>
        </div>
      </div>
      <div className="mx-auto w-full max-w-5xl overflow-x-auto px-4 pb-3">
        <nav className="flex min-w-max gap-2 text-xs" aria-label="Resume sections">
          {jumpPills.map((pill) => (
            <a key={pill.id} href={`#${pill.id}`} className="rounded-full border border-border px-3 py-1.5 text-muted-foreground transition hover:border-[var(--signature)] hover:text-foreground">
              {pill.label}
            </a>
          ))}
        </nav>
      </div>
    </header>

    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 md:space-y-8 md:py-10">
      <section id="summary" className="space-y-3 rounded-3xl border border-border/60 bg-card p-5 md:p-8">
        <p className="text-sm text-muted-foreground">{RESUME.title}</p>
        <p className="text-sm text-muted-foreground">{RESUME.location}</p>
        <p className="text-base text-muted-foreground">{RESUME.summary}</p>
      </section>

      <section id="experience" className="space-y-4 rounded-3xl border border-border/60 bg-card p-5 md:p-8">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          Experience timeline
        </h2>
        <ol className="space-y-4">
          {RESUME.timeline.map((item) => (
            <li key={item.title} className="relative rounded-2xl border border-border/60 bg-background/70 p-4 pl-6">
              <span className="absolute top-6 left-2 h-2.5 w-2.5 rounded-full bg-[var(--signature)]" aria-hidden />
              <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">{item.period}</p>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-foreground">{item.subtitle}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="skills" className="space-y-4 rounded-3xl border border-border/60 bg-card p-5 md:p-8">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          Skills
        </h2>
        <div className="flex flex-wrap gap-2 text-xs">
          {RESUME.skills.map((skill) => (
            <span key={skill} className="rounded-full border border-border/70 px-3 py-1 text-muted-foreground">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section id="education" className="space-y-4 rounded-3xl border border-border/60 bg-card p-5 md:p-8">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          Education
        </h2>
        {RESUME.education.map((item) => (
          <article key={item.title} className="rounded-2xl border border-border/50 bg-background/60 p-4">
            <h3 className="font-medium">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
          </article>
        ))}
      </section>

      <section id="viewer" className="rounded-3xl border border-border/60 bg-card p-5 md:p-8">
        <details className="group">
          <summary className="cursor-pointer list-none text-xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
            View 2-page resume
          </summary>
          <p className="mt-3 text-sm text-muted-foreground">Placeholder viewer: replace with the latest exports at `public/resume/page-1.png` and `public/resume/page-2.png`.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl border border-border/60 bg-background p-2">
              <Image src="/resume/page-1.png" alt="Resume page 1 placeholder" width={900} height={1200} className="h-auto w-full rounded-xl object-contain" />
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-border/60 bg-background p-2">
              <Image src="/resume/page-2.png" alt="Resume page 2 placeholder" width={900} height={1200} className="h-auto w-full rounded-xl object-contain" />
            </figure>
          </div>
        </details>
      </section>

      <section id="contact" className="space-y-4 rounded-3xl border border-border/60 bg-card p-5 md:p-8">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          Contact
        </h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href={RESUME.actions.email} className="rounded-full bg-primary px-4 py-2 text-primary-foreground">
            nanuuv0007@gmail.com
          </a>
          {RESUME.links.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="rounded-full border border-border px-4 py-2">
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </main>
  </>
);

export default ResumePage;
