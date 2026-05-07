import Link from "next/link";
import { FxTicker } from "@/components/FxTicker";
import { CALCULATORS } from "@/lib/calculators";

export function SiteFooter() {
  // Group calculators by category for the mega-footer
  const calcGroups: Array<{
    key: "rsu" | "tax" | "investing" | "planning";
    label: string;
  }> = [
    { key: "rsu", label: "RSU & equity comp" },
    { key: "tax", label: "Tax" },
    { key: "investing", label: "Investing" },
    { key: "planning", label: "Planning" },
  ];

  return (
    <footer className="mt-20 border-t border-ink-100 bg-ink-50/50">
      {/* All calculators */}
      <div className="container-wide py-10 sm:py-12">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-base font-semibold text-ink-900 sm:text-lg">
            All calculators
          </h3>
          <Link
            href="/tools"
            className="text-xs font-medium text-ink-600 hover:text-ink-900"
          >
            View all →
          </Link>
        </div>
        <div className="mt-5 grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {calcGroups.map((g) => {
            const items = CALCULATORS.filter((c) => c.category === g.key);
            if (items.length === 0) return null;
            return (
              <div key={g.key}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-700">
                  {g.label}
                </h4>
                <ul className="mt-3 space-y-2">
                  {items.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={c.href}
                        className="text-sm text-ink-500 hover:text-ink-900"
                      >
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand + nav + disclaimer */}
      <div className="border-t border-ink-100 bg-ink-100/40">
        <div className="container-wide py-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-brand-600 to-accent-500 text-white text-sm font-display font-bold">
                  V
                </span>
                <span className="font-display font-semibold tracking-tight">
                  Vested
                </span>
              </div>
              <p className="mt-3 text-sm text-ink-500 max-w-xs">
                US investing & RSU management, written for Indian residents
                by{" "}
                <a
                  href="https://rovia.one"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-700 underline decoration-ink-300 underline-offset-2 hover:decoration-ink-500"
                >
                  Rovia
                </a>
                .
              </p>
            </div>
            <FooterCol
              title="Topics"
              links={[
                { href: "/category/us-investing", label: "US Investing" },
                { href: "/category/rsu-management", label: "RSU Management" },
                { href: "/tools", label: "Calculators" },
                { href: "/tags", label: "All tags" },
              ]}
            />
            <FooterCol
              title="Site"
              links={[
                { href: "/about", label: "About" },
                { href: "/authors", label: "Authors" },
                { href: "/blog", label: "All posts" },
                { href: "/search", label: "Search" },
                { href: "/feed.xml", label: "RSS feed" },
              ]}
            />
            <div>
              <h3 className="text-sm font-semibold text-ink-900">
                Disclaimer
              </h3>
              <p className="mt-3 text-xs text-ink-500 leading-relaxed">
                Vested.blog publishes general educational content. It is not
                investment, tax, or legal advice. Consult a SEBI-registered
                advisor and a qualified CA for decisions specific to you.
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-ink-500">
              © {new Date().getFullYear()} Vested. All rights reserved.
            </p>
            <FxTicker />
            <p className="text-xs text-ink-500">Built with Next.js</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-ink-500 hover:text-ink-900"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
