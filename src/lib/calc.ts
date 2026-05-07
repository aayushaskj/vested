/**
 * Shared math + formatting utilities used across all calculators.
 */

export const formatINR = (n: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

export const formatINRPrecise = (n: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);

export const formatUSD = (n: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

export const formatPercent = (n: number, digits = 1): string =>
  `${(Number.isFinite(n) ? n : 0).toFixed(digits)}%`;

export const formatNumber = (n: number, digits = 0): string =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: digits,
  }).format(Number.isFinite(n) ? n : 0);

/**
 * Indian slab + surcharge + cess effective rate (FY 2026-27, Old Regime baseline).
 * Used as the "marginal effective rate" in many tax calculators.
 *
 * Surcharge thresholds (taxable income):
 *  - up to ₹50L: 0%
 *  - ₹50L–₹1Cr: 10%
 *  - ₹1Cr–₹2Cr: 15%
 *  - ₹2Cr–₹5Cr: 25%
 *  - > ₹5Cr: 37%
 * Cess: 4% on (tax + surcharge).
 */
export function effectiveRate(
  slabPct: number,
  surchargePct: number,
  cessOn = true
): number {
  const base = slabPct;
  const sur = (base * surchargePct) / 100;
  const beforeCess = base + sur;
  const cess = cessOn ? beforeCess * 0.04 : 0;
  return beforeCess + cess;
}

export interface IndianSlabBreakdown {
  base: number;
  surcharge: number;
  cess: number;
  total: number;
  effectivePct: number;
}

export function computeIndianTax(
  taxableINR: number,
  slabPct: number,
  surchargePct: number,
  cessOn = true
): IndianSlabBreakdown {
  const base = (taxableINR * slabPct) / 100;
  const surcharge = (base * surchargePct) / 100;
  const beforeCess = base + surcharge;
  const cess = cessOn ? beforeCess * 0.04 : 0;
  const total = beforeCess + cess;
  return {
    base,
    surcharge,
    cess,
    total,
    effectivePct: taxableINR > 0 ? (total / taxableINR) * 100 : 0,
  };
}

/** Auto-detect surcharge tier from total annual income. */
export function detectSurcharge(annualIncomeINR: number): number {
  if (annualIncomeINR > 5_00_00_000) return 37;
  if (annualIncomeINR > 2_00_00_000) return 25;
  if (annualIncomeINR > 1_00_00_000) return 15;
  if (annualIncomeINR > 50_00_000) return 10;
  return 0;
}

/** Days between two ISO date strings. */
export function daysBetween(fromIso: string, toIso: string): number {
  const a = new Date(fromIso).getTime();
  const b = new Date(toIso).getTime();
  return Math.floor((b - a) / (1000 * 60 * 60 * 24));
}
