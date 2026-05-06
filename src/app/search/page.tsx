import type { Metadata } from "next";
import { getAllPosts, CATEGORIES } from "@/lib/posts";
import { SearchClient } from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "All posts — search the Vested archive",
  description:
    "Search every post on Vested by topic, tag, or keyword. US investing, RSUs, LRS, taxes, and more for Indian residents.",
  alternates: { canonical: "/search" },
  robots: { index: true, follow: true },
};

export default function SearchPage() {
  const posts = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    categoryLabel: CATEGORIES[p.category].label,
    date: p.date,
    tags: p.tags ?? [],
  }));

  return (
    <div className="container-wide py-16">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
        Search
      </h1>
      <p className="mt-3 text-ink-600">
        Find posts by title, topic, or keyword.
      </p>
      <div className="mt-8">
        <SearchClient posts={posts} />
      </div>
    </div>
  );
}
