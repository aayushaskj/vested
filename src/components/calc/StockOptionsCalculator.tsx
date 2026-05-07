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

export function StockOptionsCalculator() {
  const [shares, setShares] = useState(1000);
  const [strikeUsd, setStrikeUsd] = useState(1);
  const [fmvUsd, setFmvUsd] = useState(20);
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
    const strikeUsdTotal = shares * strikeUsd;
    const strikeInr = strikeUsdTotal * fxRate;
    const fmvUsdTotal = shares * fmvUsd;
    const spreadUsd = Math.max(0, (fmvUsd - strikeUsd) * shares);
    const spreadInr = spreadUsd * fxRate;
    const tax = computeIndianTax(spreadInr, slab, surcharge, cessOn);
    const totalCashNeeded = strikeInr + tax.total;
    const netSharesValue = fmvUsdTotal * fxRate - tax.total;

    return {
      strikeUsdTotal,
      strikeInr,
      fmvUsdTotal,
      spreadUsd,
      spreadInr,
      tax,
      totalCashNeeded,
      netSharesValue,
    };
  }, [shares, strikeUsd, fmvUsd, fxRate, slab, surcharge, cessOn]);

  return (
    <CalcShell
      inputs={
        <div className="space-y-6">
          <CalcCard title="Your option grant">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Number of options to exercise"
                value={shares}
                setValue={setShares}
                min={0}
                step={100}
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
                label="Strike price per share (USD)"
                value={strikeUsd}
                setValue={setStrikeUsd}
                min={0}
                step={0.5}
                prefix="$"
              />
              <NumberField
                label="FMV at exercise (USD)"
                value={fmvUsd}
                setValue={setFmvUsd}
                min={0}
                step={0.5}
                prefix="$"
                hint="Current market price (or 409A FMV for private companies)"
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

          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Note:</strong> ISO/NSO distinction doesn't change Indian tax
            — both are taxed the same here. The cash you need at exercise is{" "}
            <strong>strike payment + Indian perquisite tax</strong>. If you
            can't cashless-exercise (private company, no liquid market), you
            need this in actual cash.
          </div>
        </div>
      }
      results={
        <CalcResultPanel
          label="Total cash needed to exercise"
          value={formatINR(r.totalCashNeeded)}
          sub={`On ${shares.toLocaleString()} options`}
        >
          <CalcResultRow
            label="FMV value at exercise"
            value={`${formatUSD(r.fmvUsdTotal)} = ${formatINR(
              r.fmvUsdTotal * fxRate
            )}`}
          />
          <CalcResultRow
            label="Strike payment (in cash)"
            value={`${formatUSD(r.strikeUsdTotal)} = ${formatINR(r.strikeInr)}`}
            bold
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="Spread (taxable as perquisite)"
            value={formatINR(r.spreadInr)}
          />
          <CalcResultRow
            label={`Indian tax @ ${r.tax.effectivePct.toFixed(1)}%`}
            value={`+ ${formatINR(r.tax.total)}`}
            bold
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="Total cash burn"
            value={formatINR(r.totalCashNeeded)}
            bold
          />
          <CalcResultRow
            label="Value of shares retained"
            value={formatINR(r.fmvUsdTotal * fxRate)}
          />
          <CalcResultRow
            label="Net wealth shift"
            value={formatINR(r.netSharesValue - r.strikeInr)}
          />
        </CalcResultPanel>
      }
    />
  );
}
