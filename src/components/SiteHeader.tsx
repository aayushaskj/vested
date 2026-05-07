"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/category/us-investing", label: "US Investing" },
  { href: "/category/rsu-management", label: "RSUs" },
  { href: "/tools/rsu-calculator", label: "Calculator" },
  { href: "/blog", label: "Archive" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-ink-100 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="container-wide flex h-14 items-center justify-between sm:h-16">
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
          <span
            aria-hidden
            className="hidden sm:inline-block h-4 w-px bg-ink-200 mx-1"
          />
          <span className="hidden sm:inline-block text-sm text-ink-500 font-medium">
            US investing for Indians
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-1 lg:gap-2"
        >
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
          <Link
            href="/search"
            className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-500 hover:border-ink-300 hover:text-ink-700"
            aria-label="Search posts"
          >
            <SearchIcon className="h-4 w-4" />
            <span>Search</span>
          </Link>
        </nav>

        {/* Mobile: search + hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          <Link
            href="/search"
            aria-label="Search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-700 hover:bg-ink-50 active:bg-ink-100"
          >
            <SearchIcon className="h-5 w-5" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-700 hover:bg-ink-50 active:bg-ink-100"
          >
            {open ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            aria-hidden
            className="fixed inset-0 top-14 z-20 bg-ink-900/30 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
          <nav
            id="mobile-nav"
            aria-label="Mobile primary"
            className="fixed inset-x-0 top-14 z-30 border-b border-ink-100 bg-white shadow-lg md:hidden"
          >
            <ul className="container-wide flex flex-col py-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-3 text-base font-medium text-ink-800 hover:bg-ink-50 active:bg-ink-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="border-t border-ink-100 mt-2 pt-2">
                <Link
                  href="/search"
                  className="flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium text-ink-800 hover:bg-ink-50"
                >
                  <SearchIcon className="h-4 w-4" />
                  Search
                </Link>
              </li>
            </ul>
          </nav>
        </>
      )}
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

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M6 6l12 12M6 18L18 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 3.359 9.84l3.4 3.4a.75.75 0 1 0 1.061-1.06l-3.4-3.4A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
