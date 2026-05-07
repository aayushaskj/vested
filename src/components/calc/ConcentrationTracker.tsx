"use client";

import { useMemo, useState } from "react";
import {
  CalcShell,
  CalcCard,
  CalcResultPanel,
  CalcResultRow,
  NumberField,
  SelectField,
} from "@/components/calc/CalcShell";
import { formatINR } from "@/lib/calc";

type Strategy = "stc" | "all" | "hold";

export function ConcentrationTracker() {
  const [otherWealthInr, setOtherWealthInr] = useState(40_00_000);
  const [companyStockInr, setCompanyStockInr] = useState(30_00_000);
  const [vestPerQuarterInr, setVestPerQuarterInr] = useState(8_00_000);
  const [taxRatePct, setTaxRatePct] = useState(35.88);
  const [strategy, setStrategy] = useState<Strategy>("all");
  const [otherGrowthPct, setOtherGrowthPct] = useState(10);
  const [stockGrowthPct, setStockGrowthPct] = useState(8);

  const projection = useMemo(() => {
    const quarters = 8; // 2 years
    const otherQuarterly = Math.pow(1 + otherGrowthPct / 100, 1 / 4) - 1;
    const stockQuarterly = Math.pow(1 + stockGrowthPct / 100, 1 / 4) - 1;
    let other = otherWealthInr;
    let stock = companyStockInr;
    const rows: {
      q: number;
      stock: number;
      other: number;
      total: number;
      conc: number;
    }[] = [
      {
        q: 0,
        stock,
        other,
        total: stock + other,
        conc: stock / (stock + other) * 100,
      },
    ];
    for (let q = 1; q <= quarters; q++) {
      // Apply growth to existing stock and other wealth
      stock = stock * (1 + stockQuarterly);
      other = other * (1 + otherQuarterly);
      // Apply vest event based on strategy
      const vestGross = vestPerQuarterInr;
      const vestNet = vestGross * (1 - taxRatePct / 100);
      if (strategy === "stc") {
        // Net shares stay as company stock
        stock += vestNet;
      } else if (strategy === "all") {
        // Net cash redeployed to "other" wealth
        other += vestNet;
      } else if (strategy === "hold") {
        // Wire own cash for tax → entire vestGross stays as stock,
        // but other wealth drops by tax amount
        stock += vestGross;
        other -= vestGross * (taxRatePct / 100);
      }
      const total = stock + other;
      rows.push({ q, stock, other, total, conc: total > 0 ? (stock / total) * 100 : 0 });
    }
    return rows;
  }, [
    otherWealthInr,
    companyStockInr,
    vestPerQuarterInr,
    taxRatePct,
    strategy,
    otherGrowthPct,
    stockGrowthPct,
  ]);

  const final = projection[projection.length - 1];
  const startConc = projection[0].conc;
  const concDelta = final.conc - startConc;

  const riskBand = (pct: number): { label: string; cls: string } => {
    if (pct < 5) return { label: "Low", cls: "text-accent-300" };
    if (pct < 15) return { label: "Moderate", cls: "text-amber-300" };
    if (pct < 30) return { label: "High", cls: "text-amber-200" };
    return { label: "Concentrated", cls: "text-red-300" };
  };
  const finalBand = riskBand(final.conc);

  return (
    <CalcShell
      inputs={
        <div className="space-y-6">
          <CalcCard title="Today">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Other investments / wealth (INR)"
                value={otherWealthInr}
                setValue={setOtherWealthInr}
                min={0}
                step={100000}
                suffix="₹"
                hint="Indian equity, PPF, EPF, real estate, etc."
              />
              <NumberField
                label="Current company stock value (INR)"
                value={companyStockInr}
                setValue={setCompanyStockInr}
                min={0}
                step={100000}
                suffix="₹"
                hint="Vested + currently-held RSUs"
              />
            </div>
          </CalcCard>

          <CalcCard title="Vesting + strategy">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Each quarterly vest (gross INR)"
                value={vestPerQuarterInr}
                setValue={setVestPerQuarterInr}
                min={0}
                step={100000}
                suffix="₹"
              />
              <NumberField
                label="Effective tax rate at vest"
                value={taxRatePct}
                setValue={setTaxRatePct}
                min={0}
                step={1}
                suffix="%"
                hint="Slab + surcharge + cess. ~35.88% for 30% slab + 15% surcharge."
              />
              <SelectField<Strategy>
                label="Strategy"
                value={strategy}
                setValue={setStrategy}
                options={[
                  { v: "stc", l: "Sell-to-cover (default)" },
                  { v: "all", l: "Sell-all + redeploy" },
                  { v: "hold", l: "Hold (cash-pay tax)" },
                ]}
              />
              <NumberField
                label="Stock growth (annual)"
                value={stockGrowthPct}
                setValue={setStockGrowthPct}
                step={1}
                suffix="%"
              />
              <NumberField
                label="Other-wealth growth (annual)"
                value={otherGrowthPct}
                setValue={setOtherGrowthPct}
                step={1}
                suffix="%"
              />
            </div>
          </CalcCard>
        </div>
      }
      results={
        <CalcResultPanel
          label="Concentration in 2 years"
          value={`${final.conc.toFixed(0)}%`}
          sub={`${finalBand.label} risk · ${concDelta >= 0 ? "+" : ""}${concDelta.toFixed(0)}pp from today`}
        >
          <CalcResultRow
            label="Today's concentration"
            value={`${startConc.toFixed(0)}% — ${riskBand(startConc).label}`}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="Stock value at end"
            value={formatINR(final.stock)}
          />
          <CalcResultRow
            label="Other wealth at end"
            value={formatINR(final.other)}
          />
          <CalcResultRow
            label="Total net worth"
            value={formatINR(final.total)}
            bold
          />
          <CalcResultRow divider />
          <div className="space-y-1 text-xs">
            {projection.map((row, i) => (
              <div
                key={row.q}
                className="flex items-center justify-between text-ink-300"
              >
                <span>{i === 0 ? "Now" : `Q+${row.q}`}</span>
                <span className={riskBand(row.conc).cls}>
                  {row.conc.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </CalcResultPanel>
      }
    />
  );
}
