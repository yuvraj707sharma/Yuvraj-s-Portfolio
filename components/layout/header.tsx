import {
  BriefcaseIcon,
  FileTextIcon,
  FlaskIcon,
  HouseIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const NAV_LINKS = [
  {
    href: "/",
    label: "Portfolio",
    Icon: HouseIcon,
  },
  {
    href: "/resume",
    label: "Resume",
    Icon: FileTextIcon,
  },
  {
    href: "/labs",
    label: "Labs",
    Icon: FlaskIcon,
  },
];

export const Header = () => (
  <header className="sticky top-0 z-50 flex items-center justify-between p-4">
    <Link href="/examples/getting-started" className="text-md font-semibold tracking-tight text-background whitespace-nowrap">
      Examples · Internal demos
    </Link>
    <nav aria-label="Examples navigation" className="flex items-center gap-3 text-sm">
      {NAV_LINKS.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          aria-label={label}
          title={label}
          className="flex items-center gap-1.5 rounded-full border border-background/20 px-3 py-1 text-background/80 transition-colors hover:text-background"
        >
          <Icon className="size-4" aria-hidden />
          <span className="hidden sm:inline">{label}</span>
        </Link>
      ))}
      <span className="hidden items-center gap-1.5 rounded-full border border-background/20 px-3 py-1 text-background/65 sm:inline-flex">
        <BriefcaseIcon className="size-4" aria-hidden />
        Examples
      </span>
    </nav>
  </header>
);
