import Link from "next/link";
import { CATEGORIES, formatDate, type Post } from "@/lib/posts";

export function RelatedPosts({ posts }: { posts: Post[] }) {
  return (
    <section className="mt-12" aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="font-display text-xl font-semibold text-ink-900"
      >
        Keep reading
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {posts.map((p) => {
          const cat = CATEGORIES[p.category];
          return (
            <Link
              key={p.slug}
              href={`/posts/${p.slug}`}
              className="group flex flex-col rounded-xl border border-ink-100 bg-white p-5 transition hover:border-ink-200 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-500">
                <span className={cat.badgeClass}>{cat.label}</span>
                <time dateTime={p.date} className="whitespace-nowrap">
                  {formatDate(p.date)}
                </time>
              </div>
              <h3 className="mt-2 font-display text-base font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
                {p.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-ink-600">
                {p.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
