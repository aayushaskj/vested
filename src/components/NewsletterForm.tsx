"use client";

import { useState } from "react";

export function NewsletterForm({
  compact = false,
  source = "newsletter-form",
}: {
  compact?: boolean;
  /** Tracking identifier — where on the site this signup came from. */
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "already" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/.+@.+\..+/.test(trimmed)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source }),
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
            ? "That email address looks invalid."
            : "Something went wrong. Try again in a moment."
        );
        return;
      }
      setStatus(data.alreadySubscribed ? "already" : "success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Try again in a moment.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-3 sm:flex-row ${compact ? "" : "sm:items-center"}`}
      aria-label="Subscribe to newsletter"
    >
      <label htmlFor={`newsletter-email-${source}`} className="sr-only">
        Email address
      </label>
      <input
        id={`newsletter-email-${source}`}
        type="email"
        required
        value={email}
        disabled={status === "loading"}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status !== "idle" && status !== "loading") setStatus("idle");
        }}
        placeholder="you@example.com"
        className="flex-1 rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-800 focus:outline-none focus:ring-2 focus:ring-ink-300 disabled:opacity-60"
      >
        {status === "loading" ? "…" : "Subscribe"}
      </button>
      {status === "success" && (
        <p className="text-sm text-accent-700 sm:ml-2" role="status">
          Thanks — you're on the list.
        </p>
      )}
      {status === "already" && (
        <p className="text-sm text-ink-500 sm:ml-2" role="status">
          You're already subscribed — thanks!
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 sm:ml-2" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
