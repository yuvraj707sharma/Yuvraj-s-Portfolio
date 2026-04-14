"use client";

import { ArrowLeftIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Logo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 29 19"
    fill="currentColor"
    className={className}
  >
    <path d="M26.98 17.513q-1.09.902-2.818.902-1.73 0-2.856-.902-1.128-.9-1.128-2.668 0-1.729 1.128-2.63 1.127-.902 2.856-.902t2.818.901q1.128.903 1.128 2.631 0 1.73-1.128 2.668" />
    <path d="M20.18 0q.865 0 .865.714v.15q0 .527-1.09 1.466-1.089.94-1.428 1.766L13.68 17.062q-.338.977-1.315.977H9.057q-.864 0-1.353-.977L1.992 4.096q-.3-.676-1.165-1.653Q0 1.428 0 .864v-.15Q0 0 .864 0h8.644q.827 0 .827.752v.15q0 .375-.338.902a4 4 0 0 0-.489.902q-.113.413.188 1.503l3.232 8.493L15.67 5.15q.414-1.58.113-2.18a3.6 3.6 0 0 0-.902-1.165q-.564-.564-.564-.902v-.15q0-.752.865-.752z" />
  </svg>
);

export const Footer = () => {
  const pathname = usePathname();
  const showBack = pathname !== "/";

  return (
    <footer className="absolute inset-x-4 bottom-4 z-10 flex items-center justify-between">
      {showBack ? (
        <Link
          href="/"
          aria-label="Go back"
          className="text-background/50 hover:text-background"
        >
          <ArrowLeftIcon weight="bold" className="size-6" />
        </Link>
      ) : (
        <span />
      )}
      <Link
        href="https://www.vittoretrivi.dev"
        target="_blank"
        className="text-background/50 hover:text-background"
      >
        <Logo className="text-background/50 h-5" />
      </Link>
    </footer>
  );
};
