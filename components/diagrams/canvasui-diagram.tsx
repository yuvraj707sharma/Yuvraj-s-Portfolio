export const CanvasUiDiagram = () => (
  <svg viewBox="0 0 880 430" role="img" aria-label="CanvasUI architecture diagram" className="h-auto w-full text-foreground">
    <rect x="20" y="80" width="190" height="95" rx="18" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="115" y="118" textAnchor="middle" className="fill-current text-[16px] font-medium">
      Visual Editor
    </text>

    <rect x="250" y="80" width="190" height="95" rx="18" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="345" y="118" textAnchor="middle" className="fill-current text-[16px] font-medium">
      Component Graph
    </text>

    <rect x="250" y="220" width="190" height="95" rx="18" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="345" y="258" textAnchor="middle" className="fill-current text-[16px] font-medium">
      Constraint Engine
    </text>

    <rect x="480" y="80" width="190" height="95" rx="18" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="575" y="118" textAnchor="middle" className="fill-current text-[16px] font-medium">
      Event Bus
    </text>

    <rect x="710" y="80" width="150" height="95" rx="18" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="785" y="118" textAnchor="middle" className="fill-current text-[16px] font-medium">
      Exporter
    </text>
    <text x="785" y="140" textAnchor="middle" className="fill-current text-[13px] opacity-70">
      Tailwind JSON
    </text>

    <rect x="710" y="220" width="150" height="95" rx="18" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="785" y="258" textAnchor="middle" className="fill-current text-[16px] font-medium">
      Design System
    </text>

    <path d="M210 128H250" stroke="currentColor" strokeWidth="2" strokeOpacity="0.55" />
    <path d="M440 128H480" stroke="currentColor" strokeWidth="2" strokeOpacity="0.55" />
    <path d="M670 128H710" stroke="currentColor" strokeWidth="2" strokeOpacity="0.55" />
    <path d="M345 175V220" stroke="currentColor" strokeWidth="2" strokeOpacity="0.55" />
    <path d="M575 175V220H710" stroke="currentColor" strokeWidth="2" strokeOpacity="0.55" fill="none" />

    <circle cx="460" cy="128" r="6" fill="var(--signature)" aria-hidden />
    <circle cx="345" cy="197" r="6" fill="var(--signature)" aria-hidden />
  </svg>
);
