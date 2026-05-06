"use client";

import { useFxRate, formatFxRate, formatFxDate } from "@/hooks/useFxRate";

export function FxTicker() {
  const { fx, loading } = useFxRate();

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-ink-500">
        <span className="h-1.5 w-1.5 rounded-full bg-ink-300" />
        <span>Loading USD→INR…</span>
      </span>
    );
  }

  if (!fx) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs text-ink-500"
      title={
        fx.source === "fallback"
          ? "Could not fetch live rate; showing approximate value."
          : `ECB reference rate (Frankfurter), ${formatFxDate(fx.date)}`
      }
      aria-label={`USD to INR rate: ${formatFxRate(fx.rate)}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          fx.source === "fallback" ? "bg-ink-300" : "bg-accent-500"
        }`}
        aria-hidden
      />
      <span>
        USD→INR <span className="font-medium text-ink-700 tabular-nums">{formatFxRate(fx.rate)}</span>
      </span>
      <span className="hidden sm:inline">· as of {formatFxDate(fx.date)}</span>
    </span>
  );
}
