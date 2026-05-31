import Link from "next/link";

import { ProjectIndexCards } from "@/components/projects/case-study-page";

export const metadata = {
  title: "Projects | Yuvraj Sharma",
  description: "Project case studies for JUbot, Vital Band, and CanvasUI.",
};

const ProjectsPage = () => (
  <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:space-y-10 md:py-14">
    <header className="space-y-4">
      <Link href="/" className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs tracking-[0.14em] uppercase text-muted-foreground transition hover:text-foreground">
        Back to portfolio
      </Link>
      <div>
        <p className="text-xs tracking-[0.2em] text-[var(--signature)] uppercase">Projects</p>
        <h1 className="text-4xl font-semibold md:text-6xl" style={{ fontFamily: "var(--font-serif)" }}>
          Case studies
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Editorial project narratives with focused interaction decisions, architecture diagrams, and outcomes.
        </p>
      </div>
    </header>
    <ProjectIndexCards />
  </main>
);

export default ProjectsPage;
