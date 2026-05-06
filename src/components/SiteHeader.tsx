import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-ink-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2 text-ink-900"
          aria-label="Vested home"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 text-white font-display font-bold">
            V
          </span>
          <span className="text-lg font-display font-semibold tracking-tight">
            Vested
          </span>
          <span className="hidden sm:inline-block text-sm text-ink-400 font-medium">
            .blog
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          <NavLink href="/category/us-investing">US Investing</NavLink>
          <NavLink href="/category/rsu-management">RSUs</NavLink>
          <NavLink href="/tools/rsu-calculator">Calculator</NavLink>
          <NavLink href="/blog">Archive</NavLink>
          <NavLink href="/about">About</NavLink>
          <Link
            href="/search"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-500 hover:border-ink-300 hover:text-ink-700"
            aria-label="Search posts"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 3.359 9.84l3.4 3.4a.75.75 0 1 0 1.061-1.06l-3.4-3.4A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
                clipRule="evenodd"
              />
            </svg>
            <span>Search</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-2.5 py-1.5 text-sm font-medium text-ink-600 hover:bg-ink-50 hover:text-ink-900"
    >
      {children}
    </Link>
  );
}
