import { SITE_URL } from "@/lib/seo";

export interface AuthorSocial {
  twitter?: string; // full URL
  linkedin?: string;
  email?: string;
  website?: string;
}

export interface Author {
  slug: string;
  name: string;
  shortBio: string; // 1-2 lines, used in bylines
  longBio: string; // paragraph, used on author page
  expertise: string[]; // topic tags
  credentials?: string[];
  social: AuthorSocial;
  /** Optional avatar path (under /public). Falls back to monogram if missing. */
  avatar?: string;
}

/**
 * Author registry. To add a new author, append a new entry and assign their
 * `slug` to the `author` frontmatter field on posts.
 *
 * NOTE: Bios below are placeholders pending verified copy from each author.
 * Update with real credentials, employer (or "independent"), education,
 * and verified social URLs before launch.
 */
export const AUTHORS: Record<string, Author> = {
  "shivang-badaya": {
    slug: "shivang-badaya",
    name: "Shivang Badaya",
    shortBio:
      "Writes about RSU management, equity comp negotiation, and US-India cross-border employment.",
    longBio:
      "Shivang covers RSU management and equity compensation at Vested. He writes about vesting mechanics, sell-to-cover strategy, ESPP vs. RSU trade-offs, stock-option taxation, and the negotiation playbook for Indian employees at US multinationals. His work focuses on what actually lands in your account after sell-to-cover, perquisite tax, and capital gains — not the gross numbers HR shows you.",
    expertise: [
      "RSU vesting & taxation",
      "ESPP / Stock options (ISO/NSO)",
      "Equity comp negotiation",
      "Cross-border employment",
      "Sell-to-cover strategy",
    ],
    credentials: [
      // TODO: replace with verified credentials when provided
      "Several years of experience working with cross-border equity compensation",
    ],
    social: {
      // TODO: replace with verified URLs when provided
      linkedin: "https://www.linkedin.com/in/shivang-badaya/",
      twitter: "https://twitter.com/shivangbadaya",
    },
  },

  "arnav-grover": {
    slug: "arnav-grover",
    name: "Arnav Grover",
    shortBio:
      "Writes about US investing from India, the LRS, US ETFs, and Indian tax compliance for foreign assets.",
    longBio:
      "Arnav covers US investing for Indian residents at Vested. He writes about the Liberalised Remittance Scheme, US brokerage choices, ETF selection, capital gains taxation under Indian law, dividend withholding and Form 67, Schedule FA disclosure, and the compliance side of holding foreign equity. His perspective: most US-investing advice online assumes you're American — Vested fixes that.",
    expertise: [
      "LRS & TCS compliance",
      "US ETFs & portfolio construction",
      "Capital gains tax (foreign equity)",
      "Form 67 / Foreign Tax Credit",
      "Schedule FA disclosure",
    ],
    credentials: [
      // TODO: replace with verified credentials when provided
      "Experienced in cross-border investing under FEMA / LRS",
    ],
    social: {
      linkedin: "https://www.linkedin.com/in/arnav-grover/",
      twitter: "https://twitter.com/arnavgrover",
    },
  },
};

export function getAuthor(slug: string): Author | null {
  return AUTHORS[slug] ?? null;
}

export function getAllAuthors(): Author[] {
  return Object.values(AUTHORS);
}

export function authorUrl(slug: string): string {
  return `${SITE_URL}/authors/${slug}`;
}

export function buildPersonLd(author: Author) {
  const sameAs = [author.social.twitter, author.social.linkedin, author.social.website]
    .filter((x): x is string => Boolean(x));
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: authorUrl(author.slug),
    description: author.shortBio,
    knowsAbout: author.expertise,
    sameAs,
  };
}
