import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags, getPostsByTag, tagToSlug } from "@/lib/posts";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All tags",
  description: "Every topic covered on Vested — find posts by tag.",
  alternates: { canonical: "/tags" },
  openGraph: {
    title: "All tags · Vested",
    description: "Every topic covered on Vested — find posts by tag.",
    url: `${SITE_URL}/tags`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};

export default function TagsIndexPage() {
  const tags = getAllTags();
  return (
    <div className="container-wide py-12 sm:py-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          All tags
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600">
          {tags.length} topics covered across the Vested archive. Click any tag
          to filter.
        </p>
      </header>
      <ul className="mt-8 flex flex-wrap gap-2">
        {tags.map((t) => {
          const count = getPostsByTag(t).length;
          return (
            <li key={t}>
              <Link
                href={`/tags/${tagToSlug(t)}`}
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-700 hover:border-ink-300 hover:bg-ink-50"
              >
                <span>{t}</span>
                <span className="text-xs text-ink-500">{count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
