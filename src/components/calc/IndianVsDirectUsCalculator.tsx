"use client";

import { useMemo, useState } from "react";
import {
  CalcShell,
  CalcCard,
  CalcResultPanel,
  CalcResultRow,
  NumberField,
} from "@/components/calc/CalcShell";
import { formatINR } from "@/lib/calc";

interface FundOption {
  key: string;
  label: string;
  expense: number; // annual %
}

const FUNDS: FundOption[] = [
  { key: "ppfas", label: "PPFAS Flexi Cap (direct)", expense: 0.7 },
  { key: "mosl", label: "MOSL Nasdaq 100 FoF (direct)", expense: 0.5 },
  { key: "vti", label: "Direct VTI via LRS", expense: 0.03 },
];

function project(
  monthlyInr: number,
  years: number,
  grossReturn: number,
  expense: number
): number {
  const months = years * 12;
  const netAnnual = grossReturn - expense;
  const monthly = Math.pow(1 + netAnnual / 100, 1 / 12) - 1;
  let corpus = 0;
  for (let m = 1; m <= months; m++) {
    corpus = corpus * (1 + monthly) + monthlyInr;
  }
  return corpus;
}

export function IndianVsDirectUsCalculator() {
  const [monthlyInr, setMonthlyInr] = useState(50_000);
  const [years, setYears] = useState(20);
  const [grossReturn, setGrossReturn] = useState(11);

  const r = useMemo(() => {
    return FUNDS.map((f) => ({
      ...f,
      finalCorpus: project(monthlyInr, years, grossReturn, f.expense),
    }));
  }, [monthlyInr, years, grossReturn]);

  const winner = r.reduce(
    (best, cur) => (cur.finalCorpus > best.finalCorpus ? cur : best),
    r[0]
  );
  const worst = r.reduce(
    (worst, cur) => (cur.finalCorpus < worst.finalCorpus ? cur : worst),
    r[0]
  );
  const totalInvested = monthlyInr * 12 * years;

  return (
    <CalcShell
      inputs={
        <CalcCard title="Investment plan">
          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Monthly contribution (INR)"
              value={monthlyInr}
              setValue={setMonthlyInr}
              min={0}
              step={10000}
              suffix="₹"
            />
            <NumberField
              label="Time horizon (years)"
              value={years}
              setValue={setYears}
              min={1}
              step={1}
            />
            <NumberField
              label="Expected gross return (annual %)"
              value={grossReturn}
              setValue={setGrossReturn}
              step={0.5}
              suffix="%"
              hint="Same for all routes — this isolates expense ratio impact"
            />
          </div>
        </CalcCard>
      }
      results={
        <CalcResultPanel
          label={`Direct US (VTI) wins by`}
          value={formatINR(winner.finalCorpus - worst.finalCorpus)}
          sub={`Total invested: ${formatINR(totalInvested)} over ${years} years`}
        >
          {r.map((f) => (
            <CalcResultRow
              key={f.key}
              label={`${f.label} (${f.expense}%)`}
              value={formatINR(f.finalCorpus)}
              bold={f.key === winner.key}
            />
          ))}
          <CalcResultRow divider />
          <div className="text-xs text-ink-300 leading-relaxed">
            <strong className="text-white">Note:</strong> this isolates expense
            drag only. PPFAS has tax/compliance simplicity that direct US
            doesn't (12-month LTCG, no Schedule FA). For under ₹15L/yr, that
            simplicity often outweighs the expense gap.
          </div>
        </CalcResultPanel>
      }
    />
  );
}
