"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalcShell,
  CalcCard,
  CalcResultPanel,
  CalcResultRow,
  NumberField,
  SelectField,
  CheckboxField,
  SLAB_OPTIONS,
  SURCHARGE_OPTIONS,
} from "@/components/calc/CalcShell";
import { computeIndianTax, formatINR, formatUSD } from "@/lib/calc";
import { useFxRate } from "@/hooks/useFxRate";

export function EsppRoiCalculator() {
  const [contributionInr, setContributionInr] = useState(1_20_000);
  const [startPriceUsd, setStartPriceUsd] = useState(100);
  const [endPriceUsd, setEndPriceUsd] = useState(130);
  const [discountPct, setDiscountPct] = useState(15);
  const [hasLookback, setHasLookback] = useState(true);
  const [fxRate, setFxRate] = useState(84);
  const [fxTouched, setFxTouched] = useState(false);
  const [slab, setSlab] = useState(30);
  const [surcharge, setSurcharge] = useState(15);
  const [cessOn, setCessOn] = useState(true);

  const { fx } = useFxRate();
  useEffect(() => {
    if (fx && !fxTouched) setFxRate(Number(fx.rate.toFixed(2)));
  }, [fx, fxTouched]);

  const r = useMemo(() => {
    const contributionUsd = contributionInr / fxRate;
    const referencePrice = hasLookback
      ? Math.min(startPriceUsd, endPriceUsd)
      : endPriceUsd;
    const purchasePrice = referencePrice * (1 - discountPct / 100);
    const sharesBought = contributionUsd / purchasePrice;
    const fmvAtPurchaseUsd = endPriceUsd;
    const marketValueUsd = sharesBought * fmvAtPurchaseUsd;
    const marketValueInr = marketValueUsd * fxRate;
    const discountUsd = sharesBought * (fmvAtPurchaseUsd - purchasePrice);
    const perquisiteInr = discountUsd * fxRate;
    const tax = computeIndianTax(perquisiteInr, slab, surcharge, cessOn);
    const netIfQuickSell = marketValueInr - tax.total;
    const profit = netIfQuickSell - contributionInr;
    const returnPct =
      contributionInr > 0 ? (profit / contributionInr) * 100 : 0;

    return {
      contributionUsd,
      referencePrice,
      purchasePrice,
      sharesBought,
      marketValueUsd,
      marketValueInr,
      discountUsd,
      perquisiteInr,
      tax,
      netIfQuickSell,
      profit,
      returnPct,
    };
  }, [
    contributionInr,
    startPriceUsd,
    endPriceUsd,
    discountPct,
    hasLookback,
    fxRate,
    slab,
    surcharge,
    cessOn,
  ]);

  return (
    <CalcShell
      inputs={
        <div className="space-y-6">
          <CalcCard title="ESPP plan">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Total contribution this period (INR)"
                value={contributionInr}
                setValue={setContributionInr}
                min={0}
                step={10000}
                suffix="₹"
                hint="Salary deductions over the 6-month offering period."
              />
              <NumberField
                label="USD/INR rate"
                value={fxRate}
                setValue={(v) => {
                  setFxRate(v);
                  setFxTouched(true);
                }}
                min={0}
                step={0.1}
                suffix="₹"
                hint={
                  fx && !fxTouched ? `Live ECB rate: ₹${fx.rate.toFixed(2)}` : undefined
                }
              />
              <NumberField
                label="Stock price at offering start (USD)"
                value={startPriceUsd}
                setValue={setStartPriceUsd}
                min={0}
                step={1}
                prefix="$"
              />
              <NumberField
                label="Stock price at purchase (USD)"
                value={endPriceUsd}
                setValue={setEndPriceUsd}
                min={0}
                step={1}
                prefix="$"
              />
              <SelectField
                label="Discount"
                value={discountPct}
                setValue={setDiscountPct}
                options={[
                  { v: 5, l: "5%" },
                  { v: 10, l: "10%" },
                  { v: 15, l: "15% (most common)" },
                ]}
              />
            </div>
            <div className="mt-4">
              <CheckboxField
                label="Plan has lookback (discount applies to lower of start/end price)"
                checked={hasLookback}
                setChecked={setHasLookback}
              />
            </div>
          </CalcCard>

          <CalcCard title="Indian tax assumptions">
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Marginal slab"
                value={slab}
                setValue={setSlab}
                options={SLAB_OPTIONS}
              />
              <SelectField
                label="Surcharge"
                value={surcharge}
                setValue={setSurcharge}
                options={SURCHARGE_OPTIONS}
              />
            </div>
            <div className="mt-4">
              <CheckboxField
                label="Apply 4% Health & Education cess"
                checked={cessOn}
                setChecked={setCessOn}
              />
            </div>
          </CalcCard>
        </div>
      }
      results={
        <CalcResultPanel
          label="Quick-sell return on ESPP"
          value={`${r.returnPct.toFixed(1)}%`}
          sub={`Net profit: ${formatINR(r.profit)}`}
        >
          <CalcResultRow
            label="Contribution"
            value={`${formatINR(contributionInr)} (${formatUSD(r.contributionUsd)})`}
          />
          <CalcResultRow
            label="Reference price"
            value={`$${r.referencePrice.toFixed(2)} ${hasLookback ? "(lookback)" : ""}`}
          />
          <CalcResultRow
            label="Purchase price"
            value={`$${r.purchasePrice.toFixed(2)}`}
          />
          <CalcResultRow
            label="Shares bought"
            value={r.sharesBought.toFixed(2)}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="Market value at purchase"
            value={formatINR(r.marketValueInr)}
          />
          <CalcResultRow
            label="Discount (perquisite)"
            value={formatINR(r.perquisiteInr)}
          />
          <CalcResultRow
            label={`Indian tax @ ${r.tax.effectivePct.toFixed(1)}%`}
            value={`− ${formatINR(r.tax.total)}`}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="Net cash if sold immediately"
            value={formatINR(r.netIfQuickSell)}
            bold
          />
        </CalcResultPanel>
      }
    />
  );
}
