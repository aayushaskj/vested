"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalcShell,
  CalcCard,
  CalcResultPanel,
  CalcResultRow,
  NumberField,
} from "@/components/calc/CalcShell";
import { formatINR, formatUSD } from "@/lib/calc";
import { useFxRate } from "@/hooks/useFxRate";

export function SellToCoverSimulator() {
  const [grossShares, setGrossShares] = useState(50);
  const [stockUsd, setStockUsd] = useState(200);
  const [fxRate, setFxRate] = useState(84);
  const [fxTouched, setFxTouched] = useState(false);
  const [taxRatePct, setTaxRatePct] = useState(35.88);

  const { fx } = useFxRate();
  useEffect(() => {
    if (fx && !fxTouched) setFxRate(Number(fx.rate.toFixed(2)));
  }, [fx, fxTouched]);

  const r = useMemo(() => {
    const grossInr = grossShares * stockUsd * fxRate;
    const taxInr = (grossInr * taxRatePct) / 100;
    const sharesSold = Math.ceil(taxInr / (stockUsd * fxRate));
    const netShares = Math.max(0, grossShares - sharesSold);
    const netInrAtVest = netShares * stockUsd * fxRate;

    const scenarios = [
      { label: "Flat (0%)", priceMult: 1.0 },
      { label: "Up 20%", priceMult: 1.2 },
      { label: "Up 50%", priceMult: 1.5 },
      { label: "Down 20%", priceMult: 0.8 },
      { label: "Down 40%", priceMult: 0.6 },
    ].map((s) => ({
      ...s,
      newPrice: stockUsd * s.priceMult,
      valueInr: netShares * stockUsd * s.priceMult * fxRate,
      delta: netShares * stockUsd * s.priceMult * fxRate - netInrAtVest,
    }));

    return { grossInr, taxInr, sharesSold, netShares, netInrAtVest, scenarios };
  }, [grossShares, stockUsd, fxRate, taxRatePct]);

  return (
    <CalcShell
      inputs={
        <CalcCard title="The vest event">
          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Gross shares vesting"
              value={grossShares}
              setValue={setGrossShares}
              min={0}
              step={1}
            />
            <NumberField
              label="Stock price at vest (USD)"
              value={stockUsd}
              setValue={setStockUsd}
              min={0}
              step={1}
              prefix="$"
            />
            <NumberField
              label="USD/INR"
              value={fxRate}
              setValue={(v) => {
                setFxRate(v);
                setFxTouched(true);
              }}
              min={0}
              step={0.1}
              suffix="₹"
              hint={
                fx && !fxTouched ? `Live rate: ₹${fx.rate.toFixed(2)}` : undefined
              }
            />
            <NumberField
              label="Effective tax rate"
              value={taxRatePct}
              setValue={setTaxRatePct}
              step={1}
              suffix="%"
              hint="Slab + surcharge + cess"
            />
          </div>
        </CalcCard>
      }
      results={
        <CalcResultPanel
          label="Net shares after sell-to-cover"
          value={`${r.netShares} of ${grossShares}`}
          sub={`${formatINR(r.netInrAtVest)} at vest-day price`}
        >
          <CalcResultRow
            label="Gross vest value"
            value={formatINR(r.grossInr)}
          />
          <CalcResultRow
            label={`Tax @ ${taxRatePct}%`}
            value={`− ${formatINR(r.taxInr)}`}
          />
          <CalcResultRow
            label="Shares sold to cover tax"
            value={`${r.sharesSold} of ${grossShares}`}
          />
          <CalcResultRow divider />
          <div className="text-xs text-ink-300">Scenarios in 12 months</div>
          {r.scenarios.map((s) => (
            <CalcResultRow
              key={s.label}
              label={`${s.label} ($${s.newPrice.toFixed(0)})`}
              value={formatINR(s.valueInr)}
            />
          ))}
          <CalcResultRow divider />
          <div className="text-xs text-ink-300 leading-relaxed">
            Tax was paid at vest-day price. If the stock drops, you've already
            paid tax on the higher value with no refund.
          </div>
        </CalcResultPanel>
      }
    />
  );
}
