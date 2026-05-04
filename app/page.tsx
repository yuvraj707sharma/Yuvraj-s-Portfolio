import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { GridBackground } from "@/components/ui/grid-background";

const examples = [
  { slug: "getting-started", title: "Getting Started" },
  { slug: "vanish-input", title: "Vanish Input" },
  { slug: "login", title: "Login" },
  { slug: "page-curl", title: "Page Curl" },
  { slug: "basic-ui", title: "Basic UI" },
];

const Page = () => (
  <>
    <Header />
    <GridBackground className="bg-codrops" />
    <main className="absolute inset-0 flex flex-col items-center justify-center px-4 py-16">
      <div className="relative z-10 w-full max-w-xl">
        <div className="rounded-3xl border border-white/25 bg-white/10 p-2 shadow-2xl backdrop-blur">
          <div className="rounded-2xl bg-white p-8">
            <h1 className="text-codrops mb-6 text-3xl font-bold">Examples</h1>
            <ul className="divide-codrops/10 divide-y">
              {examples.map(({ slug, title }, i) => (
                <li key={slug}>
                  <Link
                    href={`/examples/${slug}`}
                    className="text-codrops flex items-center gap-5 py-4 hover:opacity-70"
                  >
                    <span className="text-codrops/40 font-mono text-xs tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-lg leading-tight font-semibold">
                      {title}
                    </span>
                    <ArrowRightIcon
                      weight="bold"
                      className="text-codrops/40 size-4"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default Page;
