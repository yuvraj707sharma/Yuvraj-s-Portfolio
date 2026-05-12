import {
  BookOpenIcon,
  GithubLogoIcon,
  GridFourIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const NAV_LINKS = [
  {
    href: "https://tympanus.net/codrops/2026/05/13/exploring-the-html-in-canvas-proposal",
    label: "Tutorial",
    Icon: BookOpenIcon,
  },
  {
    href: "https://github.com/motiontx/html-in-canvas",
    label: "GitHub",
    Icon: GithubLogoIcon,
  },
  {
    href: "https://tympanus.net/codrops/hub",
    label: "All demos",
    Icon: GridFourIcon,
  },
];

export const Header = () => (
  <header className="sticky top-0 z-50 flex items-center justify-between p-4">
    <Link
      href="/"
      className="text-background text-md font-semibold tracking-tight whitespace-nowrap"
    >
      HTML-in-Canvas Experiments
    </Link>
    <nav aria-label="Primary" className="flex items-center gap-4 text-sm">
      {NAV_LINKS.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="text-background/70 hover:text-background transition-colors flex items-center gap-2"
        >
          <Icon className="size-4" aria-hidden />
          <span className="hidden sm:inline">{label}</span>
        </Link>
      ))}
    </nav>
  </header>
);
