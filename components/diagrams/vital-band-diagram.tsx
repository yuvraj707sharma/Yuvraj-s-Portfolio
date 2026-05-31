export const VitalBandDiagram = () => (
  <svg viewBox="0 0 880 420" role="img" aria-label="Vital Band architecture diagram" className="h-auto w-full text-foreground">
    <rect x="20" y="120" width="170" height="95" rx="18" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="105" y="155" textAnchor="middle" className="fill-current text-[16px] font-medium">
      Sensor Array
    </text>
    <text x="105" y="178" textAnchor="middle" className="fill-current text-[13px] opacity-70">
      HR · Motion · Temp
    </text>

    <rect x="230" y="120" width="170" height="95" rx="18" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="315" y="155" textAnchor="middle" className="fill-current text-[16px] font-medium">
      ESP32 Firmware
    </text>

    <rect x="440" y="60" width="170" height="95" rx="18" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="525" y="98" textAnchor="middle" className="fill-current text-[16px] font-medium">
      BLE Sync
    </text>

    <rect x="440" y="180" width="170" height="95" rx="18" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="525" y="218" textAnchor="middle" className="fill-current text-[16px] font-medium">
      On-device Cache
    </text>

    <rect x="650" y="120" width="210" height="95" rx="18" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <text x="755" y="155" textAnchor="middle" className="fill-current text-[16px] font-medium">
      Flutter Companion App
    </text>
    <text x="755" y="178" textAnchor="middle" className="fill-current text-[13px] opacity-70">
      Trends + Coaching Nudges
    </text>

    <path d="M190 167H230" stroke="currentColor" strokeWidth="2" strokeOpacity="0.55" />
    <path d="M400 167H440" stroke="currentColor" strokeWidth="2" strokeOpacity="0.55" />
    <path d="M610 107H650" stroke="currentColor" strokeWidth="2" strokeOpacity="0.55" />
    <path d="M610 227H650" stroke="currentColor" strokeWidth="2" strokeOpacity="0.55" />

    <circle cx="420" cy="167" r="6" fill="var(--signature)" />
    <circle cx="630" cy="167" r="6" fill="var(--signature)" />
  </svg>
);
