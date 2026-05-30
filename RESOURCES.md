# Resources Integration Map

## Internal bundled resources

- `three-html-to-canvas/`
  - Technique used in: `components/portfolio/hero-canvas.tsx`
  - Usage: HTML-to-canvas rasterization (foreignObject snapshot) is adapted into the homepage WebGL hero panel.

- `TextClipScroll/`
  - Technique used in: `components/portfolio/clip-scroll-section.tsx`
  - Assets used in: `components/portfolio/hero-canvas.tsx`, `app/resume/page.tsx`, `components/portfolio/clip-scroll-section.tsx`
  - Usage: scroll-driven clip-path typography section and fallback portrait/texture imagery.

- `WebGPU-clair-obscur-gommage-codrops/`
  - Technique used in: `components/portfolio/gommage-transition.tsx`
  - Assets used in: `components/portfolio/gommage-transition.tsx`, `app/labs/page.tsx`, `app/layout.tsx` (OG image)
  - Usage: dissolve / gommage-inspired texture transition adapted for broad browser support.

## External inspiration links and corresponding implementation

- Codrops (`tympanus.net/codrops`)
  - Site-wide section pacing, editorial layout hierarchy, and transition rhythm in `app/page.tsx` and `app/labs/page.tsx`.

- CodePens by damarberlari (`pvgKamj`, `LENBEzy`)
  - Magnetic hover interactions and pointer context labels in `components/portfolio/magnetic.tsx` and `components/portfolio/custom-cursor.tsx`.

- Cullen Webber HTML-to-canvas demo
  - HTML snapshotting projected through WebGL in `components/portfolio/hero-canvas.tsx`.

- dextersulit.com
  - Typographic contrast (serif impact + sans body), spacing, and chapter-like section flow in `app/page.tsx` and `app/globals.css`.
