import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import {
  CATEGORIES,
  type Category,
  getPostsByCategory,
} from "@/lib/posts";

export function generateStaticParams() {
  return (Object.keys(CATEGORIES) as Category[]).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = CATEGORIES[slug as Category];
  if (!cat) return {};
  return {
    title: cat.label,
    description: cat.description,
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

  return (
    <div className="container-wide py-16">
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
