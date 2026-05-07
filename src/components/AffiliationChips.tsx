"use client";

import Image from "next/image";
import { useState } from "react";
import type { AuthorAffiliation } from "@/lib/authors";

function ChipLogo({ a }: { a: AuthorAffiliation }) {
  const [errored, setErrored] = useState(false);
  if (!a.logo || errored) return null;
  return (
    <Image
      src={a.logo}
      alt={`${a.name} logo`}
      width={20}
      height={20}
      onError={() => setErrored(true)}
      className="h-5 w-5 shrink-0 object-contain"
    />
  );
}

export function AffiliationChips({
  items,
}: {
  items: AuthorAffiliation[];
}) {
  if (!items.length) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {items.map((a) => {
        const inner = (
          <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-700 hover:border-ink-300">
            <ChipLogo a={a} />
            <span className="font-medium">{a.name}</span>
            {a.detail && (
              <span className="text-xs text-ink-500">· {a.detail}</span>
            )}
          </span>
        );
        return (
          <li key={a.name}>
            {a.url ? (
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                {inner}
              </a>
            ) : (
              inner
            )}
          </li>
        );
      })}
    </ul>
  );
}
