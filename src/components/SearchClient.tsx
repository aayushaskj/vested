"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useMemo, useState } from "react";

interface SearchPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  date: string;
  tags: string[];
}

export function SearchClient({ posts }: { posts: SearchPost[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ["title", "description", "tags", "categoryLabel"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [posts]
  );

  const filtered = useMemo(() => {
    let list = posts;
    if (query.trim()) {
      list = fuse.search(query).map((r) => r.item);
    }
    if (active !== "all") {
      list = list.filter((p) => p.category === active);
    }
    return list;
  }, [posts, fuse, query, active]);

  const filters = [
    { key: "all", label: "All" },
    { key: "us-investing", label: "US Investing" },
    { key: "rsu-management", label: "RSU Management" },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 3.359 9.84l3.4 3.4a.75.75 0 1 0 1.061-1.06l-3.4-3.4A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search LRS, RSU, taxes, ETFs…"
            className="w-full rounded-lg border border-ink-200 bg-white pl-9 pr-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            aria-label="Search posts"
          />
        </div>
        <div
          role="tablist"
          aria-label="Filter by category"
          className="flex flex-wrap gap-1 rounded-lg bg-ink-100 p-1"
        >
          {filters.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={active === f.key}
              onClick={() => setActive(f.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                active === f.key
                  ? "bg-white text-ink-900 shadow-sm"
                  : "text-ink-600 hover:text-ink-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-500">
        {filtered.length} {filtered.length === 1 ? "post" : "posts"}
      </p>

      <ul className="mt-4 divide-y divide-ink-100">
        {filtered.map((p) => (
          <li key={p.slug} className="py-5">
            <Link
              href={`/posts/${p.slug}`}
              className="group flex flex-col gap-1"
            >
              <div className="flex items-center gap-2 text-xs text-ink-500">
                <span
                  className={
                    p.category === "us-investing" ? "badge-us" : "badge-rsu"
                  }
                >
                  {p.categoryLabel}
                </span>
                <span>·</span>
                <time dateTime={p.date}>
                  {new Date(p.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h2 className="font-display text-lg font-semibold tracking-tight text-ink-900 group-hover:text-brand-700">
                {p.title}
              </h2>
              <p className="text-ink-600">{p.description}</p>
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-10 text-center text-ink-500">
            No posts match “{query}”.
          </li>
        )}
      </ul>
    </div>
  );
}
