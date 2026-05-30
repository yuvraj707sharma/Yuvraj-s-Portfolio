"use client";

import { useState } from "react";

export const FallbackImage = ({
  alt,
  className,
  fallbackSrc,
  src,
}: {
  alt: string;
  className?: string;
  fallbackSrc: string;
  src: string;
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => setCurrentSrc(fallbackSrc)}
    />
  );
};
