"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "vested:newsletter-popup-dismissed-at";
const SUBSCRIBED_KEY = "vested:newsletter-subscribed";
const COOL_OFF_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const TIME_TRIGGER_MS = 2 * 60 * 1000; // 2 minutes
const SCROLL_TRIGGER_PCT = 75;

/**
 * Bottom-right toast newsletter popup. Triggers on either:
 *   - 75% scroll down the current page, OR
 *   - 2 minutes spent on the current page
 * whichever fires first. Once dismissed (or signed up), it won't re-show
 * for 7 days. Stored in localStorage.
 *
 * Renders nothing server-side and during the cool-off window.
 */
export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "already" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already subscribed? never show.
    if (window.localStorage.getItem(SUBSCRIBED_KEY)) return;

    // Within cool-off window? don't show.
    const dismissedAtRaw = window.localStorage.getItem(DISMISS_KEY);
    if (dismissedAtRaw) {
      const dismissedAt = Number(dismissedAtRaw);
      if (
        !Number.isNaN(dismissedAt) &&
        Date.now() - dismissedAt < COOL_OFF_MS
      ) {
        return;
      }
    }

    let triggered = false;

    function trigger() {
      if (triggered) return;
      triggered = true;
      setOpen(true);
    }

    // Time trigger
    const timer = window.setTimeout(trigger, TIME_TRIGGER_MS);

    // Scroll trigger
    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = (scrollTop / docHeight) * 100;
      if (pct >= SCROLL_TRIGGER_PCT) trigger();
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function dismiss() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
    setOpen(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/.+@.+\..+/.test(trimmed)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source: "popup" }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        alreadySubscribed?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(
          data.error === "invalid_email"
            ? "That email looks invalid."
            : "Try again in a moment."
        );
        return;
      }
      // Mark subscribed so we don't show again
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SUBSCRIBED_KEY, String(Date.now()));
      }
      setStatus(data.alreadySubscribed ? "already" : "success");
      setEmail("");
      // Auto-dismiss after a beat
      window.setTimeout(() => setOpen(false), 2200);
    } catch {
      setStatus("error");
      setErrorMsg("Network hiccup. Try again.");
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="newsletter-popup-title"
      aria-describedby="newsletter-popup-desc"
      className="fixed inset-x-3 bottom-3 z-40 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:max-w-sm motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-300"
    >
      <div className="relative rounded-2xl border border-ink-200 bg-white p-5 shadow-xl shadow-ink-900/10">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-400 hover:bg-ink-100 hover:text-ink-700"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            aria-hidden
          >
            <path
              d="M6 6l12 12M6 18L18 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-accent-700">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-accent-500"
          />
          One email a week
        </div>
        <h3
          id="newsletter-popup-title"
          className="mt-2 font-display text-lg font-semibold leading-tight text-ink-900"
        >
          Don't miss the next one
        </h3>
        <p
          id="newsletter-popup-desc"
          className="mt-1 text-sm text-ink-600 leading-relaxed"
        >
          One practical post a week on US investing & RSU strategy for Indian
          residents. No fluff, no spam.
        </p>

        {status === "success" || status === "already" ? (
          <div className="mt-4 rounded-lg bg-accent-50 p-3 text-sm text-accent-800">
            {status === "success"
              ? "Thanks — you're on the list."
              : "You're already subscribed. Thanks!"}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2">
            <input
              type="email"
              required
              value={email}
              disabled={status === "loading"}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-800 disabled:opacity-60"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
            {status === "error" && (
              <p className="text-xs text-red-600">{errorMsg}</p>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="text-xs text-ink-500 hover:text-ink-700"
            >
              No thanks
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
