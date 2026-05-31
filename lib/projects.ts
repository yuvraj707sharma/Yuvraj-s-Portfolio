export type ProjectSlug = "jubot" | "vital-band" | "canvasui";

export type CaseStudyProject = {
  slug: ProjectSlug;
  name: string;
  description: string;
  tagline: string;
  role: string;
  outcome: string;
  stack: string[];
  problem: string;
  constraints: string[];
  approach: string;
  keyDecisions: string[];
  results: string[];
  links: {
    github: string;
    demo: string;
  };
};

export const CASE_STUDY_PROJECTS: CaseStudyProject[] = [
  {
    slug: "jubot",
    name: "JUbot",
    description:
      "AI-powered university assistant for admissions, student support, and information retrieval.",
    tagline: "AI university assistant for admissions and student support",
    role: "Role: Product builder · Full-stack AI engineer",
    outcome: "Outcome: Reduced repetitive support flow through guided Q&A and retrieval-backed answers.",
    stack: ["Next.js", "FastAPI", "Gemini", "ChromaDB", "PostgreSQL", "Redis"],
    problem:
      "Prospective students and current learners needed accurate admission and campus answers without waiting for manual responses from overloaded support channels.",
    constraints: [
      "Admissions content changes frequently and had to stay up to date.",
      "Answer quality needed guardrails to avoid hallucinated policy statements.",
      "The experience had to stay simple enough for mobile-first student usage.",
    ],
    approach:
      "I built a retrieval-first pipeline with document chunking, semantic search, and response orchestration. The UI guides intent quickly, while a backend policy layer prioritizes verified sources before response generation.",
    keyDecisions: [
      "Use intent templates for the top support queries before free-form prompts.",
      "Separate retrieval confidence checks from generation to preserve trust.",
      "Keep the interaction in short cards for readability on small screens.",
    ],
    results: [
      "Faster first response for recurring admission questions.",
      "Clearer escalation path to human support for low-confidence answers.",
      "Reusable architecture that can extend to department-specific assistants.",
    ],
    links: {
      github: "https://github.com/yuvraj707sharma",
      demo: "#",
    },
  },
  {
    slug: "vital-band",
    name: "Vital Band",
    description:
      "Smart wearable health companion focused on activity tracking, behavior change, and preventive health.",
    tagline: "Wearable health companion with behavior-aware feedback",
    role: "Role: Product strategist · Firmware + app integration",
    outcome: "Outcome: Created a practical wellness loop from sensing to actionable nudges.",
    stack: ["ESP32", "Flutter", "BLE", "Edge Impulse", "Arduino"],
    problem:
      "Most health wearables surface raw metrics but fail to convert data into daily behavior change that users can sustain.",
    constraints: [
      "Battery and sensor sampling had to balance accuracy with all-day usage.",
      "BLE syncing needed graceful failure handling in unstable mobile contexts.",
      "Early prototypes required fast iteration across hardware and app layers.",
    ],
    approach:
      "I focused on a minimal signal set, reliable BLE syncing, and habit-oriented prompts. The app distilled metrics into plain-language trends and lightweight recommendations rather than complex dashboards.",
    keyDecisions: [
      "Prioritize resting trends and activity consistency over noisy real-time spikes.",
      "Queue BLE writes and retries to avoid silent data loss.",
      "Use weekly progress framing instead of daily perfection scoring.",
    ],
    results: [
      "More stable data capture during everyday movement.",
      "Improved user understanding through plain-language summaries.",
      "A modular foundation for adding clinical-grade sensors later.",
    ],
    links: {
      github: "https://github.com/yuvraj707sharma",
      demo: "#",
    },
  },
  {
    slug: "canvasui",
    name: "CanvasUI",
    description:
      "Canva-inspired visual UI builder converting drag-and-drop interfaces into production-ready designs.",
    tagline: "Visual UI builder that translates drag-and-drop to production-ready structure",
    role: "Role: Frontend architect · Interaction systems",
    outcome: "Outcome: Shortened idea-to-interface time with structured exports.",
    stack: ["React", "TypeScript", "Zustand", "Tailwind"],
    problem:
      "Design-heavy workflows often stall when prototypes cannot be cleanly translated into implementation-ready front-end structures.",
    constraints: [
      "Complex interactions had to remain smooth on mid-range devices.",
      "Generated layouts needed predictable structure for developer handoff.",
      "The editor had to feel intuitive for non-technical creators.",
    ],
    approach:
      "I created a component graph model, grid-aware drag interactions, and deterministic export mapping. The system keeps state explicit so interactive edits remain reversible and understandable.",
    keyDecisions: [
      "Model elements as typed nodes with strict layout constraints.",
      "Use an event bus for editor interactions to simplify extensibility.",
      "Generate Tailwind-first output for rapid product integration.",
    ],
    results: [
      "Faster iteration from concept to coded baseline.",
      "Cleaner handoff artifacts for developers.",
      "Scalable architecture for templates and component libraries.",
    ],
    links: {
      github: "https://github.com/yuvraj707sharma",
      demo: "#",
    },
  },
];

export const getCaseStudyProject = (slug: ProjectSlug) =>
  CASE_STUDY_PROJECTS.find((project) => project.slug === slug);

export const getCaseStudyNeighbors = (slug: ProjectSlug) => {
  const index = CASE_STUDY_PROJECTS.findIndex((project) => project.slug === slug);

  return {
    previous: CASE_STUDY_PROJECTS[(index - 1 + CASE_STUDY_PROJECTS.length) % CASE_STUDY_PROJECTS.length],
    next: CASE_STUDY_PROJECTS[(index + 1) % CASE_STUDY_PROJECTS.length],
  };
};
