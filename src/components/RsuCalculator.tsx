"use client";

import { useMemo, useState } from "react";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export function RsuCalculator() {
  const [shares, setShares] = useState(100);
  const [pricePerShare, setPricePerShare] = useState(150);
  const [fxRate, setFxRate] = useState(83.5);
  const [marginalSlab, setMarginalSlab] = useState(30);
  const [surcharge, setSurcharge] = useState(15);
  const [cessOn, setCessOn] = useState(true);

  const result = useMemo(() => {
    const grossUSD = shares * pricePerShare;
    const grossINR = grossUSD * fxRate;

    // Perquisite tax: vested RSU value treated as salary income at marginal slab.
    const baseTax = (grossINR * marginalSlab) / 100;
    const surchargeAmt = (baseTax * surcharge) / 100;
    const beforeCess = baseTax + surchargeAmt;
    const cess = cessOn ? beforeCess * 0.04 : 0;
    const totalTax = beforeCess + cess;

    const netINR = grossINR - totalTax;
    const effectiveRate = grossINR > 0 ? (totalTax / grossINR) * 100 : 0;

    return {
      grossUSD,
      grossINR,
      baseTax,
      surchargeAmt,
      cess,
      totalTax,
      netINR,
      effectiveRate,
    };
  }, [shares, pricePerShare, fxRate, marginalSlab, surcharge, cessOn]);

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Inputs */}
      <div className="lg:col-span-3">
        <div className="rounded-2xl border border-ink-100 bg-white p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold text-ink-900">
            Your RSU tranche
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Shares vesting"
              value={shares}
              setValue={setShares}
              min={0}
              step={1}
            />
            <NumberField
              label="Price per share (USD)"
              value={pricePerShare}
              setValue={setPricePerShare}
              min={0}
              step={0.5}
              prefix="$"
            />
            <NumberField
              label="USD → INR rate"
              value={fxRate}
              setValue={setFxRate}
              min={0}
              step={0.1}
              suffix="₹"
            />
          </div>

          <h3 className="mt-8 font-display text-lg font-semibold text-ink-900">
            Indian tax assumptions
          </h3>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Marginal slab"
              value={marginalSlab}
              setValue={setMarginalSlab}
              options={[
                { v: 5, l: "5%" },
                { v: 10, l: "10%" },
                { v: 15, l: "15%" },
                { v: 20, l: "20%" },
                { v: 30, l: "30%" },
              ]}
            />
            <SelectField
              label="Surcharge"
              value={surcharge}
              setValue={setSurcharge}
              options={[
                { v: 0, l: "0% (income < ₹50L)" },
                { v: 10, l: "10% (₹50L–₹1Cr)" },
                { v: 15, l: "15% (₹1Cr–₹2Cr)" },
                { v: 25, l: "25% (₹2Cr–₹5Cr)" },
                { v: 37, l: "37% (> ₹5Cr, old regime)" },
              ]}
            />
          </div>

          <label className="mt-5 flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={cessOn}
              onChange={(e) => setCessOn(e.target.checked)}
              className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            Apply 4% Health & Education cess
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm text-amber-900">
          <strong>Note:</strong> This tool ignores US federal withholding
          (typically 22% sell-to-cover at vest), foreign tax credit (Form 67),
          schedule FA disclosure, and post-vest capital gains. Those are
          covered in the RSU guide series — this number is just the perquisite
          tax on the vest event.
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 p-6 text-white sm:p-8">
          <p className="text-xs uppercase tracking-wider text-ink-300">
            Estimated take-home
          </p>
          <p className="mt-2 font-display text-4xl font-semibold tracking-tight">
            {formatINR(result.netINR)}
          </p>
          <p className="mt-1 text-sm text-ink-300">
            after Indian perquisite tax
          </p>

          <div className="mt-8 space-y-3 text-sm">
            <Row label="Gross (USD)" value={formatUSD(result.grossUSD)} />
            <Row label="Gross (INR)" value={formatINR(result.grossINR)} />
            <Divider />
            <Row label={`Base tax @ ${marginalSlab}%`} value={`− ${formatINR(result.baseTax)}`} />
            {surcharge > 0 && (
              <Row
                label={`Surcharge @ ${surcharge}%`}
                value={`− ${formatINR(result.surchargeAmt)}`}
              />
            )}
            {cessOn && <Row label="Cess @ 4%" value={`− ${formatINR(result.cess)}`} />}
            <Divider />
            <Row label="Total tax" value={`− ${formatINR(result.totalTax)}`} bold />
            <Row
              label="Effective rate"
              value={`${result.effectiveRate.toFixed(1)}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  setValue,
  min,
  step,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-800">{label}</span>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-ink-400">
            {prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : 0}
          min={min}
          step={step}
          onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
          className={`w-full rounded-lg border border-ink-200 bg-white py-2.5 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-7" : "pr-3"}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-ink-400">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function SelectField({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  options: { v: number; l: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-800">{label}</span>
      <select
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-ink-300">{label}</span>
      <span
        className={
          bold ? "font-display font-semibold text-white" : "text-white"
        }
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-white/10" />;
}
