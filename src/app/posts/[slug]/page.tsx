import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  CATEGORIES,
  formatDate,
  getAllPosts,
  getPostBySlug,
} from "@/lib/posts";
import { NewsletterForm } from "@/components/NewsletterForm";
import { mdxComponents } from "@/components/mdxComponents";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
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

  return (
    <article className="pb-24">
      <header className="border-b border-ink-100 bg-ink-50/40">
        <div className="container-prose pt-12 pb-10">
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
          <div className="mt-4 flex items-center gap-2 text-xs text-ink-500">
            <span className={cat.badgeClass}>{cat.label}</span>
            <span>·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-ink-600 leading-relaxed">
            {post.description}
          </p>
        </div>
      </header>

      <div className="container-prose pt-12">
        <div className="prose prose-ink max-w-none">{compiled}</div>

        <hr className="my-12 border-ink-100" />

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
      </div>
    </article>
  );
}
