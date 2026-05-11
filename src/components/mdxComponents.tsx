import Link from "next/link";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { EmployerCallout } from "@/components/EmployerCallout";
import { isAffiliateUrl } from "@/lib/platformLinks";

export const mdxComponents: MDXRemoteProps["components"] = {
  EmployerCallout,
  a: ({ href = "#", children, ...rest }) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link href={href} {...(rest as any)}>
          {children}
        </Link>
      );
    }
    // Affiliate / referral links get rel="sponsored" per Google's recommended
    // attribute for affiliate links. Auto-detected from the lib registry so
    // every linked occurrence gets the right rel without per-link config.
    const rel = isAffiliateUrl(href)
      ? "sponsored noopener noreferrer"
      : "noopener noreferrer";
    return (
      <a href={href} target="_blank" rel={rel} {...rest}>
        {children}
      </a>
    );
  },
  Callout: ({
    type = "note",
    children,
  }: {
    type?: "note" | "warning" | "tip";
    children: React.ReactNode;
  }) => {
    const styles = {
      note: "border-brand-200 bg-brand-50 text-brand-900",
      warning: "border-amber-200 bg-amber-50 text-amber-900",
      tip: "border-accent-200 bg-accent-50 text-accent-900",
    } as const;
    return (
      <aside
        className={`not-prose my-6 rounded-xl border px-5 py-4 text-[0.95rem] leading-relaxed ${styles[type]}`}
      >
        {children}
      </aside>
    );
  },
};
