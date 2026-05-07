import { SITE_URL } from "@/lib/seo";

export interface AuthorSocial {
  twitter?: string; // full URL
  linkedin?: string;
  email?: string;
  website?: string;
}

export interface AuthorAffiliation {
  /** Display name of the institution / employer. */
  name: string;
  /** Optional logo path under /public (e.g., "/logos/iit-bombay.svg"). Falls back to text. */
  logo?: string;
  /** Optional descriptor — degree, role, year range. */
  detail?: string;
  /** Optional URL (e.g., LinkedIn company page or homepage). */
  url?: string;
}

export interface Author {
  slug: string;
  name: string;
  /** Title and current organisation. */
  role: string;
  shortBio: string; // 1-2 lines, used in bylines
  longBio: string; // paragraph, used on author page
  expertise: string[]; // topic tags
  credentials?: string[];
  /** Schools, employers, certifications shown as logo chips on the profile. */
  affiliations?: AuthorAffiliation[];
  social: AuthorSocial;
  /** Avatar path under /public. Falls back to monogram if file missing. */
  avatar?: string;
}

/**
 * Author registry.
 *
 * Both authors are co-founders of Rovia (rovia.one) — a cross-border
 * investing platform. Vested.blog is the editorial publication.
 *
 * Logos referenced below should live under /public/logos/. If a logo file
 * is missing, the author profile page falls back to displaying the
 * institution name as text.
 */
export const AUTHORS: Record<string, Author> = {
  "shivang-badaya": {
    slug: "shivang-badaya",
    name: "Shivang Badaya",
    role: "Co-Founder & Chief Executive Officer, Rovia",
    shortBio:
      "CFA charterholder, ex-JP Morgan and Makrana Capital. Writes on RSU management, equity comp, and cross-border investments.",
    longBio:
      "An engineer turned hedge-fund investor, Shivang got into finance early — clearing all three CFA exams during his undergrad at IIT Bombay before joining JP Morgan. He went on to invest at Makrana Capital as a hedge-fund analyst, then led business at Zolve, an NRI fintech. He's now CEO of Rovia, a platform built for global citizens to invest globally. Shivang writes the RSU and equity-comp side of Vested — vesting mechanics, sell-to-cover strategy, ESPP vs. RSU trade-offs, stock options, and what actually lands in your account after Indian perquisite tax.",
    expertise: [
      "Cross-border investments",
      "RSU management & taxation",
      "ESPP and stock options (ISO/NSO)",
      "Hedge-fund investing",
      "Equity comp negotiation",
    ],
    credentials: [
      "CFA charterholder (cleared Levels 1, 2 and 3)",
      "SEBI Registered Investment Advisor (in-principle approval)",
      "B.Tech, IIT Bombay (2010–2014)",
      "Ex-JP Morgan, Makrana Capital, Zolve (Head of Business)",
    ],
    affiliations: [
      {
        name: "IIT Bombay",
        detail: "B.Tech, 2010–2014",
        logo: "/logos/iit-bombay.svg",
        url: "https://www.iitb.ac.in",
      },
      {
        name: "JP Morgan",
        detail: "Investment Banking Analyst",
        logo: "/logos/jp-morgan.svg",
        url: "https://www.jpmorgan.com",
      },
      {
        name: "Zolve",
        detail: "Head of Business",
        logo: "/logos/zolve.svg",
        url: "https://www.zolve.com",
      },
    ],
    social: {
      linkedin: "https://in.linkedin.com/in/shivang-badaya-66772430",
      email: "shivang@rovia.one",
      website: "https://rovia.one",
    },
    avatar: "/authors/shivang-badaya.jpg",
  },

  "arnav-grover": {
    slug: "arnav-grover",
    name: "Arnav Grover",
    role: "Co-Founder & Chief Product Officer, Rovia",
    shortBio:
      "IIT Bombay + IIM Calcutta. Founding PM at Aspora (NRI fintech). Writes on cross-border investing, payments, and taxation.",
    longBio:
      "A finance and product enthusiast, Arnav joined IIM Calcutta after his engineering at IIT Bombay. He played key roles on the early teams at Zolve and Aspora (formerly Vance) — now the largest NRI fintech in India. His experience building cross-border platforms led him to deeply understand how international investing actually works for Indian residents, and eventually to co-founding Rovia. At Vested he covers the US investing side: the LRS, brokerage choices, US ETFs, foreign equity taxation, dividend withholding, Form 67, and Schedule FA.",
    expertise: [
      "Cross-border investing",
      "Cross-border payments",
      "Cross-border taxation",
      "LRS & FEMA compliance",
      "US ETF portfolio construction",
    ],
    credentials: [
      "CFA Levels 1 and 2 cleared",
      "SEBI Registered Mutual Funds Distributor",
      "B.Tech, IIT Bombay (2011–2015)",
      "MBA, IIM Calcutta (2017–2019)",
      "Founding Product Manager at Aspora (now the largest NRI fintech)",
    ],
    affiliations: [
      {
        name: "IIT Bombay",
        detail: "B.Tech, 2011–2015",
        logo: "/logos/iit-bombay.svg",
        url: "https://www.iitb.ac.in",
      },
      {
        name: "IIM Calcutta",
        detail: "MBA, 2017–2019",
        logo: "/logos/iim-calcutta.svg",
        url: "https://www.iimcal.ac.in",
      },
      {
        name: "Aspora",
        detail: "Founding Product Manager",
        logo: "/logos/aspora.svg",
        url: "https://www.aspora.com",
      },
    ],
    social: {
      linkedin: "https://in.linkedin.com/in/arnav-grover-a4611051",
      email: "arnav@rovia.one",
      website: "https://rovia.one",
    },
    avatar: "/authors/arnav-grover.jpg",
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
  const sameAs = [
    author.social.twitter,
    author.social.linkedin,
    author.social.website,
  ].filter((x): x is string => Boolean(x));

  const affiliationLd = (author.affiliations ?? []).map((a) => ({
    "@type": "Organization",
    name: a.name,
    url: a.url,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    worksFor: {
      "@type": "Organization",
      name: "Rovia",
      url: "https://rovia.one",
    },
    url: authorUrl(author.slug),
    description: author.shortBio,
    knowsAbout: author.expertise,
    alumniOf: affiliationLd,
    sameAs,
    image: author.avatar ? `${SITE_URL}${author.avatar}` : undefined,
  };
}
