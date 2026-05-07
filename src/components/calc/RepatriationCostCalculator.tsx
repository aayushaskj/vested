"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalcShell,
  CalcCard,
  CalcResultPanel,
  CalcResultRow,
  NumberField,
  SelectField,
} from "@/components/calc/CalcShell";
import { formatINR } from "@/lib/calc";
import { useFxRate } from "@/hooks/useFxRate";

export function RepatriationCostCalculator() {
  const [usdToRepat, setUsdToRepat] = useState(50_000);
  const [costBasisUsd, setCostBasisUsd] = useState(35_000);
  const [costBasisFx, setCostBasisFx] = useState(82);
  const [sellFx, setSellFx] = useState(84);
  const [fxTouched, setFxTouched] = useState(false);
  const [isLtcg, setIsLtcg] = useState<"ltcg" | "stcg">("ltcg");
  const [slabRatePct, setSlabRatePct] = useState(35.88);
  const [bankMarkupPaise, setBankMarkupPaise] = useState(50);
  const [wires, setWires] = useState(2);
  const [perWireFee, setPerWireFee] = useState(800);

  const { fx } = useFxRate();
  useEffect(() => {
    if (fx && !fxTouched) setSellFx(Number(fx.rate.toFixed(2)));
  }, [fx, fxTouched]);

  const r = useMemo(() => {
    const grossInr = usdToRepat * sellFx;
    const costBasisInr = costBasisUsd * costBasisFx;
    const gainInr = Math.max(0, grossInr - costBasisInr);
    const taxRate = isLtcg === "ltcg" ? 13 : slabRatePct;
    const capGainsTax = (gainInr * taxRate) / 100;
    const fxMarkupCost = (usdToRepat * bankMarkupPaise) / 100;
    const wireFees = wires * perWireFee;
    const totalCost = capGainsTax + fxMarkupCost + wireFees;
    const netReceived = grossInr - totalCost;

    return {
      grossInr,
      costBasisInr,
      gainInr,
      taxRate,
      capGainsTax,
      fxMarkupCost,
      wireFees,
      totalCost,
      netReceived,
      costPct: grossInr > 0 ? (totalCost / grossInr) * 100 : 0,
    };
  }, [
    usdToRepat,
    sellFx,
    costBasisUsd,
    costBasisFx,
    isLtcg,
    slabRatePct,
    bankMarkupPaise,
    wires,
    perWireFee,
  ]);

  return (
    <CalcShell
      inputs={
        <div className="space-y-6">
          <CalcCard title="The transaction">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Amount to repatriate (USD)"
                value={usdToRepat}
                setValue={setUsdToRepat}
                min={0}
                step={1000}
                prefix="$"
              />
              <NumberField
                label="Cost basis of those shares (USD)"
                value={costBasisUsd}
                setValue={setCostBasisUsd}
                min={0}
                step={1000}
                prefix="$"
              />
              <NumberField
                label="USD/INR on purchase day"
                value={costBasisFx}
                setValue={setCostBasisFx}
                min={0}
                step={0.1}
                suffix="₹"
              />
              <NumberField
                label="USD/INR on sell day"
                value={sellFx}
                setValue={(v) => {
                  setSellFx(v);
                  setFxTouched(true);
                }}
                min={0}
                step={0.1}
                suffix="₹"
                hint={
                  fx && !fxTouched ? `Live: ₹${fx.rate.toFixed(2)}` : undefined
                }
              />
              <SelectField<"ltcg" | "stcg">
                label="Holding period"
                value={isLtcg}
                setValue={setIsLtcg}
                options={[
                  { v: "ltcg", l: "> 24 months (LTCG @ 12.5%)" },
                  { v: "stcg", l: "≤ 24 months (STCG @ slab)" },
                ]}
              />
              {isLtcg === "stcg" && (
                <NumberField
                  label="Slab rate"
                  value={slabRatePct}
                  setValue={setSlabRatePct}
                  step={1}
                  suffix="%"
                  hint="Slab + surcharge + cess"
                />
              )}
            </div>
          </CalcCard>

          <CalcCard title="Banking costs">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Indian bank FX markup (paise/USD)"
                value={bankMarkupPaise}
                setValue={setBankMarkupPaise}
                step={5}
                hint="Public sector ~75-100p, private ~30-60p, IBKR INR account ~10p"
              />
              <NumberField
                label="Number of wires"
                value={wires}
                setValue={setWires}
                min={1}
                step={1}
                hint="Spreading over 2-3 wires reduces FX timing risk"
              />
              <NumberField
                label="Wire fee (INR per wire)"
                value={perWireFee}
                setValue={setPerWireFee}
                min={0}
                step={100}
                suffix="₹"
              />
            </div>
          </CalcCard>
        </div>
      }
      results={
        <CalcResultPanel
          label="Net INR received"
          value={formatINR(r.netReceived)}
          sub={`Total cost: ${formatINR(r.totalCost)} (${r.costPct.toFixed(1)}% of gross)`}
        >
          <CalcResultRow
            label="Gross sale (INR)"
            value={formatINR(r.grossInr)}
          />
          <CalcResultRow
            label="Capital gain"
            value={formatINR(r.gainInr)}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label={`Cap gains tax @ ${r.taxRate.toFixed(1)}%`}
            value={`− ${formatINR(r.capGainsTax)}`}
          />
          <CalcResultRow
            label={`FX markup @ ${bankMarkupPaise}p/$`}
            value={`− ${formatINR(r.fxMarkupCost)}`}
          />
          <CalcResultRow
            label={`Wire fees (${wires} × ${formatINR(perWireFee)})`}
            value={`− ${formatINR(r.wireFees)}`}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="Total cost"
            value={formatINR(r.totalCost)}
            bold
          />
        </CalcResultPanel>
      }
    />
  );
}
