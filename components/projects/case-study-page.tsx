import Link from "next/link";
import type { ReactNode } from "react";

import { CASE_STUDY_PROJECTS, type CaseStudyProject, getCaseStudyNeighbors } from "@/lib/projects";

type CaseStudyPageProps = {
  project: CaseStudyProject;
  diagram: ReactNode;
};

export const CaseStudyPage = ({ project, diagram }: CaseStudyPageProps) => {
  const { previous, next } = getCaseStudyNeighbors(project.slug);

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 pt-8 pb-24 md:space-y-10 md:pt-12 md:pb-12">
      <header className="space-y-4">
        <Link
          href="/projects"
          className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs tracking-[0.14em] uppercase text-muted-foreground transition hover:text-foreground"
        >
          All projects
        </Link>
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--signature)] uppercase">Case study</p>
          <h1 className="text-4xl font-semibold md:text-6xl" style={{ fontFamily: "var(--font-serif)" }}>
            {project.name}
          </h1>
          <p className="mt-3 max-w-3xl text-balance text-muted-foreground">{project.tagline}</p>
          <p className="mt-4 text-sm text-foreground">{project.role}</p>
          <p className="text-sm text-muted-foreground">{project.outcome}</p>
        </div>
      </header>

      <section className="space-y-4 rounded-3xl border border-border/60 bg-card p-5 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold md:text-2xl" style={{ fontFamily: "var(--font-serif)" }}>
            Architecture
          </h2>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-border/50 bg-background p-3 md:p-5">{diagram}</div>
      </section>

      <section id="problem" className="space-y-3 rounded-3xl border border-border/60 bg-card p-5 md:p-7">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          Problem
        </h2>
        <p className="text-muted-foreground">{project.problem}</p>
      </section>

      <section id="constraints" className="space-y-3 rounded-3xl border border-border/60 bg-card p-5 md:p-7">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          Constraints
        </h2>
        <ul className="space-y-2 text-muted-foreground">
          {project.constraints.map((item) => (
            <li key={item} className="rounded-xl border border-border/50 bg-background/60 p-3">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section id="approach" className="space-y-3 rounded-3xl border border-border/60 bg-card p-5 md:p-7">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          Approach
        </h2>
        <p className="text-muted-foreground">{project.approach}</p>
      </section>

      <section id="decisions" className="space-y-3 rounded-3xl border border-border/60 bg-card p-5 md:p-7">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          Key Decisions
        </h2>
        <ul className="space-y-2 text-muted-foreground">
          {project.keyDecisions.map((item) => (
            <li key={item} className="rounded-xl border border-border/50 bg-background/60 p-3">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section id="results" className="space-y-3 rounded-3xl border border-border/60 bg-card p-5 md:p-7">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          Results
        </h2>
        <ul className="space-y-2 text-muted-foreground">
          {project.results.map((item) => (
            <li key={item} className="rounded-xl border border-border/50 bg-background/60 p-3">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section id="links" className="space-y-4 rounded-3xl border border-border/60 bg-card p-5 md:p-7">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          Links
        </h2>
        <div className="flex flex-wrap gap-3 text-sm">
          {project.links.github ? (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-4 py-2 text-primary-foreground">
              GitHub
            </a>
          ) : (
            <span className="rounded-full bg-primary/60 px-4 py-2 text-primary-foreground/80">GitHub soon</span>
          )}
          {project.links.demo ? (
            <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-4 py-2">
              Live demo
            </a>
          ) : (
            <span className="rounded-full border border-border px-4 py-2 text-muted-foreground">Live demo soon</span>
          )}
        </div>
      </section>

      <section className="grid gap-3 rounded-3xl border border-border/60 bg-card p-5 sm:grid-cols-2 md:p-7">
        <Link href={`/projects/${previous.slug}`} className="rounded-2xl border border-border/50 p-4 transition hover:border-[var(--signature)]">
          <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">Previous</p>
          <p className="mt-2 font-medium">{previous.name}</p>
        </Link>
        <Link href={`/projects/${next.slug}`} className="rounded-2xl border border-border/50 p-4 transition hover:border-[var(--signature)]">
          <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">Next</p>
          <p className="mt-2 font-medium">{next.name}</p>
        </Link>
      </section>

      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] z-40 mx-auto flex w-[calc(100%-1.5rem)] max-w-md gap-2 rounded-2xl border border-border/70 bg-background/95 p-2 shadow-sm backdrop-blur md:hidden">
        {project.links.github ? (
          <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">
            GitHub
          </a>
        ) : (
          <span className="flex-1 rounded-xl bg-primary/60 px-4 py-2 text-center text-sm font-medium text-primary-foreground/80">GitHub soon</span>
        )}
        {project.links.demo ? (
          <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl border border-border px-4 py-2 text-center text-sm font-medium">
            Live demo
          </a>
        ) : (
          <span className="flex-1 rounded-xl border border-border px-4 py-2 text-center text-sm font-medium text-muted-foreground">Live demo soon</span>
        )}
      </div>
    </main>
  );
};

export const ProjectIndexCards = () => (
  <div className="grid gap-4 md:grid-cols-3">
    {CASE_STUDY_PROJECTS.map((project) => (
      <article key={project.slug} className="rounded-3xl border border-border/60 bg-card p-5">
        <p className="text-xs tracking-[0.14em] text-[var(--signature)] uppercase">Project</p>
        <h2 className="mt-2 text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
          {project.name}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{project.tagline}</p>
        <p className="mt-3 text-xs text-foreground">{project.role}</p>
        <Link href={`/projects/${project.slug}`} className="mt-4 inline-flex rounded-full border border-border px-4 py-2 text-sm transition hover:border-[var(--signature)]">
          Open case study
        </Link>
      </article>
    ))}
  </div>
);
