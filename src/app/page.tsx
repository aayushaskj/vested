import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { CATEGORIES, getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-100">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu blur-3xl"
        >
          <div
            className="mx-auto aspect-[1155/678] w-[60rem] bg-gradient-to-tr from-brand-200 to-accent-200 opacity-30"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="container-wide py-16 sm:py-24">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700 ring-1 ring-inset ring-accent-100">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
              Written for Indian residents
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              US investing & RSU management,{" "}
              <span className="bg-gradient-to-r from-brand-700 to-accent-600 bg-clip-text text-transparent">
                without the guesswork.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-ink-600 leading-relaxed">
              Practical guides on the LRS, US brokerages, RSU vesting,
              double-taxation relief, and reinvesting strategies — built for
              Indian residents earning in INR (and sometimes USD).
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/category/us-investing"
                className="inline-flex items-center justify-center rounded-lg bg-ink-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-ink-800"
              >
                Start with US Investing
              </Link>
              <Link
                href="/category/rsu-management"
                className="inline-flex items-center justify-center rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-800 hover:border-ink-300"
              >
                RSU guides →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-wide py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map(
            (key) => {
              const c = CATEGORIES[key];
              return (
                <Link
                  key={key}
                  href={`/category/${key}`}
                  className="group rounded-2xl border border-ink-100 bg-white p-6 transition hover:border-ink-200 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className={c.badgeClass}>{c.label}</span>
                    <span
                      aria-hidden
                      className="text-ink-400 transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </div>
                  <p className="mt-3 text-ink-600 leading-relaxed">
                    {c.description}
                  </p>
                </Link>
              );
            }
          )}
        </div>
      </section>

      {/* Latest posts */}
      <section className="container-wide pb-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
            Latest posts
          </h2>
          <Link
            href="/search"
            className="text-sm font-medium text-ink-600 hover:text-ink-900"
          >
            Browse all →
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="mt-6 text-ink-500">
            No posts yet — drop the first MDX file into{" "}
            <code className="rounded bg-ink-100 px-1 py-0.5 text-xs">
              content/posts/
            </code>
            .
          </p>
        ) : (
          <div className="mt-6 grid gap-6">
            {featured && <PostCard post={featured} featured />}
            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2">
                {rest.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="container-wide pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-ink-900 to-ink-800 px-6 py-12 sm:px-12 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white">
              Get one practical post a week.
            </h2>
            <p className="mt-3 text-ink-200">
              Concise breakdowns on LRS, RSU taxes, US ETFs, and money moves
              that actually compound — straight to your inbox.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
            <p className="mt-3 text-xs text-ink-400">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
