import Link from "next/link";
import { ReactNode } from "react";

const totalPages = 2;

interface PageProps {
  children: ReactNode;
  page: number;
}

const Page = ({ children, page }: PageProps) => (
  <div className="relative flex h-full w-full items-center justify-center bg-blue-100 p-24 selection:bg-blue-950 selection:text-blue-100">
    <div className="absolute inset-0 flex w-full max-w-xl flex-col items-center justify-center text-blue-950">
      {children}
    </div>
    <div className="absolute right-0 bottom-8 left-0 text-center font-serif text-sm text-blue-950/60">
      {page} / {totalPages}
    </div>
  </div>
);

export const FrontPage = () => (
  <Page page={1}>
    <div className="flex flex-col items-center gap-8 text-center font-serif">
      <div className="text-xs tracking-[0.45em] text-blue-950/75 uppercase">
        A Study In
      </div>
      <h1 className="text-5xl leading-tight font-semibold tracking-tight">
        HTML
        <span className="mx-3 font-light text-blue-950/75 italic">in</span>
        Canvas
      </h1>
      <div className="h-px w-24 bg-blue-950/50" />
      <Link
        className="text-base text-blue-950/75 lowercase italic"
        href="https://github.com/WICG/html-in-canvas"
        target="_blank"
      >
        https://github.com/WICG/html-in-canvas
      </Link>
      <p className="text-xs tracking-[0.45em] text-blue-950/75 uppercase">
        By Vitto
      </p>
      <div className="pointer-events-none absolute inset-2 border-2 border-blue-950" />
      <div className="pointer-events-none absolute inset-4 border-2 border-blue-950/50" />
    </div>
  </Page>
);

export const BackPage = () => (
  <Page page={2}>
    <div className="flex flex-col items-center gap-8 text-center font-serif">
      <div className="text-xs tracking-[0.45em] text-blue-950/75 uppercase">
        The Crazy Ones
      </div>
      <div className="h-px w-16 bg-blue-950/50" />
      <div className="flex max-w-md flex-col gap-2 text-base leading-relaxed text-blue-950/90 italic">
        <p>
          Here&apos;s to the crazy ones. The misfits. The rebels. The
          troublemakers. The round pegs in the square holes. The ones who see
          things differently. They&apos;re not fond of rules. And they have no
          respect for the status quo. You can quote them, disagree with them,
          glorify or vilify them. About the only thing you can&apos;t do is
          ignore them. Because they change things. They push the human race
          forward. And while some may see them as the crazy ones, we see genius.
        </p>
        <p className="font-bold">
          Because the people who are crazy enough to think they can change the
          world, are the ones who do.
        </p>
      </div>
      <div className="h-px w-16 bg-blue-950/50" />
      <div className="text-xs tracking-[0.45em] text-blue-950/75 uppercase">
        Apple, <span>1997</span>
      </div>
    </div>
  </Page>
);
