"use client";

import { useMemo, useState } from "react";
import {
  CalcShell,
  CalcCard,
  CalcResultPanel,
  CalcResultRow,
  NumberField,
  DateField,
} from "@/components/calc/CalcShell";
import { formatINR } from "@/lib/calc";

interface Lot {
  id: number;
  acquisitionDate: string;
  costBasisInr: number;
  currentValueInr: number;
}

export function TaxLossHarvestingCalendar() {
  const [lots, setLots] = useState<Lot[]>([
    {
      id: 1,
      acquisitionDate: "2024-08-15",
      costBasisInr: 5_00_000,
      currentValueInr: 4_20_000,
    },
    {
      id: 2,
      acquisitionDate: "2023-02-10",
      costBasisInr: 8_00_000,
      currentValueInr: 6_80_000,
    },
    {
      id: 3,
      acquisitionDate: "2025-01-05",
      costBasisInr: 3_00_000,
      currentValueInr: 3_45_000,
    },
  ]);
  const [nextId, setNextId] = useState(4);

  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  const analysis = useMemo(() => {
    return lots.map((lot) => {
      const acq = new Date(lot.acquisitionDate);
      const monthsHeld =
        (today.getTime() - acq.getTime()) / (1000 * 60 * 60 * 24 * 30);
      const gain = lot.currentValueInr - lot.costBasisInr;
      const isLoss = gain < 0;
      const isLong = monthsHeld > 24;
      const status = isLoss
        ? isLong
          ? "Long-term LOSS"
          : "Short-term LOSS"
        : isLong
          ? "Long-term GAIN"
          : "Short-term GAIN";
      // 24-month threshold date
      const ltcgDate = new Date(acq);
      ltcgDate.setMonth(ltcgDate.getMonth() + 24);
      ltcgDate.setDate(ltcgDate.getDate() + 1);
      const daysToLtcg = Math.max(
        0,
        Math.ceil(
          (ltcgDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
      // Recommendation logic
      let recommendation = "Hold";
      if (isLoss && !isLong) {
        recommendation = "Harvest STCL — best flexibility (offsets any gain)";
      } else if (isLoss && isLong) {
        recommendation = "Harvest LTCL — only offsets LT gains";
      } else if (!isLoss && !isLong && daysToLtcg <= 90) {
        recommendation = `Wait ${daysToLtcg}d for LTCG`;
      } else if (!isLoss && isLong) {
        recommendation = "LTCG-eligible — sell when needed";
      }
      return { lot, monthsHeld, gain, isLoss, isLong, status, recommendation, daysToLtcg };
    });
  }, [lots]);

  const totals = useMemo(() => {
    let stcl = 0,
      ltcl = 0,
      stcg = 0,
      ltcg = 0;
    for (const a of analysis) {
      if (a.isLoss && !a.isLong) stcl += -a.gain;
      else if (a.isLoss && a.isLong) ltcl += -a.gain;
      else if (!a.isLoss && !a.isLong) stcg += a.gain;
      else if (!a.isLoss && a.isLong) ltcg += a.gain;
    }
    // STCL can offset any gains. LTCL can only offset LTCG.
    const ltcgAfterLtcl = Math.max(0, ltcg - ltcl);
    const remainingStcl = Math.max(0, stcl - stcg);
    const ltcgAfterStcl = Math.max(0, ltcgAfterLtcl - remainingStcl);
    const stcgAfterStcl = Math.max(0, stcg - stcl);
    return { stcl, ltcl, stcg, ltcg, ltcgAfterLtcl, ltcgAfterStcl, stcgAfterStcl };
  }, [analysis]);

  function addLot() {
    setLots([
      ...lots,
      {
        id: nextId,
        acquisitionDate: todayIso,
        costBasisInr: 1_00_000,
        currentValueInr: 1_00_000,
      },
    ]);
    setNextId(nextId + 1);
  }

  function updateLot(id: number, patch: Partial<Lot>) {
    setLots((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function removeLot(id: number) {
    setLots((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <CalcShell
      inputs={
        <div className="space-y-6">
          <CalcCard title="Your foreign-equity lots">
            <div className="space-y-4">
              {lots.map((lot) => {
                const a = analysis.find((x) => x.lot.id === lot.id);
                return (
                  <div
                    key={lot.id}
                    className="rounded-lg border border-ink-100 bg-ink-50/30 p-4"
                  >
                    <div className="grid gap-3 sm:grid-cols-3">
                      <DateField
                        label="Acquired"
                        value={lot.acquisitionDate}
                        setValue={(v) =>
                          updateLot(lot.id, { acquisitionDate: v })
                        }
                      />
                      <NumberField
                        label="Cost basis (INR)"
                        value={lot.costBasisInr}
                        setValue={(v) =>
                          updateLot(lot.id, { costBasisInr: v })
                        }
                        step={10000}
                        suffix="₹"
                      />
                      <NumberField
                        label="Current value (INR)"
                        value={lot.currentValueInr}
                        setValue={(v) =>
                          updateLot(lot.id, { currentValueInr: v })
                        }
                        step={10000}
                        suffix="₹"
                      />
                    </div>
                    {a && (
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${
                            a.isLoss
                              ? "bg-red-100 text-red-800"
                              : "bg-accent-100 text-accent-800"
                          }`}
                        >
                          {a.status}
                        </span>
                        <span className="text-ink-600">
                          {a.gain >= 0 ? "+" : ""}
                          {formatINR(a.gain)}
                        </span>
                        <span className="text-ink-500">
                          · {a.monthsHeld.toFixed(1)} months held
                        </span>
                        <span className="ml-auto text-ink-700">
                          {a.recommendation}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeLot(lot.id)}
                          className="text-ink-400 hover:text-red-600"
                          aria-label="Remove lot"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              <button
                type="button"
                onClick={addLot}
                className="w-full rounded-lg border border-dashed border-ink-300 py-3 text-sm font-medium text-ink-700 hover:border-ink-400 hover:bg-ink-50"
              >
                + Add another lot
              </button>
            </div>
          </CalcCard>
        </div>
      }
      results={
        <CalcResultPanel
          label="Net taxable gain after harvest"
          value={formatINR(totals.ltcgAfterStcl + totals.stcgAfterStcl)}
          sub="STCL absorbs first, LTCL absorbs LTCG only"
        >
          <CalcResultRow
            label="Short-term losses (STCL)"
            value={formatINR(totals.stcl)}
          />
          <CalcResultRow
            label="Short-term gains (STCG)"
            value={formatINR(totals.stcg)}
          />
          <CalcResultRow
            label="Long-term losses (LTCL)"
            value={formatINR(totals.ltcl)}
          />
          <CalcResultRow
            label="Long-term gains (LTCG)"
            value={formatINR(totals.ltcg)}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="LTCG after LTCL offset"
            value={formatINR(totals.ltcgAfterLtcl)}
          />
          <CalcResultRow
            label="Net STCG"
            value={formatINR(totals.stcgAfterStcl)}
          />
          <CalcResultRow
            label="Net LTCG"
            value={formatINR(totals.ltcgAfterStcl)}
            bold
          />
        </CalcResultPanel>
      }
    />
  );
}
