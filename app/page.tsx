import Link from "next/link";

import { AmbientAudioToggle } from "@/components/portfolio/ambient-audio-toggle";
import { ClipScrollSection } from "@/components/portfolio/clip-scroll-section";
import { CustomCursor } from "@/components/portfolio/custom-cursor";
import { GommageTransition } from "@/components/portfolio/gommage-transition";
import { Magnetic } from "@/components/portfolio/magnetic";
import { SmoothScroll } from "@/components/portfolio/smooth-scroll";
import { ThemeToggle } from "@/components/portfolio/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CASE_STUDY_PROJECTS } from "@/lib/projects";

const Page = () => {
  const featuredProject = CASE_STUDY_PROJECTS[0];
  const compactProjects = CASE_STUDY_PROJECTS.slice(1);

  return (
    <>
      <SmoothScroll />
      <CustomCursor />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#home" className="text-sm font-semibold tracking-tight" data-cursor-label="Home">
            Yuvraj Sharma
          </a>
          <nav className="hidden items-center gap-5 text-xs tracking-[0.14em] text-muted-foreground uppercase sm:flex">
            <a href="#projects" data-cursor-label="Projects" className="hover:text-foreground">
              Projects
            </a>
            <a href="#about" data-cursor-label="About" className="hover:text-foreground">
              About
            </a>
            <Link href="/projects" data-cursor-label="Case Studies" className="hover:text-foreground">
              Case studies
            </Link>
            <Link href="/resume" data-cursor-label="Resume" className="hover:text-foreground">
              Resume
            </Link>
            <Link href="/labs" data-cursor-label="Labs" className="hover:text-foreground">
              Labs
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AmbientAudioToggle />
          </div>
        </div>
      </header>

      <main id="home" className="mx-auto w-full max-w-6xl space-y-12 px-4 py-10 md:space-y-20 md:py-14">
        <section className="mx-auto max-w-4xl py-12 md:py-20 text-center flex flex-col items-center justify-center space-y-8">
          <div className="max-w-3xl space-y-6">
            <p className="text-xs tracking-[0.25em] text-[var(--signature)] uppercase">Product Builder & Software Developer</p>
            <h1 className="text-balance text-4xl leading-tight font-semibold md:text-6xl" style={{ fontFamily: "var(--font-serif)" }}>
              I build AI-powered products, intelligent systems, and scalable software that turn ideas into real-world impact.
            </h1>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground md:text-base">
              Yuvraj Sharma · Jaipur, Rajasthan, India (IST)
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <a
                  href="#projects"
                  className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
                  data-cursor-label="View Work"
                >
                  View Work
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="mailto:nanuuv0007@gmail.com"
                  className="inline-flex rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium"
                  data-cursor-label="Email"
                >
                  Contact
                </a>
              </Magnetic>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs tracking-[0.14em] text-muted-foreground uppercase">
              <a href="https://github.com/yuvraj707sharma" target="_blank" rel="noopener noreferrer" data-cursor-label="GitHub" className="hover:text-foreground">
                GitHub
              </a>
              <a href="https://linkedin.com/in/yuvraj-sharma-3138b4312" target="_blank" rel="noopener noreferrer" data-cursor-label="LinkedIn" className="hover:text-foreground">
                LinkedIn
              </a>
              <a href="https://instagram.com/yuvrajsharma" target="_blank" rel="noopener noreferrer" data-cursor-label="Instagram" className="hover:text-foreground">
                Instagram
              </a>
            </div>
          </div>
        </section>

        <GommageTransition />

        <section id="projects" className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs tracking-[0.2em] text-[var(--signature)] uppercase">Selected Projects</p>
            <h2 className="text-3xl font-semibold md:text-5xl" style={{ fontFamily: "var(--font-serif)" }}>
              Three product-led builds, each documented end to end.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Magnetic className="md:col-span-2">
              <Link href={`/projects/${featuredProject.slug}`} className="block" data-cursor-label={featuredProject.name}>
                <Card className="border border-border/60 bg-card/90 md:p-3">
                  <CardHeader>
                    <p className="text-xs tracking-[0.15em] text-[var(--signature)] uppercase">Featured</p>
                    <CardTitle className="text-3xl" style={{ fontFamily: "var(--font-serif)" }}>
                      {featuredProject.name}
                    </CardTitle>
                    <CardDescription className="max-w-2xl text-base text-muted-foreground">{featuredProject.description}</CardDescription>
                    <p className="text-sm text-foreground">{featuredProject.role}</p>
                    <p className="text-sm text-muted-foreground">{featuredProject.outcome}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {featuredProject.stack.map((item) => (
                        <span key={item} className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                          {item}
                        </span>
                      ))}
                    </div>
                    <span className="mt-5 inline-flex rounded-full border border-border px-4 py-2 text-sm transition hover:border-[var(--signature)]">
                      Open case study
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </Magnetic>

            {compactProjects.map((project) => (
              <Magnetic key={project.slug}>
                <Link href={`/projects/${project.slug}`} className="block h-full" data-cursor-label={project.name}>
                  <Card className="h-full border border-border/60 bg-card/90">
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>{project.tagline}</CardDescription>
                      <p className="text-sm text-foreground">{project.role}</p>
                      <p className="text-sm text-muted-foreground">{project.outcome}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.stack.map((item) => (
                          <span key={item} className="rounded-full border border-border/70 px-2 py-1 text-[11px] text-muted-foreground">
                            {item}
                          </span>
                        ))}
                      </div>
                      <span className="mt-5 inline-flex rounded-full border border-border px-4 py-2 text-sm transition hover:border-[var(--signature)]">
                        Open case study
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </Magnetic>
            ))}
          </div>
        </section>

        <ClipScrollSection />

        <section className="rounded-3xl border border-border/60 bg-card p-6 md:p-10">
          <p className="text-xs tracking-[0.2em] text-[var(--signature)] uppercase">Contact</p>
          <h3 className="mt-2 text-3xl font-semibold md:text-5xl" style={{ fontFamily: "var(--font-serif)" }}>
            Let’s build something real.
          </h3>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Open to recruiter conversations, AI product teams, startup collaboration, freelance builds, and university partnerships.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a href="mailto:nanuuv0007@gmail.com" className="rounded-full bg-primary px-5 py-2 text-primary-foreground" data-cursor-label="Email">
              nanuuv0007@gmail.com
            </a>
            <Link href="/resume" className="rounded-full border border-border px-5 py-2" data-cursor-label="Resume">
              Resume
            </Link>
            <Link href="/projects" className="rounded-full border border-border px-5 py-2" data-cursor-label="Projects">
              Projects
            </Link>
            <Link href="/labs" className="rounded-full border border-border px-5 py-2" data-cursor-label="Labs">
              Labs
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default Page;
