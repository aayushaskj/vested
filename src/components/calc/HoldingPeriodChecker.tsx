"use client";

import { useMemo, useState } from "react";
import {
  CalcShell,
  CalcCard,
  CalcResultPanel,
  CalcResultRow,
  DateField,
  SelectField,
} from "@/components/calc/CalcShell";

type AssetClass =
  | "indian-listed"
  | "us-equity"
  | "rsu"
  | "espp"
  | "real-estate"
  | "gold"
  | "indian-unlisted"
  | "indian-debt-mf"
  | "crypto";

const RULES: Record<
  AssetClass,
  { label: string; thresholdMonths: number | null; ltcgRatePct: number; stcgNote: string }
> = {
  "indian-listed": {
    label: "Indian listed equity",
    thresholdMonths: 12,
    ltcgRatePct: 12.5,
    stcgNote: "20% (post Budget 2024)",
  },
  "us-equity": {
    label: "US-listed equity / ETFs",
    thresholdMonths: 24,
    ltcgRatePct: 12.5,
    stcgNote: "Slab rate",
  },
  rsu: {
    label: "RSUs (from vest date)",
    thresholdMonths: 24,
    ltcgRatePct: 12.5,
    stcgNote: "Slab rate",
  },
  espp: {
    label: "ESPP (from purchase date)",
    thresholdMonths: 24,
    ltcgRatePct: 12.5,
    stcgNote: "Slab rate",
  },
  "real-estate": {
    label: "Real estate (Indian)",
    thresholdMonths: 24,
    ltcgRatePct: 12.5,
    stcgNote: "Slab rate",
  },
  gold: {
    label: "Gold (post April 2023 acquisition)",
    thresholdMonths: 24,
    ltcgRatePct: 12.5,
    stcgNote: "Slab rate",
  },
  "indian-unlisted": {
    label: "Indian unlisted equity",
    thresholdMonths: 24,
    ltcgRatePct: 12.5,
    stcgNote: "Slab rate",
  },
  "indian-debt-mf": {
    label: "Indian debt MF (post April 2023)",
    thresholdMonths: null,
    ltcgRatePct: 0,
    stcgNote: "Slab rate (no LTCG benefit)",
  },
  crypto: {
    label: "Cryptocurrency",
    thresholdMonths: null,
    ltcgRatePct: 30,
    stcgNote: "30% flat regardless of period",
  },
};

export function HoldingPeriodChecker() {
  const [assetClass, setAssetClass] = useState<AssetClass>("us-equity");
  const today = new Date().toISOString().slice(0, 10);
  const [acquisitionDate, setAcquisitionDate] = useState(today);

  const r = useMemo(() => {
    const rule = RULES[assetClass];
    const acquisition = new Date(acquisitionDate);
    const now = new Date();
    const todaysDays = Math.floor(
      (now.getTime() - acquisition.getTime()) / (1000 * 60 * 60 * 24)
    );
    const ltcgEligible =
      rule.thresholdMonths === null
        ? false
        : todaysDays > rule.thresholdMonths * 30;
    let crossDate: Date | null = null;
    let daysToCross: number | null = null;
    if (rule.thresholdMonths !== null) {
      crossDate = new Date(acquisition);
      crossDate.setMonth(crossDate.getMonth() + rule.thresholdMonths);
      crossDate.setDate(crossDate.getDate() + 1); // strictly greater than threshold
      daysToCross = Math.max(
        0,
        Math.ceil(
          (crossDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
    }
    return {
      rule,
      todaysDays,
      todaysMonths: todaysDays / 30,
      ltcgEligible,
      crossDate,
      daysToCross,
    };
  }, [assetClass, acquisitionDate]);

  return (
    <CalcShell
      inputs={
        <CalcCard title="Your holding">
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField<AssetClass>
              label="Asset class"
              value={assetClass}
              setValue={setAssetClass}
              options={(Object.keys(RULES) as AssetClass[]).map((k) => ({
                v: k,
                l: RULES[k].label,
              }))}
            />
            <DateField
              label="Acquisition / vest / purchase date"
              value={acquisitionDate}
              setValue={setAcquisitionDate}
            />
          </div>
        </CalcCard>
      }
      results={
        <CalcResultPanel
          label={r.ltcgEligible ? "Already LTCG-eligible" : "Still STCG"}
          value={
            r.daysToCross !== null && r.daysToCross > 0
              ? `${r.daysToCross} days to LTCG`
              : r.ltcgEligible
                ? "Sell when ready"
                : "Special tax regime"
          }
          sub={r.rule.label}
        >
          <CalcResultRow
            label="Held for"
            value={`${r.todaysMonths.toFixed(1)} months (${r.todaysDays} days)`}
          />
          {r.rule.thresholdMonths !== null && (
            <>
              <CalcResultRow
                label="LTCG threshold"
                value={`${r.rule.thresholdMonths} months`}
              />
              {r.crossDate && (
                <CalcResultRow
                  label="LTCG-eligible from"
                  value={r.crossDate.toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                />
              )}
            </>
          )}
          <CalcResultRow divider />
          <CalcResultRow
            label="LTCG rate"
            value={`${r.rule.ltcgRatePct}%`}
          />
          <CalcResultRow label="STCG treatment" value={r.rule.stcgNote} />
        </CalcResultPanel>
      }
    />
  );
}
