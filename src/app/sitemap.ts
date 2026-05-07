import type { MetadataRoute } from "next";
import { CATEGORIES, getAllPosts, getAllTags, tagToSlug } from "@/lib/posts";
import { getAllAuthors } from "@/lib/authors";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const lastPostDate = posts[0]?.date ?? new Date().toISOString().slice(0, 10);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(lastPostDate),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date("2026-05-06"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(lastPostDate),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(lastPostDate),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/tools/rsu-calculator`,
      lastModified: new Date("2026-05-06"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = (
    Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>
  ).map((slug) => ({
    url: `${SITE_URL}/category/${slug}`,
    lastModified: new Date(lastPostDate),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const authorRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/authors`,
      lastModified: new Date(lastPostDate),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...getAllAuthors().map((a) => ({
      url: `${SITE_URL}/authors/${a.slug}`,
      lastModified: new Date(lastPostDate),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const tagRoutes: MetadataRoute.Sitemap = getAllTags().map((t) => ({
    url: `${SITE_URL}/tags/${tagToSlug(t)}`,
    lastModified: new Date(lastPostDate),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...authorRoutes,
    ...tagRoutes,
    ...postRoutes,
  ];
}
