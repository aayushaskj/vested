import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  AUTHORS,
  buildPersonLd,
  getAllAuthors,
  getAuthor,
} from "@/lib/authors";
import { CATEGORIES, formatDate, getPostsByAuthor } from "@/lib/posts";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return {};
  return {
    title: `${author.name} — author at Vested`,
    description: author.shortBio,
    alternates: { canonical: `/authors/${slug}` },
    openGraph: {
      title: `${author.name} · ${SITE_NAME}`,
      description: author.shortBio,
      url: `${SITE_URL}/authors/${slug}`,
      type: "profile",
      locale: "en_IN",
      images: [{ url: "/og-default.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${author.name} · ${SITE_NAME}`,
      description: author.shortBio,
      images: ["/og-default.png"],
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();
  const posts = getPostsByAuthor(slug);
  const personLd = buildPersonLd(author);

  return (
    <div className="container-prose py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <header>
        <p className="text-sm text-ink-500">Author</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          {author.name}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-700 leading-relaxed">
          {author.shortBio}
        </p>
        <p className="mt-4 text-ink-700 leading-relaxed">{author.longBio}</p>

        {(author.social.twitter ||
          author.social.linkedin ||
          author.social.website) && (
          <ul className="mt-5 flex flex-wrap gap-3 text-sm">
            {author.social.linkedin && (
              <li>
                <a
                  href={author.social.linkedin}
                  rel="noopener noreferrer me"
                  target="_blank"
                  className="rounded-md border border-ink-200 px-3 py-1.5 text-ink-700 hover:border-ink-300"
                >
                  LinkedIn ↗
                </a>
              </li>
            )}
            {author.social.twitter && (
              <li>
                <a
                  href={author.social.twitter}
                  rel="noopener noreferrer me"
                  target="_blank"
                  className="rounded-md border border-ink-200 px-3 py-1.5 text-ink-700 hover:border-ink-300"
                >
                  X / Twitter ↗
                </a>
              </li>
            )}
            {author.social.website && (
              <li>
                <a
                  href={author.social.website}
                  rel="noopener noreferrer me"
                  target="_blank"
                  className="rounded-md border border-ink-200 px-3 py-1.5 text-ink-700 hover:border-ink-300"
                >
                  Website ↗
                </a>
              </li>
            )}
          </ul>
        )}
      </header>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          Areas of expertise
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {author.expertise.map((e) => (
            <li
              key={e}
              className="rounded-full bg-ink-100 px-3 py-1 text-sm text-ink-700"
            >
              {e}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          Posts by {author.name.split(" ")[0]}
        </h2>
        <ul className="mt-4 divide-y divide-ink-100">
          {posts.map((p) => {
            const cat = CATEGORIES[p.category];
            return (
              <li key={p.slug} className="py-4">
                <Link
                  href={`/posts/${p.slug}`}
                  className="group flex flex-col gap-1"
                >
                  <div className="flex items-center gap-2 text-xs text-ink-500">
                    <span className={cat.badgeClass}>{cat.label}</span>
                    <span>·</span>
                    <time dateTime={p.date}>{formatDate(p.date)}</time>
                  </div>
                  <h3 className="font-display text-base font-medium text-ink-900 group-hover:text-brand-700 sm:text-lg">
                    {p.title}
                  </h3>
                  <p className="text-sm text-ink-600">{p.description}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
