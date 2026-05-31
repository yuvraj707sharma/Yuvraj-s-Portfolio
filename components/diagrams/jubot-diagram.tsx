export const JuBotDiagram = () => (
  <svg viewBox="0 0 880 420" role="img" aria-label="JUbot architecture diagram" className="h-auto w-full text-foreground">
    <rect x="20" y="70" width="190" height="100" rx="20" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="115" y="112" textAnchor="middle" className="fill-current text-[18px] font-medium">
      Student UI
    </text>

    <rect x="250" y="70" width="190" height="100" rx="20" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="345" y="102" textAnchor="middle" className="fill-current text-[18px] font-medium">
      Next.js
    </text>
    <text x="345" y="126" textAnchor="middle" className="fill-current text-[13px] opacity-70">
      Orchestrator
    </text>

    <rect x="480" y="30" width="190" height="100" rx="20" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="575" y="73" textAnchor="middle" className="fill-current text-[16px] font-medium">
      Retrieval Layer
    </text>

    <rect x="480" y="190" width="190" height="100" rx="20" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="575" y="232" textAnchor="middle" className="fill-current text-[16px] font-medium">
      Policy Guardrails
    </text>

    <rect x="710" y="70" width="150" height="100" rx="20" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="785" y="112" textAnchor="middle" className="fill-current text-[16px] font-medium">
      Gemini API
    </text>

    <path d="M210 120H250" stroke="currentColor" strokeWidth="2" strokeOpacity="0.55" />
    <path d="M440 120H480" stroke="currentColor" strokeWidth="2" strokeOpacity="0.55" />
    <path d="M575 130V190" stroke="currentColor" strokeWidth="2" strokeOpacity="0.55" />
    <path d="M670 120H710" stroke="currentColor" strokeWidth="2" strokeOpacity="0.55" />

    <circle cx="450" cy="120" r="6" fill="var(--signature)" />
    <circle cx="575" cy="160" r="6" fill="var(--signature)" />
  </svg>
);
