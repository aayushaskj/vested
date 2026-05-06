import Link from "next/link";
import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "About Vested",
  description:
    "Vested is a publication for Indian residents covering US investing, RSU management, and Indian tax compliance.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Vested",
    description:
      "Vested is a publication for Indian residents covering US investing, RSU management, and Indian tax compliance.",
    url: "/about",
    type: "profile",
    locale: "en_IN",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  return (
    <div className="container-prose py-16">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
        About Vested
      </h1>
      <p className="mt-4 text-lg text-ink-600 leading-relaxed">
        Vested is a publication for Indian residents who want to invest in US
        markets and manage RSUs without getting lost in jargon, half-baked
        Reddit threads, or generic American advice that ignores how the LRS,
        TCS, and Indian tax law actually work.
      </p>

      <div className="prose prose-ink mt-10 max-w-none">
        <h2>Why this exists</h2>
        <p>
          If you live in India and earn (or hold) US assets — RSUs from a
          multinational employer, ETFs bought via the LRS, ESPP shares — most
          of the content out there is written for an American reader. It
          glosses over the parts that actually matter for you: 20% TCS on
          remittances, 25% US dividend withholding, capital gains classified as
          “unlisted foreign equity,” Form 67 for foreign tax credit, schedule
          FA disclosures, and so on.
        </p>
        <p>
          Vested is the publication I wished existed when I first started
          investing across borders. Every post is written from one assumption:
          you are an Indian resident, and the rules you operate under are
          Indian.
        </p>

        <h2>What you’ll find here</h2>
        <ul>
          <li>
            <strong>US Investing</strong> — LRS basics, brokerage comparisons
            (Vested, INDmoney, IBKR), ETF picks, capital gains taxation,
            currency risk, and rebalancing across rupee/dollar portfolios.
          </li>
          <li>
            <strong>RSU Management</strong> — vesting mechanics, the sell-to-cover
            trap, US-India tax treaty relief, when to hold vs. sell, and how to
            redeploy proceeds.
          </li>
          <li>
            <strong>Calculators</strong> — small interactive tools so you can
            run the numbers on your own situation, not someone else’s.
          </li>
        </ul>

        <h2>What this is not</h2>
        <p>
          This is not investment, tax, or legal advice. I write what I’ve
          learned and what I’ve verified against primary sources (RBI master
          directions, the Income Tax Act, IRS publications). For decisions
          specific to you, please talk to a SEBI-registered investment advisor
          and a qualified CA.
        </p>

        <h2>Contact</h2>
        <p>
          Got a topic you want covered, or a correction? Reach out via the{" "}
          <Link href="/">homepage</Link> or reply to the newsletter.
        </p>
      </div>

      <div className="mt-12 rounded-2xl bg-ink-50 p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-ink-900">
          Subscribe
        </h2>
        <p className="mt-2 text-ink-600">
          One post a week. No fluff, no affiliate-driven nonsense.
        </p>
        <div className="mt-4">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
