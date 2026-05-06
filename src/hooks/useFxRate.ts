"use client";

import { useEffect, useState } from "react";

export interface FxRate {
  rate: number;
  date: string; // ISO yyyy-mm-dd as reported by Frankfurter
  source: "frankfurter" | "fallback";
}

const STORAGE_KEY = "vested:usdinr";
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const FALLBACK_RATE = 84;

interface CachedFxRate {
  rate: number;
  date: string;
  cachedAt: number;
}

function readCache(): CachedFxRate | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedFxRate;
    if (Date.now() - parsed.cachedAt > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(rate: number, date: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ rate, date, cachedAt: Date.now() } satisfies CachedFxRate)
    );
  } catch {
    // ignore quota errors
  }
}

/**
 * Returns the latest USD→INR rate from Frankfurter (ECB reference rate).
 * - Cached in sessionStorage for 6 hours.
 * - Falls back to a hardcoded value if the API is unreachable.
 * - Returns { loading: true } on initial render to allow skeleton state.
 */
export function useFxRate(): {
  fx: FxRate | null;
  loading: boolean;
  error: string | null;
} {
  const [fx, setFx] = useState<FxRate | null>(() => {
    const cached = readCache();
    if (cached) {
      return { rate: cached.rate, date: cached.date, source: "frankfurter" };
    }
    return null;
  });
  const [loading, setLoading] = useState(fx === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setFx({ rate: cached.rate, date: cached.date, source: "frankfurter" });
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(
          "https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR",
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as {
          amount: number;
          base: string;
          date: string;
          rates: { INR?: number };
        };
        if (!data?.rates?.INR) throw new Error("Missing INR rate");
        const rate = data.rates.INR;
        if (!cancelled) {
          writeCache(rate, data.date);
          setFx({ rate, date: data.date, source: "frankfurter" });
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "fetch failed");
          setFx({
            rate: FALLBACK_RATE,
            date: new Date().toISOString().slice(0, 10),
            source: "fallback",
          });
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { fx, loading, error };
}

/** Format an INR exchange rate for display, e.g. 84.32 → "₹84.32". */
export function formatFxRate(rate: number): string {
  return `₹${rate.toFixed(2)}`;
}

/** Format a Frankfurter date (yyyy-mm-dd) as a short, human-readable label. */
export function formatFxDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
