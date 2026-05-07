import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  CATEGORIES,
  formatDate,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  tagToSlug,
} from "@/lib/posts";
import { NewsletterForm } from "@/components/NewsletterForm";
import { RelatedPosts } from "@/components/RelatedPosts";
import { mdxComponents } from "@/components/mdxComponents";
import { SITE_URL, SITE_NAME, ogImageUrl, postUrl } from "@/lib/seo";
import { getAuthor, authorUrl, buildPersonLd } from "@/lib/authors";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = postUrl(slug);
  const og = ogImageUrl(slug);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/posts/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: SITE_NAME,
      type: "article",
      locale: "en_IN",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author ?? "Vested"],
      tags: post.tags ?? [],
      images: [
        {
          url: og,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [og],
    },
    keywords: post.tags ?? [],
    authors: [{ name: post.author ?? "Vested" }],
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const cat = CATEGORIES[post.category];
  const related = getRelatedPosts(post, 3);

  const { content: compiled } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  });

  const author = post.author ? getAuthor(post.author) : null;

  // Article schema
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en-IN",
    author: author
      ? {
          "@type": "Person",
          name: author.name,
          url: authorUrl(author.slug),
          sameAs: [
            author.social.twitter,
            author.social.linkedin,
            author.social.website,
          ].filter(Boolean),
        }
      : {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    image: [`${SITE_URL}${ogImageUrl(slug)}`],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl(slug),
    },
    articleSection: cat.label,
    keywords: (post.tags ?? []).join(", "),
    timeRequired: `PT${post.readingMinutes}M`,
  };

  const personLd = author ? buildPersonLd(author) : null;

  // Breadcrumb schema
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cat.label,
        item: `${SITE_URL}/category/${post.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl(slug),
      },
    ],
  };

  return (
    <article className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {personLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
      )}

      <header className="border-b border-ink-100 bg-ink-50/40">
        <div className="container-prose pt-8 pb-8 sm:pt-12 sm:pb-10">
          <nav className="text-sm text-ink-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-ink-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/category/${post.category}`}
              className="hover:text-ink-700"
            >
              {cat.label}
            </Link>
          </nav>
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-500">
            <span className={cat.badgeClass}>{cat.label}</span>
            <span>·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
            {post.description}
          </p>
          {author ? (
            <p className="mt-6 text-sm text-ink-500">
              By{" "}
              <Link
                href={`/authors/${author.slug}`}
                className="font-medium text-ink-700 hover:text-ink-900"
                rel="author"
              >
                {author.name}
              </Link>{" "}
              <span className="hidden sm:inline">— {author.shortBio}</span>
            </p>
          ) : (
            <p className="mt-6 text-sm text-ink-500">
              By{" "}
              <Link
                href="/authors"
                className="font-medium text-ink-700 hover:text-ink-900"
                rel="author"
              >
                Vested
              </Link>
            </p>
          )}
        </div>
      </header>

      <div className="container-prose pt-8 sm:pt-12">
        <div className="prose prose-ink max-w-none">{compiled}</div>

        {(post.tags ?? []).length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-ink-500">Tagged:</span>
            {(post.tags ?? []).map((t) => (
              <Link
                key={t}
                href={`/tags/${tagToSlug(t)}`}
                className="rounded-full border border-ink-200 bg-white px-2.5 py-0.5 text-xs text-ink-700 hover:border-ink-300 hover:bg-ink-50"
              >
                #{t}
              </Link>
            ))}
          </div>
        )}

        <hr className="my-10 border-ink-100" />

        <div className="rounded-2xl bg-ink-50 p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            Get more like this in your inbox
          </h2>
          <p className="mt-2 text-ink-600">
            One practical post a week on US investing & RSU strategy.
          </p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>

        {related.length > 0 && <RelatedPosts posts={related} />}
      </div>
    </article>
  );
}
