"use client";

import { useMemo, useState } from "react";
import {
  CalcShell,
  CalcCard,
  CalcResultPanel,
  CalcResultRow,
  NumberField,
} from "@/components/calc/CalcShell";
import { detectSurcharge, formatINR } from "@/lib/calc";

interface SlabBracket {
  upTo: number; // upper limit (Infinity for last)
  rate: number;
}

// FY 2025-26 (AY 2026-27) slabs
const NEW_REGIME: SlabBracket[] = [
  { upTo: 4_00_000, rate: 0 },
  { upTo: 8_00_000, rate: 5 },
  { upTo: 12_00_000, rate: 10 },
  { upTo: 16_00_000, rate: 15 },
  { upTo: 20_00_000, rate: 20 },
  { upTo: 24_00_000, rate: 25 },
  { upTo: Infinity, rate: 30 },
];

const OLD_REGIME: SlabBracket[] = [
  { upTo: 2_50_000, rate: 0 },
  { upTo: 5_00_000, rate: 5 },
  { upTo: 10_00_000, rate: 20 },
  { upTo: Infinity, rate: 30 },
];

function applySlabs(income: number, brackets: SlabBracket[]): number {
  let tax = 0;
  let lastLimit = 0;
  for (const b of brackets) {
    if (income <= lastLimit) break;
    const taxableInBracket = Math.min(income, b.upTo) - lastLimit;
    if (taxableInBracket > 0) tax += (taxableInBracket * b.rate) / 100;
    lastLimit = b.upTo;
    if (income <= b.upTo) break;
  }
  return tax;
}

function regimeTotal(income: number, brackets: SlabBracket[]): {
  base: number;
  surcharge: number;
  cess: number;
  total: number;
} {
  const base = applySlabs(income, brackets);
  const surchargePct = detectSurcharge(income);
  const surcharge = (base * surchargePct) / 100;
  const cess = (base + surcharge) * 0.04;
  return { base, surcharge, cess, total: base + surcharge + cess };
}

export function OldVsNewRegimeCalculator() {
  const [salary, setSalary] = useState(40_00_000);
  const [rsuPerquisite, setRsuPerquisite] = useState(20_00_000);
  const [foreignDividend, setForeignDividend] = useState(50_000);
  const [oldDeductions, setOldDeductions] = useState(2_75_000);

  const r = useMemo(() => {
    const grossIncome = salary + rsuPerquisite + foreignDividend;
    const oldTaxable = Math.max(0, grossIncome - oldDeductions);
    const newTaxable = grossIncome; // new regime: most deductions removed
    const oldOut = regimeTotal(oldTaxable, OLD_REGIME);
    const newOut = regimeTotal(newTaxable, NEW_REGIME);
    const winner = newOut.total < oldOut.total ? "new" : "old";
    const savings = Math.abs(oldOut.total - newOut.total);

    return {
      grossIncome,
      oldTaxable,
      newTaxable,
      oldOut,
      newOut,
      winner,
      savings,
    };
  }, [salary, rsuPerquisite, foreignDividend, oldDeductions]);

  return (
    <CalcShell
      inputs={
        <CalcCard title="Annual income & deductions">
          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Salary (cash)"
              value={salary}
              setValue={setSalary}
              min={0}
              step={100000}
              suffix="₹"
            />
            <NumberField
              label="RSU perquisite (annual vests, INR)"
              value={rsuPerquisite}
              setValue={setRsuPerquisite}
              min={0}
              step={100000}
              suffix="₹"
              hint="Total vest value across the year"
            />
            <NumberField
              label="Foreign dividends (INR)"
              value={foreignDividend}
              setValue={setForeignDividend}
              min={0}
              step={1000}
              suffix="₹"
            />
            <NumberField
              label="Old regime deductions"
              value={oldDeductions}
              setValue={setOldDeductions}
              min={0}
              step={10000}
              suffix="₹"
              hint="₹50K standard + 80C ₹1.5L + NPS ₹50K + HRA + others"
            />
          </div>
        </CalcCard>
      }
      results={
        <CalcResultPanel
          label={r.winner === "new" ? "New regime wins" : "Old regime wins"}
          value={formatINR(r.savings)}
          sub="Savings vs the other regime"
        >
          <CalcResultRow
            label="Gross income"
            value={formatINR(r.grossIncome)}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="Old regime taxable"
            value={formatINR(r.oldTaxable)}
          />
          <CalcResultRow
            label="Old regime tax"
            value={formatINR(r.oldOut.total)}
            bold={r.winner === "old"}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="New regime taxable"
            value={formatINR(r.newTaxable)}
          />
          <CalcResultRow
            label="New regime tax"
            value={formatINR(r.newOut.total)}
            bold={r.winner === "new"}
          />
          <CalcResultRow divider />
          <div className="text-xs text-ink-300 leading-relaxed">
            High RSU income tends to favour the new regime if you have limited
            traditional deductions; salary-heavy + 80C/HRA-heavy profiles tend
            to favour the old regime. Foreign dividends are taxed identically
            in both.
          </div>
        </CalcResultPanel>
      }
    />
  );
}
