import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, formatDate, getAllPosts } from "@/lib/posts";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All posts — the Vested archive",
  description:
    "The complete archive of Vested posts on US investing, RSUs, LRS, and Indian tax — sorted by date.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `All posts · ${SITE_NAME}`,
    description:
      "The complete archive of Vested posts on US investing, RSUs, LRS, and Indian tax.",
    url: `${SITE_URL}/blog`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const grouped = posts.reduce<Record<string, typeof posts>>((acc, p) => {
    const year = p.date.slice(0, 4);
    if (!acc[year]) acc[year] = [];
    acc[year].push(p);
    return acc;
  }, {});
  const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/posts/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <div className="container-wide py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          All posts
        </h1>
        <p className="mt-3 text-lg text-ink-600 leading-relaxed">
          The complete archive — {posts.length} posts on US investing, RSUs,
          and Indian tax.
        </p>
      </header>

      <div className="mt-12 space-y-12">
        {years.map((year) => (
          <section key={year}>
            <h2 className="font-display text-2xl font-semibold text-ink-900">
              {year}
            </h2>
            <ul className="mt-6 divide-y divide-ink-100">
              {grouped[year].map((p) => {
                const cat = CATEGORIES[p.category];
                return (
                  <li key={p.slug} className="py-4">
                    <Link
                      href={`/posts/${p.slug}`}
                      className="group flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <time
                          dateTime={p.date}
                          className="text-sm tabular-nums text-ink-500 sm:w-24"
                        >
                          {formatDate(p.date)}
                        </time>
                        <h3 className="font-display text-base font-medium text-ink-900 group-hover:text-brand-700 sm:text-lg">
                          {p.title}
                        </h3>
                      </div>
                      <span className={cat.badgeClass}>{cat.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
