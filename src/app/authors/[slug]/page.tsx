import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  buildPersonLd,
  getAllAuthors,
  getAuthor,
} from "@/lib/authors";
import { CATEGORIES, formatDate, getPostsByAuthor } from "@/lib/posts";
import { SITE_URL, SITE_NAME, ogImageUrlAuthor } from "@/lib/seo";
import { AuthorAvatar } from "@/components/AuthorAvatar";
import { AffiliationChips } from "@/components/AffiliationChips";

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
  const ogImage = ogImageUrlAuthor(slug);
  // Short, SEO-optimised meta title — separate from the editorial H1 on page.
  const headTitle = `${author.name} — ${SITE_NAME}`;
  return {
    title: headTitle,
    description: author.shortBio,
    alternates: { canonical: `/authors/${slug}` },
    openGraph: {
      title: `${author.name} · ${SITE_NAME}`,
      description: author.shortBio,
      url: `${SITE_URL}/authors/${slug}`,
      type: "profile",
      locale: "en_IN",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${author.name} · ${SITE_NAME}`,
      description: author.shortBio,
      images: [ogImage],
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
    <div className="container-prose py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />

      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <AuthorAvatar
          author={author}
          size={96}
          className="ring-4 ring-white shadow-md"
        />
        <div className="flex-1">
          <p className="text-sm text-ink-500">Author</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            {author.name}
          </h1>
          <p className="mt-1 text-sm font-medium text-brand-700">
            {author.role}
          </p>
          <p className="mt-3 text-base text-ink-700 leading-relaxed">
            {author.shortBio}
          </p>
        </div>
      </header>

      {author.affiliations && author.affiliations.length > 0 && (
        <section className="mt-6">
          <AffiliationChips items={author.affiliations} />
        </section>
      )}

      <p className="mt-8 text-base text-ink-700 leading-relaxed">
        {author.longBio}
      </p>

      {author.credentials && author.credentials.length > 0 && (
        <section className="mt-8 rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
          <h2 className="font-display text-base font-semibold text-ink-900">
            Credentials
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-700">
            {author.credentials.map((c) => (
              <li key={c} className="flex gap-2">
                <span aria-hidden className="mt-1 text-accent-600">
                  ✓
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(author.social.linkedin ||
        author.social.twitter ||
        author.social.website ||
        author.social.email) && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-ink-900">Connect</h2>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
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
            {author.social.email && (
              <li>
                <a
                  href={`mailto:${author.social.email}`}
                  className="rounded-md border border-ink-200 px-3 py-1.5 text-ink-700 hover:border-ink-300"
                >
                  Email ↗
                </a>
              </li>
            )}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display text-base font-semibold text-ink-900">
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
