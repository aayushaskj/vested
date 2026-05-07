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

export function UsEtfSipCalculator() {
  const [monthlyInr, setMonthlyInr] = useState(50_000);
  const [years, setYears] = useState(15);
  const [usdReturnPct, setUsdReturnPct] = useState(9);
  const [inrDepreciationPct, setInrDepreciationPct] = useState(3);
  const [startingFx, setStartingFx] = useState(84);
  const [fxTouched, setFxTouched] = useState(false);

  const { fx } = useFxRate();
  useEffect(() => {
    if (fx && !fxTouched) setStartingFx(Number(fx.rate.toFixed(2)));
  }, [fx, fxTouched]);

  const r = useMemo(() => {
    const months = years * 12;
    const usdMonthlyReturn = Math.pow(1 + usdReturnPct / 100, 1 / 12) - 1;
    const fxMonthlyDrift = Math.pow(1 + inrDepreciationPct / 100, 1 / 12) - 1;

    let usdCorpus = 0;
    let totalInrInvested = 0;
    let fxNow = startingFx;
    for (let m = 1; m <= months; m++) {
      // Monthly INR converts to USD at current FX
      const usdContribution = monthlyInr / fxNow;
      usdCorpus = usdCorpus * (1 + usdMonthlyReturn) + usdContribution;
      totalInrInvested += monthlyInr;
      fxNow = fxNow * (1 + fxMonthlyDrift);
    }
    const finalFx = fxNow;
    const finalInrCorpus = usdCorpus * finalFx;
    const totalGainInr = finalInrCorpus - totalInrInvested;

    return {
      months,
      usdCorpus,
      totalInrInvested,
      finalFx,
      finalInrCorpus,
      totalGainInr,
    };
  }, [monthlyInr, years, usdReturnPct, inrDepreciationPct, startingFx]);

  return (
    <CalcShell
      inputs={
        <CalcCard title="SIP plan">
          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Monthly SIP (INR)"
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
              label="Expected USD return per year"
              value={usdReturnPct}
              setValue={setUsdReturnPct}
              step={0.5}
              suffix="%"
              hint="Long-term US equity ~9-10%"
            />
            <NumberField
              label="Expected INR depreciation per year"
              value={inrDepreciationPct}
              setValue={setInrDepreciationPct}
              step={0.5}
              suffix="%"
              hint="Historical: 3-4% per year"
            />
            <NumberField
              label="Starting USD/INR rate"
              value={startingFx}
              setValue={(v) => {
                setStartingFx(v);
                setFxTouched(true);
              }}
              min={0}
              step={0.1}
              suffix="₹"
              hint={
                fx && !fxTouched ? `Live rate: ₹${fx.rate.toFixed(2)}` : undefined
              }
            />
          </div>
        </CalcCard>
      }
      results={
        <CalcResultPanel
          label={`Corpus in ${years} years`}
          value={formatINR(r.finalInrCorpus)}
          sub={`USD value: ${formatUSD(r.usdCorpus)} @ ₹${r.finalFx.toFixed(1)}/$`}
        >
          <CalcResultRow
            label="Total INR invested"
            value={formatINR(r.totalInrInvested)}
          />
          <CalcResultRow
            label="USD corpus accumulated"
            value={formatUSD(r.usdCorpus)}
          />
          <CalcResultRow
            label="Final USD/INR rate"
            value={`₹${r.finalFx.toFixed(1)}/$`}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="Final corpus (INR)"
            value={formatINR(r.finalInrCorpus)}
            bold
          />
          <CalcResultRow
            label="Total INR gain"
            value={formatINR(r.totalGainInr)}
          />
          <CalcResultRow
            label="Multiple"
            value={`${(r.finalInrCorpus / r.totalInrInvested).toFixed(2)}x`}
          />
        </CalcResultPanel>
      }
    />
  );
}
