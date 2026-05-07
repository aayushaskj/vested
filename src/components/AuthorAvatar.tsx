"use client";

import Image from "next/image";
import { useState } from "react";
import type { Author } from "@/lib/authors";

/**
 * Renders the author's photo if available; falls back to a gradient monogram
 * (their initials) if the file isn't there. This means we ship working code
 * even before /public/authors/*.jpg exists on disk.
 */
export function AuthorAvatar({
  author,
  size = 64,
  className = "",
}: {
  author: Author;
  size?: number;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!author.avatar || errored) {
    return (
      <div
        aria-label={author.name}
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-accent-500 font-display font-bold text-white ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={author.avatar}
      alt={author.name}
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  );
}
