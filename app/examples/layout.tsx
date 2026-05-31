import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const ExamplesLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => children;

export default ExamplesLayout;
