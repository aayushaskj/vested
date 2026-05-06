"use client";

import { useState } from "react";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/.+@.+\..+/.test(email)) {
      setStatus("error");
      return;
    }
    // Wire up to ConvertKit / Substack / Mailchimp later.
    // For now, store in-memory and show success state.
    setStatus("success");
    setEmail("");
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-3 sm:flex-row ${compact ? "" : "sm:items-center"}`}
      aria-label="Subscribe to newsletter"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status !== "idle") setStatus("idle");
        }}
        placeholder="you@example.com"
        className="flex-1 rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-800 focus:outline-none focus:ring-2 focus:ring-ink-300"
      >
        Subscribe
      </button>
      {status === "success" && (
        <p className="text-sm text-accent-700 sm:ml-2" role="status">
          Thanks — check your inbox.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 sm:ml-2" role="alert">
          Please enter a valid email.
        </p>
      )}
    </form>
  );
}
