# Resources Integration Map

## Internal bundled resources

- `three-html-to-canvas/`
  - Technique used in: `components/portfolio/hero-canvas.tsx`
  - Usage: HTML-to-canvas rasterization (foreignObject snapshot) is adapted into the homepage WebGL hero panel.

- `TextClipScroll/`
  - Technique used in: `components/portfolio/clip-scroll-section.tsx`
  - Assets used in: `components/portfolio/hero-canvas.tsx`, `components/portfolio/clip-scroll-section.tsx`
  - Usage: scroll-driven clip-path typography section and fallback portrait/texture imagery.

- `WebGPU-clair-obscur-gommage-codrops/`
  - Technique used in: `components/portfolio/gommage-transition.tsx`
  - Assets used in: `components/portfolio/gommage-transition.tsx`, `app/labs/page.tsx`, `app/layout.tsx` (OG image)
  - Usage: dissolve / gommage-inspired texture transition adapted for broad browser support.

## Portfolio architecture and internal references

- `lib/projects.ts`
  - Used in: `app/page.tsx`, `app/projects/page.tsx`, and all `app/projects/*/page.tsx` case studies.
  - Usage: central source of truth for project role/outcome text, Problem → Constraints → Approach → Key Decisions → Results content, and links.

- `components/diagrams/`
  - Files: `jubot-diagram.tsx`, `vital-band-diagram.tsx`, `canvasui-diagram.tsx`
  - Used in: `app/projects/jubot/page.tsx`, `app/projects/vital-band/page.tsx`, `app/projects/canvasui/page.tsx`
  - Usage: responsive, theme-aware SVG architecture diagrams for dedicated case studies.

- `app/examples/layout.tsx`
  - Applies to: all `/examples/*` routes.
  - Usage: marks legacy examples routes as `robots: { index: false, follow: false }` while keeping routes accessible.

## External inspiration links and corresponding implementation

- Codrops (`tympanus.net/codrops`)
  - Site-wide section pacing, editorial layout hierarchy, and transition rhythm in `app/page.tsx` and `app/labs/page.tsx`.

- CodePens by damarberlari (`pvgKamj`, `LENBEzy`)
  - Magnetic hover interactions and pointer context labels in `components/portfolio/magnetic.tsx` and `components/portfolio/custom-cursor.tsx`.

- Cullen Webber HTML-to-canvas demo
  - HTML snapshotting projected through WebGL in `components/portfolio/hero-canvas.tsx`.

- dextersulit.com
  - Typographic contrast (serif impact + sans body), spacing, and chapter-like section flow in `app/page.tsx` and new case study/resume pages.
