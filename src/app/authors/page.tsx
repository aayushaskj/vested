import type { Metadata } from "next";
import Link from "next/link";
import { getAllAuthors } from "@/lib/authors";
import { getPostsByAuthor } from "@/lib/posts";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Authors at Vested",
  description:
    "Meet the team behind Vested — Shivang Badaya and Arnav Grover. Practical writing on US investing, RSUs, and Indian tax for residents.",
  alternates: { canonical: "/authors" },
  openGraph: {
    title: "Authors at Vested",
    description:
      "Meet the team behind Vested — practical writing on US investing, RSUs, and Indian tax for residents.",
    url: `${SITE_URL}/authors`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};

export default function AuthorsIndexPage() {
  const authors = getAllAuthors();

  return (
    <div className="container-wide py-12 sm:py-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          The Vested team
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          Vested is written by people who actually live the cross-border
          investing problems they cover. Each author specialises in a different
          slice of the field.
        </p>
      </header>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {authors.map((a) => {
          const postCount = getPostsByAuthor(a.slug).length;
          return (
            <Link
              key={a.slug}
              href={`/authors/${a.slug}`}
              className="group rounded-2xl border border-ink-100 bg-white p-6 transition hover:border-ink-200 hover:shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div
                  aria-hidden
                  className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-accent-500 font-display text-xl font-bold text-white"
                >
                  {a.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink-900 group-hover:text-brand-700">
                    {a.name}
                  </h2>
                  <p className="text-sm text-ink-500">
                    {postCount} {postCount === 1 ? "post" : "posts"}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-ink-600 leading-relaxed">{a.shortBio}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {a.expertise.slice(0, 3).map((e) => (
                  <li
                    key={e}
                    className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs text-ink-700"
                  >
                    {e}
                  </li>
                ))}
              </ul>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
