"use client";

import { useMemo, useState } from "react";
import {
  CalcShell,
  CalcCard,
  CalcResultPanel,
  CalcResultRow,
  NumberField,
  CheckboxField,
} from "@/components/calc/CalcShell";
import { formatINR } from "@/lib/calc";

export function CurrencyHedgeCalculator() {
  const [annualSpend, setAnnualSpend] = useState(20_00_000);
  const [usdSubsInr, setUsdSubsInr] = useState(60_000);
  const [foreignTravelInr, setForeignTravelInr] = useState(2_00_000);
  const [foreignEduFutureInr, setForeignEduFutureInr] = useState(0);
  const [importedGoodsInr, setImportedGoodsInr] = useState(50_000);
  const [planEmigration, setPlanEmigration] = useState(false);
  const [investableNetWorth, setInvestableNetWorth] = useState(75_00_000);
  const [diversificationPremium, setDiversificationPremium] = useState(8);

  const r = useMemo(() => {
    const usdFlavoredSpending =
      usdSubsInr + foreignTravelInr + foreignEduFutureInr + importedGoodsInr;
    const usdSpendShare =
      annualSpend > 0 ? (usdFlavoredSpending / annualSpend) * 100 : 0;
    const baseTarget = usdSpendShare;
    const emigrationBoost = planEmigration ? 35 : 0;
    const recommendedPct = Math.min(
      100,
      Math.round(baseTarget + diversificationPremium + emigrationBoost)
    );
    const recommendedAmount = (investableNetWorth * recommendedPct) / 100;
    const minPct = Math.max(15, Math.round(recommendedPct - 10));
    const maxPct = Math.min(80, Math.round(recommendedPct + 10));

    return {
      usdFlavoredSpending,
      usdSpendShare,
      recommendedPct,
      recommendedAmount,
      minPct,
      maxPct,
    };
  }, [
    annualSpend,
    usdSubsInr,
    foreignTravelInr,
    foreignEduFutureInr,
    importedGoodsInr,
    planEmigration,
    investableNetWorth,
    diversificationPremium,
  ]);

  return (
    <CalcShell
      inputs={
        <div className="space-y-6">
          <CalcCard title="Your annual spending profile">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Total annual spending (INR)"
                value={annualSpend}
                setValue={setAnnualSpend}
                min={0}
                step={50000}
                suffix="₹"
              />
              <NumberField
                label="Foreign software subscriptions / SaaS"
                value={usdSubsInr}
                setValue={setUsdSubsInr}
                min={0}
                step={5000}
                suffix="₹"
                hint="Netflix, Spotify, AWS, Adobe, etc."
              />
              <NumberField
                label="International travel"
                value={foreignTravelInr}
                setValue={setForeignTravelInr}
                min={0}
                step={10000}
                suffix="₹"
              />
              <NumberField
                label="Foreign education (future, annualized)"
                value={foreignEduFutureInr}
                setValue={setForeignEduFutureInr}
                min={0}
                step={10000}
                suffix="₹"
                hint="If kids will study abroad, divide total cost over remaining years"
              />
              <NumberField
                label="Imported goods / electronics"
                value={importedGoodsInr}
                setValue={setImportedGoodsInr}
                min={0}
                step={10000}
                suffix="₹"
              />
            </div>
          </CalcCard>

          <CalcCard title="Portfolio + plans">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Total investable net worth (INR)"
                value={investableNetWorth}
                setValue={setInvestableNetWorth}
                min={0}
                step={500000}
                suffix="₹"
                hint="Excludes primary residence"
              />
              <NumberField
                label="Diversification premium"
                value={diversificationPremium}
                setValue={setDiversificationPremium}
                step={1}
                suffix="%"
                hint="Extra USD beyond hedging needs (default 8%)"
              />
            </div>
            <div className="mt-4">
              <CheckboxField
                label="I plan to emigrate / spend retirement abroad"
                checked={planEmigration}
                setChecked={setPlanEmigration}
              />
            </div>
          </CalcCard>
        </div>
      }
      results={
        <CalcResultPanel
          label="Recommended USD allocation"
          value={`${r.recommendedPct}%`}
          sub={`Reasonable range: ${r.minPct}% – ${r.maxPct}%`}
        >
          <CalcResultRow
            label="USD-flavored spending"
            value={`${formatINR(r.usdFlavoredSpending)}/yr`}
          />
          <CalcResultRow
            label="As % of total spending"
            value={`${r.usdSpendShare.toFixed(0)}%`}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="Recommended USD allocation"
            value={formatINR(r.recommendedAmount)}
            bold
          />
          <CalcResultRow
            label="Of net worth"
            value={`${r.recommendedPct}%`}
          />
          <CalcResultRow divider />
          <div className="text-xs text-ink-300 leading-relaxed">
            <strong className="text-white">How this is computed:</strong> we
            start with your USD-flavored spending share, add a{" "}
            {diversificationPremium}% diversification premium
            {planEmigration ? ", and a 35% emigration boost" : ""}.
            For most working Indians, 20–40% USD is sensible; {">"}60% is a
            strong currency bet.
          </div>
        </CalcResultPanel>
      }
    />
  );
}
