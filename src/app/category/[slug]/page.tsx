import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { PostCard } from "@/components/PostCard";
import {
  CATEGORIES,
  type Category,
  getPostsByCategory,
} from "@/lib/posts";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return (Object.keys(CATEGORIES) as Category[]).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES[slug as Category];
  if (!cat) return {};
  return {
    title: cat.label,
    description: cat.description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: `${cat.label} · ${SITE_NAME}`,
      description: cat.description,
      url: `${SITE_URL}/category/${slug}`,
      type: "website",
      locale: "en_IN",
      images: [{ url: "/og-default.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.label} · ${SITE_NAME}`,
      description: cat.description,
      images: ["/og-default.png"],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const key = slug as Category;
  if (!CATEGORIES[key]) notFound();
  const cat = CATEGORIES[key];
  const posts = getPostsByCategory(key);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: cat.label,
        item: `${SITE_URL}/category/${key}`,
      },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.label} · ${SITE_NAME}`,
    description: cat.description,
    url: `${SITE_URL}/category/${key}`,
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    hasPart: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/posts/${p.slug}`,
      datePublished: p.date,
    })),
  };

  return (
    <div className="container-wide py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <nav className="text-sm text-ink-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink-700">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-700">{cat.label}</span>
      </nav>
      <header className="mt-4 max-w-2xl">
        <span className={cat.badgeClass}>{cat.label}</span>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          {cat.label}
        </h1>
        <p className="mt-3 text-lg text-ink-600 leading-relaxed">
          {cat.description}
        </p>
      </header>

      <div className="mt-10">
        {posts.length === 0 ? (
          <p className="text-ink-500">No posts in this category yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
