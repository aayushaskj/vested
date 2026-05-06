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
  author?: string;
  draft?: boolean;
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

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
