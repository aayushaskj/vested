import Link from "next/link";
import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "About Vested",
  description:
    "Vested is the editorial publication of Rovia, a global investment platform for global citizens. We write about US investing, RSU management, and Indian tax for residents.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Vested",
    description:
      "Vested is the editorial publication of Rovia, a global investment platform for global citizens.",
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
        <h2>Who&rsquo;s behind Vested</h2>
        <p>
          Vested is the editorial publication of{" "}
          <a
            href="https://rovia.onelink.me/xOtI/c29h3ped"
            target="_blank"
            rel="sponsored noopener noreferrer"
          >
            Rovia
          </a>
          . Rovia is a global investment platform we&rsquo;re building for
          global citizens. The premise is simple: if you live in the UK, UAE,
          India, or Singapore and earn US equity through your employer, you are
          already globally diversified. But brokerage rules, jurisdictional
          restrictions, and local compliance often stop you from investing the
          way a local does. Rovia exists to remove that friction. Live anywhere,
          invest where you feel like.
        </p>
        <p>
          Vested is written by{" "}
          <Link href="/authors/shivang-badaya">Shivang Badaya</Link> and{" "}
          <Link href="/authors/arnav-grover">Arnav Grover</Link>, the
          co-founders of Rovia. We write about what we work on every day &mdash;
          cross-border investing, RSU mechanics, Indian tax compliance, and the
          gaps between &ldquo;what the platform shows you&rdquo; and &ldquo;what
          actually happens at filing time.&rdquo;
        </p>

        <h2>Why this exists</h2>
        <p>
          If you live in India and earn (or hold) US assets &mdash; RSUs from a
          multinational employer, ETFs bought via the LRS, ESPP shares &mdash;
          most of the content out there is written for an American reader. It
          glosses over the parts that actually matter for you: 20% TCS on
          remittances, 25% US dividend withholding, capital gains classified as
          unlisted foreign equity, Form 67 for foreign tax credit, Schedule FA
          disclosures, and so on.
        </p>
        <p>
          Vested is the publication we wished existed when we first started
          investing across borders. Every post is written from one assumption:
          you are an Indian resident, and the rules you operate under are
          Indian.
        </p>

        <h2>What you&rsquo;ll find here</h2>
        <ul>
          <li>
            <strong>US investing</strong> &mdash; LRS basics, brokerage
            comparisons, ETF picks, capital gains taxation in INR, currency
            risk, and rebalancing across rupee and dollar portfolios.
          </li>
          <li>
            <strong>RSU management</strong> &mdash; vesting mechanics, the
            sell-to-cover trap, US-India tax treaty relief, when to hold vs.
            sell, share transfer between brokers, and how to redeploy proceeds.
          </li>
          <li>
            <strong>Calculators</strong> &mdash; small interactive tools so you
            can run the numbers on your own situation, not someone else&rsquo;s.
            All free, all built around Indian rules.
          </li>
        </ul>

        <h2>Editorial independence</h2>
        <p>
          Rovia funds Vested, but Vested doesn&rsquo;t exist to sell Rovia. The
          posts you read here are written to be useful even if you never become
          a Rovia customer. Where Rovia is genuinely the relevant answer to
          something we&rsquo;re explaining (for example, when discussing how to
          actually move shares out of a US-employer broker), we&rsquo;ll say so
          plainly. Otherwise, we cover the ecosystem &mdash; INDmoney, the
          original Vested platform, IBKR, employer-default brokers like Fidelity
          and Morgan Stanley &mdash; the way a publication should: on merits.
        </p>
        <p>
          Rovia has a referral program for early users who help bring other RSU
          holders onto the platform. The details are intentionally not on this
          page; if you&rsquo;re curious, the Rovia team can walk you through it
          directly.
        </p>

        <h2>A note on platform links</h2>
        <p>
          When we link to platforms (Vested, INDmoney, IBKR, Rovia), some of
          those links may be referral or affiliate links. We may earn a small
          credit if you sign up through them. Linked or not, our coverage of
          each platform is based on what the product actually does &mdash; the
          comparisons would read the same with non-affiliate links, which is
          the test we hold ourselves to.
        </p>

        <h2>What this is not</h2>
        <p>
          This is not investment, tax, or legal advice. We write what
          we&rsquo;ve learned and what we&rsquo;ve verified against primary
          sources (RBI master directions, the Income Tax Act, IRS publications).
          For decisions specific to you, please talk to a SEBI-registered
          investment advisor and a qualified CA.
        </p>

        <h2>Contact</h2>
        <p>
          Got a topic you want covered, or a correction? Reach out via the{" "}
          <Link href="/">homepage</Link>, the{" "}
          <Link href="/authors">authors page</Link>, or reply to the newsletter.
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
