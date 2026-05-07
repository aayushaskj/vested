import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type Category = "us-investing" | "rsu-management";

export const CATEGORIES: Record<
  Category,
  { label: string; description: string; badgeClass: string }
> = {
  "us-investing": {
    label: "US Investing",
    description:
      "How Indian residents can invest in US markets — LRS, brokerages, taxes, and portfolio building.",
    badgeClass: "badge-us",
  },
  "rsu-management": {
    label: "RSU Management",
    description:
      "Vesting schedules, withholding, double taxation relief, and reinvesting RSU proceeds smartly.",
    badgeClass: "badge-rsu",
  },
};

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  category: Category;
  tags?: string[];
  /** Author slug from src/lib/authors.ts (e.g., "shivang-badaya"). */
  author?: string;
  draft?: boolean;
  /** Magazine-cover OG image: the big number / phrase. e.g. "₹4.17L", "24 months", "₹10L". */
  ogHook?: string;
  /** Magazine-cover OG image: the 1-3 word concept under the hook. e.g. "RSU TAX", "LTCG RULE". */
  ogLabel?: string;
  /** Optional contextual line above the hook. e.g. "On every vest at the 30% slab,". */
  ogContext?: string;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  readingMinutes: number;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

function ensureDir(): void {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

export function getAllPosts(): Post[] {
  ensureDir();
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.(mdx|md)$/i, "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const fm = data as PostFrontmatter;
    const stats = readingTime(content);
    return {
      ...fm,
      slug,
      content,
      readingMinutes: Math.max(1, Math.round(stats.minutes)),
    } satisfies Post;
  });

  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function getPostsByCategory(category: Category): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostsByAuthor(authorSlug: string): Post[] {
  return getAllPosts().filter((p) => p.author === authorSlug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const p of getAllPosts()) {
    for (const t of p.tags ?? []) tags.add(t);
  }
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => (p.tags ?? []).includes(tag));
}

export function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Returns up to `limit` related posts. Scoring:
 *   - tag overlap × 10
 *   - same category × 3
 *   - same author × 2
 *   - longer post (>= 2000 words) × 1 (favours pillars over short posts)
 * Excludes the current post.
 */
export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const all = getAllPosts().filter((p) => p.slug !== post.slug);
  const tagSet = new Set(post.tags ?? []);

  const scored = all.map((p) => {
    const tagOverlap = (p.tags ?? []).filter((t) => tagSet.has(t)).length;
    const sameCategory = p.category === post.category ? 1 : 0;
    const sameAuthor = p.author && p.author === post.author ? 1 : 0;
    const isLong = p.content.length > 8000 ? 1 : 0; // ~2000 words
    const score =
      tagOverlap * 10 + sameCategory * 3 + sameAuthor * 2 + isLong * 1;
    return { post: p, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.post.date < b.post.date ? 1 : -1;
  });

  return scored
    .filter((s) => s.score > 0)
    .slice(0, limit)
    .map((s) => s.post);
}

/**
 * For homepage / category pages: returns the "pillar" posts (longer pieces)
 * sorted by length desc, then date desc.
 */
export function getPillarPosts(limit = 6): Post[] {
  return getAllPosts()
    .filter((p) => p.content.length > 8000) // ~2000+ words
    .sort((a, b) => b.content.length - a.content.length)
    .slice(0, limit);
}
