import Link from "next/link";
import { CATEGORIES, type Post, formatDate } from "@/lib/posts";

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const cat = CATEGORIES[post.category];
  return (
    <article
      className={`group relative flex flex-col rounded-2xl border border-ink-100 bg-white p-6 transition hover:border-ink-200 hover:shadow-sm ${
        featured ? "sm:p-8" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-500">
        <span className={cat.badgeClass}>{cat.label}</span>
        <time dateTime={post.date} className="whitespace-nowrap">
          {formatDate(post.date)}
        </time>
        <span aria-hidden>·</span>
        <span className="whitespace-nowrap">{post.readingMinutes} min read</span>
      </div>
      <h2
        className={`mt-3 font-display font-semibold tracking-tight text-ink-900 ${
          featured ? "text-2xl sm:text-3xl" : "text-xl"
        }`}
      >
        <Link
          href={`/posts/${post.slug}`}
          className="before:absolute before:inset-0"
        >
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 text-ink-600 leading-relaxed">{post.description}</p>
      <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-700 group-hover:text-brand-800">
        Read post
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
        >
          <path
            fillRule="evenodd"
            d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </article>
  );
}
