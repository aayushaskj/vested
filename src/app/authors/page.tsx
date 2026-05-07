import type { Metadata } from "next";
import Link from "next/link";
import { getAllAuthors } from "@/lib/authors";
import { getPostsByAuthor } from "@/lib/posts";
import { SITE_URL } from "@/lib/seo";
import { AuthorAvatar } from "@/components/AuthorAvatar";

export const metadata: Metadata = {
  title: "Authors at Vested",
  description:
    "Meet the team behind Vested — Shivang Badaya and Arnav Grover, co-founders of Rovia. Practical writing on US investing, RSUs, and Indian tax for residents.",
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
    <div className="container-wide py-10 sm:py-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          The Vested team
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
          Vested is written by Shivang Badaya and Arnav Grover, co-founders of{" "}
          <a
            href="https://rovia.one"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink-900 underline decoration-ink-300 underline-offset-2 hover:decoration-ink-500"
          >
            Rovia
          </a>
          . They've built cross-border investing and fintech products for
          Indian residents at IIT Bombay, IIM Calcutta, JP Morgan, Aspora, and
          Zolve.
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
              <div className="flex items-start gap-4">
                <AuthorAvatar author={a} size={64} />
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-lg font-semibold text-ink-900 group-hover:text-brand-700">
                    {a.name}
                  </h2>
                  <p className="text-sm text-brand-700">{a.role}</p>
                  <p className="mt-1 text-xs text-ink-500">
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
