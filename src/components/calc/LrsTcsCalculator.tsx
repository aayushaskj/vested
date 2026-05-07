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

const TCS_THRESHOLD = 10_00_000; // ₹10 lakh
const TCS_RATE = 0.2; // 20%

export function LrsTcsCalculator() {
  const [thisRemit, setThisRemit] = useState(15_00_000);
  const [alreadyUsed, setAlreadyUsed] = useState(0);

  const r = useMemo(() => {
    const cumulativeBefore = Math.max(0, alreadyUsed);
    const cumulativeAfter = cumulativeBefore + thisRemit;
    const remainingFreeBefore = Math.max(0, TCS_THRESHOLD - cumulativeBefore);
    const tcsableThisRemit = Math.max(0, thisRemit - remainingFreeBefore);
    const tcs = tcsableThisRemit * TCS_RATE;
    const netAtBroker = thisRemit - tcs;

    return {
      cumulativeBefore,
      cumulativeAfter,
      remainingFreeBefore,
      tcsableThisRemit,
      tcs,
      netAtBroker,
      tcsEffectivePct: thisRemit > 0 ? (tcs / thisRemit) * 100 : 0,
    };
  }, [thisRemit, alreadyUsed]);

  return (
    <CalcShell
      inputs={
        <CalcCard title="This remittance">
          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Amount you're remitting now"
              value={thisRemit}
              setValue={setThisRemit}
              min={0}
              step={50000}
              suffix="₹"
            />
            <NumberField
              label="LRS remittances already done in this FY"
              value={alreadyUsed}
              setValue={setAlreadyUsed}
              min={0}
              step={50000}
              suffix="₹"
              hint="For investment purposes only. April–March."
            />
          </div>
          <div className="mt-6 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>How this works:</strong> The first ₹10 lakh of LRS
            investment remittance per FY is TCS-free. Anything above that is
            taxed at 20% TCS — refundable later via your ITR, but tied up for
            6–12 months.
          </div>
        </CalcCard>
      }
      results={
        <CalcResultPanel
          label="Net amount landing at your broker"
          value={formatINR(r.netAtBroker)}
          sub="After 20% TCS where applicable"
        >
          <CalcResultRow
            label="This remittance"
            value={formatINR(thisRemit)}
          />
          <CalcResultRow
            label="Already remitted this FY"
            value={formatINR(r.cumulativeBefore)}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="TCS-free portion"
            value={formatINR(thisRemit - r.tcsableThisRemit)}
          />
          <CalcResultRow
            label="TCSable portion (above ₹10L)"
            value={formatINR(r.tcsableThisRemit)}
          />
          <CalcResultRow
            label="TCS @ 20%"
            value={`− ${formatINR(r.tcs)}`}
            bold
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="Effective TCS rate"
            value={`${r.tcsEffectivePct.toFixed(1)}%`}
          />
        </CalcResultPanel>
      }
    />
  );
}
