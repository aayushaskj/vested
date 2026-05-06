# Vested.blog

US investing & RSU management, written for Indian residents.

Live: https://vested.blog (once deployed)

## Stack

- **Next.js 15** (App Router, React Server Components)
- **MDX** for blog posts (via `next-mdx-remote`)
- **Tailwind CSS** + `@tailwindcss/typography` for styling
- **Fuse.js** for client-side search
- **gray-matter** for frontmatter parsing

## Project structure

```
vested-blog/
├── content/
│   └── posts/                  # ← write blog posts here as .mdx
├── src/
│   ├── app/
│   │   ├── page.tsx            # Homepage
│   │   ├── about/page.tsx      # About
│   │   ├── search/page.tsx     # Search
│   │   ├── category/[slug]/    # /category/us-investing, /category/rsu-management
│   │   ├── posts/[slug]/       # Individual post pages
│   │   └── tools/rsu-calculator/
│   ├── components/             # SiteHeader, SiteFooter, PostCard, RsuCalculator, etc.
│   └── lib/posts.ts            # Reads MDX files, parses frontmatter
├── tailwind.config.ts
└── next.config.mjs
```

## Adding a new post

Create a new `.mdx` file in `content/posts/`:

```mdx
---
title: "Your post title"
description: "One-sentence summary that shows up in cards and SEO."
date: "2026-05-10"
category: "us-investing"          # or "rsu-management"
tags: ["lrs", "tcs"]
author: "Vested"
draft: false                       # set true to hide
---

Your post body in MDX. Use any custom component, e.g.:

<Callout type="tip">
  Box-style highlight. Types: note, warning, tip.
</Callout>
```

Restart the dev server (or just save — Next.js hot-reloads) and the post appears.

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

## Production build

```bash
npm run build
npm start
```

## Deployment to vested.blog (GoDaddy DNS → Vercel)

The fastest path:

1. **Push this repo to GitHub** (instructions below).
2. **Sign in to [vercel.com](https://vercel.com)** with your GitHub account.
3. **Import the repo.** Framework auto-detects as Next.js. Click **Deploy**.
4. **Add the custom domain** in Vercel → Project → Settings → Domains:
   - Add `vested.blog` and `www.vested.blog`.
5. **Update DNS at GoDaddy:**
   - Log into GoDaddy → My Products → vested.blog → DNS.
   - **A record** for `@`: point to `76.76.21.21` (Vercel's apex IP).
   - **CNAME record** for `www`: point to `cname.vercel-dns.com`.
   - Remove any existing parking-page A records.
6. Wait 5–60 minutes for DNS propagation. Vercel will provision SSL automatically.

(Netlify works the same way — point `@` to Netlify's load balancer IP and `www` to your Netlify subdomain.)

## Pushing to GitHub

```bash
cd "/Users/aayushjain/Desktop/Vested blog"
git init -b main
git add .
git commit -m "Initial commit: Vested.blog scaffold"
gh repo create vested-blog --public --source=. --remote=origin --description "US investing & RSU management for Indian residents — vested.blog"
git push -u origin main
```

If you'd rather keep the repo private, replace `--public` with `--private`.

## Newsletter integration (TODO)

`src/components/NewsletterForm.tsx` currently shows a success state but doesn't POST anywhere. To wire it up:

- **ConvertKit:** create a form, grab the form ID, POST to `https://api.convertkit.com/v3/forms/{form_id}/subscribe`.
- **Substack:** Substack doesn't have a public signup API; use their embed iframe or redirect to the Substack subscribe URL.
- **Mailchimp:** create an audience, copy the embed action URL, POST to it.

Add the API key as `NEXT_PUBLIC_NEWSLETTER_*` (or non-public for server-side) in `.env.local` and Vercel env settings.

## License

All content © Aayush. Code under MIT.
