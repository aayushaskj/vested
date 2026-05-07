"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalcShell,
  CalcCard,
  CalcResultPanel,
  CalcResultRow,
  NumberField,
  DateField,
  SelectField,
  CheckboxField,
  SLAB_OPTIONS,
  SURCHARGE_OPTIONS,
} from "@/components/calc/CalcShell";
import { computeIndianTax, daysBetween, formatINR, formatUSD } from "@/lib/calc";
import { useFxRate } from "@/hooks/useFxRate";

export function UsCapGainsCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const twoYrsAgo = new Date();
  twoYrsAgo.setFullYear(twoYrsAgo.getFullYear() - 2);
  const defaultBuy = twoYrsAgo.toISOString().slice(0, 10);

  const [shares, setShares] = useState(50);
  const [buyDate, setBuyDate] = useState(defaultBuy);
  const [buyPriceUsd, setBuyPriceUsd] = useState(200);
  const [buyFx, setBuyFx] = useState(83);
  const [sellDate, setSellDate] = useState(today);
  const [sellPriceUsd, setSellPriceUsd] = useState(260);
  const [sellFx, setSellFx] = useState(84);
  const [sellFxTouched, setSellFxTouched] = useState(false);
  const [slab, setSlab] = useState(30);
  const [surcharge, setSurcharge] = useState(15);
  const [cessOn, setCessOn] = useState(true);

  const { fx } = useFxRate();
  useEffect(() => {
    if (fx && !sellFxTouched) setSellFx(Number(fx.rate.toFixed(2)));
  }, [fx, sellFxTouched]);

  const r = useMemo(() => {
    const costBasisInr = shares * buyPriceUsd * buyFx;
    const proceedsInr = shares * sellPriceUsd * sellFx;
    const gainInr = proceedsInr - costBasisInr;
    const days = Math.max(0, daysBetween(buyDate, sellDate));
    const isLtcg = days > 730; // 24 months ~ 730 days

    const tax = isLtcg
      ? // LTCG flat 12.5% + 4% cess (if cessOn)
        computeIndianTax(Math.max(0, gainInr), 12.5, 0, cessOn)
      : computeIndianTax(Math.max(0, gainInr), slab, surcharge, cessOn);

    const netInr = proceedsInr - Math.max(0, tax.total);
    return {
      costBasisInr,
      proceedsInr,
      gainInr,
      days,
      isLtcg,
      tax,
      netInr,
    };
  }, [
    shares,
    buyPriceUsd,
    buyFx,
    sellPriceUsd,
    sellFx,
    buyDate,
    sellDate,
    slab,
    surcharge,
    cessOn,
  ]);

  const months = (r.days / 30).toFixed(1);

  return (
    <CalcShell
      inputs={
        <div className="space-y-6">
          <CalcCard title="The position">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Number of shares sold"
                value={shares}
                setValue={setShares}
                min={0}
                step={1}
              />
              <DateField
                label="Buy / vest date"
                value={buyDate}
                setValue={setBuyDate}
                hint="Used to compute holding period"
              />
              <NumberField
                label="Buy price per share (USD)"
                value={buyPriceUsd}
                setValue={setBuyPriceUsd}
                min={0}
                step={0.5}
                prefix="$"
              />
              <NumberField
                label="USD/INR on buy date"
                value={buyFx}
                setValue={setBuyFx}
                min={0}
                step={0.1}
                suffix="₹"
              />
              <DateField
                label="Sell date"
                value={sellDate}
                setValue={setSellDate}
              />
              <NumberField
                label="Sell price per share (USD)"
                value={sellPriceUsd}
                setValue={setSellPriceUsd}
                min={0}
                step={0.5}
                prefix="$"
              />
              <NumberField
                label="USD/INR on sell date"
                value={sellFx}
                setValue={(v) => {
                  setSellFx(v);
                  setSellFxTouched(true);
                }}
                min={0}
                step={0.1}
                suffix="₹"
                hint={
                  fx && !sellFxTouched
                    ? `Live rate: ₹${fx.rate.toFixed(2)} (${fx.date})`
                    : undefined
                }
              />
            </div>
          </CalcCard>

          <CalcCard title="Indian tax assumptions (used for STCG only)">
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
            <label className="mt-4 inline-flex items-center gap-2 text-sm text-ink-700">
              <CheckboxField
                label="Apply 4% Health & Education cess"
                checked={cessOn}
                setChecked={setCessOn}
              />
            </label>
          </CalcCard>
        </div>
      }
      results={
        <CalcResultPanel
          label="Indian tax on sale"
          value={formatINR(r.tax.total)}
          sub={r.isLtcg ? "Long-term @ 12.5%" : "Short-term @ slab rate"}
        >
          <CalcResultRow
            label="Holding period"
            value={`${months} months`}
          />
          <CalcResultRow
            label="Classification"
            value={r.isLtcg ? "LTCG (>24 months)" : "STCG (≤24 months)"}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="Cost basis (INR)"
            value={formatINR(r.costBasisInr)}
          />
          <CalcResultRow
            label="Proceeds (INR)"
            value={formatINR(r.proceedsInr)}
          />
          <CalcResultRow
            label="Capital gain"
            value={formatINR(r.gainInr)}
            bold
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="Tax"
            value={`− ${formatINR(r.tax.total)}`}
          />
          <CalcResultRow
            label="Effective rate"
            value={`${r.tax.effectivePct.toFixed(1)}%`}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="Net INR after tax"
            value={formatINR(r.netInr)}
            bold
          />
          <CalcResultRow
            label="Proceeds in USD"
            value={formatUSD(r.proceedsInr / sellFx)}
          />
        </CalcResultPanel>
      }
    />
  );
}
