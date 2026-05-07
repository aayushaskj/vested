import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  CATEGORIES,
  formatDate,
  getAllTags,
  getPostsByTag,
  tagToSlug,
} from "@/lib/posts";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return getAllTags().map((t) => ({ slug: tagToSlug(t) }));
}

function findTagBySlug(slug: string): string | null {
  return getAllTags().find((t) => tagToSlug(t) === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = findTagBySlug(slug);
  if (!tag) return {};
  const posts = getPostsByTag(tag);
  return {
    title: `${tag} — ${posts.length} posts`,
    description: `Every Vested post tagged "${tag}" — covering US investing, RSUs, and Indian tax for residents.`,
    alternates: { canonical: `/tags/${slug}` },
    openGraph: {
      title: `Posts tagged "${tag}" · ${SITE_NAME}`,
      description: `${posts.length} posts on ${tag}.`,
      url: `${SITE_URL}/tags/${slug}`,
      type: "website",
      locale: "en_IN",
      images: [{ url: "/og-default.png", width: 1200, height: 630 }],
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = findTagBySlug(slug);
  if (!tag) notFound();
  const posts = getPostsByTag(tag);

  return (
    <div className="container-wide py-12 sm:py-16">
      <nav className="text-sm text-ink-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink-700">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-ink-700">
          All posts
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-700">Tag: {tag}</span>
      </nav>
      <header className="mt-4 max-w-2xl">
        <p className="text-sm font-medium text-accent-700">Tag</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          {tag}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-600">
          {posts.length} {posts.length === 1 ? "post" : "posts"} tagged{" "}
          <code className="rounded bg-ink-100 px-1.5 py-0.5 text-sm">{tag}</code>
        </p>
      </header>

      <ul className="mt-8 divide-y divide-ink-100">
        {posts.map((p) => {
          const cat = CATEGORIES[p.category];
          return (
            <li key={p.slug} className="py-5">
              <Link
                href={`/posts/${p.slug}`}
                className="group flex flex-col gap-1"
              >
                <div className="flex items-center gap-2 text-xs text-ink-500">
                  <span className={cat.badgeClass}>{cat.label}</span>
                  <span>·</span>
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                </div>
                <h2 className="font-display text-base font-semibold text-ink-900 group-hover:text-brand-700 sm:text-lg">
                  {p.title}
                </h2>
                <p className="text-sm text-ink-600">{p.description}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
