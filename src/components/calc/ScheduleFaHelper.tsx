"use client";

import { useMemo, useState } from "react";
import {
  CalcShell,
  CalcCard,
  CalcResultPanel,
  CalcResultRow,
  NumberField,
} from "@/components/calc/CalcShell";
import { formatINR, formatUSD } from "@/lib/calc";

export function ScheduleFaHelper() {
  const [costBasisUsd, setCostBasisUsd] = useState(15000);
  const [costBasisFx, setCostBasisFx] = useState(83);
  const [peakSharesUsd, setPeakSharesUsd] = useState(20000);
  const [peakFx, setPeakFx] = useState(85);
  const [closingSharesUsd, setClosingSharesUsd] = useState(18500);
  const [closingFx, setClosingFx] = useState(84.5);
  const [dividendUsd, setDividendUsd] = useState(200);
  const [dividendFx, setDividendFx] = useState(84);
  const [realizedGainInr, setRealizedGainInr] = useState(0);

  const r = useMemo(() => {
    const initialInr = costBasisUsd * costBasisFx;
    const peakInr = peakSharesUsd * peakFx;
    const closingInr = closingSharesUsd * closingFx;
    const dividendInr = dividendUsd * dividendFx;
    const totalIncomeInr = dividendInr + realizedGainInr;
    return { initialInr, peakInr, closingInr, dividendInr, totalIncomeInr };
  }, [
    costBasisUsd,
    costBasisFx,
    peakSharesUsd,
    peakFx,
    closingSharesUsd,
    closingFx,
    dividendUsd,
    dividendFx,
    realizedGainInr,
  ]);

  return (
    <CalcShell
      inputs={
        <div className="space-y-6">
          <CalcCard title="Initial investment">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Cost basis (USD)"
                value={costBasisUsd}
                setValue={setCostBasisUsd}
                min={0}
                step={100}
                prefix="$"
                hint="Total USD invested across all purchases"
              />
              <NumberField
                label="USD/INR on acquisition (avg)"
                value={costBasisFx}
                setValue={setCostBasisFx}
                min={0}
                step={0.1}
                suffix="₹"
                hint="SBI TT-buying rate(s) used on purchase dates"
              />
            </div>
          </CalcCard>

          <CalcCard title="Peak value during the FY">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Peak market value (USD)"
                value={peakSharesUsd}
                setValue={setPeakSharesUsd}
                min={0}
                step={100}
                prefix="$"
                hint="Highest holding value during the FY"
              />
              <NumberField
                label="USD/INR on peak day"
                value={peakFx}
                setValue={setPeakFx}
                min={0}
                step={0.1}
                suffix="₹"
              />
            </div>
          </CalcCard>

          <CalcCard title="Closing balance (March 31)">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Market value on March 31 (USD)"
                value={closingSharesUsd}
                setValue={setClosingSharesUsd}
                min={0}
                step={100}
                prefix="$"
              />
              <NumberField
                label="USD/INR on March 31"
                value={closingFx}
                setValue={setClosingFx}
                min={0}
                step={0.1}
                suffix="₹"
              />
            </div>
          </CalcCard>

          <CalcCard title="Income during the year">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Total dividends (USD)"
                value={dividendUsd}
                setValue={setDividendUsd}
                min={0}
                step={10}
                prefix="$"
              />
              <NumberField
                label="USD/INR (avg of dividend dates)"
                value={dividendFx}
                setValue={setDividendFx}
                min={0}
                step={0.1}
                suffix="₹"
              />
              <NumberField
                label="Realized capital gains (INR)"
                value={realizedGainInr}
                setValue={setRealizedGainInr}
                step={1000}
                suffix="₹"
                hint="From the Cap Gains calculator"
              />
            </div>
          </CalcCard>
        </div>
      }
      results={
        <CalcResultPanel
          label="Schedule FA values (INR)"
          value={formatINR(r.peakInr)}
          sub="Peak value — the most-asked field"
        >
          <CalcResultRow
            label="Initial investment"
            value={formatINR(r.initialInr)}
          />
          <CalcResultRow
            label="Peak value during FY"
            value={formatINR(r.peakInr)}
            bold
          />
          <CalcResultRow
            label="Closing balance (Mar 31)"
            value={formatINR(r.closingInr)}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="Dividend income"
            value={formatINR(r.dividendInr)}
          />
          <CalcResultRow
            label="Realized capital gains"
            value={formatINR(realizedGainInr)}
          />
          <CalcResultRow
            label="Total income (this asset)"
            value={formatINR(r.totalIncomeInr)}
            bold
          />
        </CalcResultPanel>
      }
    />
  );
}
