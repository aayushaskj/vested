"use client";

import { useMemo, useState } from "react";
import {
  CalcShell,
  CalcCard,
  CalcResultPanel,
  CalcResultRow,
  DateField,
  NumberField,
} from "@/components/calc/CalcShell";

function fyForDate(d: Date): { start: Date; end: Date; label: string } {
  const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  const start = new Date(y, 3, 1);
  const end = new Date(y + 1, 2, 31);
  return { start, end, label: `${y}–${(y + 1).toString().slice(-2)}` };
}

function formatLong(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function RnorWindowCalculator() {
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().slice(0, 10);
  });
  const [yearsAsNri, setYearsAsNri] = useState(8);

  const r = useMemo(() => {
    const arrival = new Date(returnDate);
    const arrivalFy = fyForDate(arrival);

    const eligible = yearsAsNri >= 9; // standard rule: NRI for 9 of last 10 years
    // Days in arrival FY (from arrival date to FY end)
    const daysInArrivalFy = Math.max(
      0,
      Math.floor(
        (arrivalFy.end.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    const arrivalFyResident = daysInArrivalFy >= 182;
    // RNOR typically begins the FY after arrival if arrival year wasn't full resident
    const rnorStartFy = arrivalFyResident
      ? arrivalFy
      : fyForDate(new Date(arrivalFy.end.getTime() + 86400000));
    // RNOR window: 2 years
    const rnorEndYear = rnorStartFy.start.getFullYear() + 2;
    const rnorEndFy = {
      start: new Date(rnorEndYear, 3, 1),
      end: new Date(rnorEndYear + 1, 2, 31),
      label: `${rnorEndYear}–${(rnorEndYear + 1).toString().slice(-2)}`,
    };
    const ordinarilyResidentFy = fyForDate(
      new Date(rnorEndFy.end.getTime() + 86400000)
    );

    return {
      arrival,
      arrivalFy,
      eligible,
      rnorStartFy,
      rnorEndFy,
      ordinarilyResidentFy,
      arrivalFyResident,
    };
  }, [returnDate, yearsAsNri]);

  return (
    <CalcShell
      inputs={
        <CalcCard title="Your return">
          <div className="grid gap-5 sm:grid-cols-2">
            <DateField
              label="Date you return to India (or plan to)"
              value={returnDate}
              setValue={setReturnDate}
            />
            <NumberField
              label="Years as NRI in last 10 FYs"
              value={yearsAsNri}
              setValue={setYearsAsNri}
              min={0}
              step={1}
              hint="Need 9 of last 10 to qualify for RNOR"
            />
          </div>
          {!r.eligible && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              You don't meet the standard RNOR test (NRI for 9 of last 10 FYs).
              You'll likely become Ordinarily Resident immediately on return.
              There are alternative tests — consult a CA.
            </div>
          )}
        </CalcCard>
      }
      results={
        <CalcResultPanel
          label="RNOR window"
          value={r.eligible ? `~2 FYs` : "Not eligible"}
          sub={
            r.eligible
              ? `${r.rnorStartFy.label} → ${r.rnorEndFy.label}`
              : "Plan as Ordinarily Resident"
          }
        >
          <CalcResultRow
            label="Return date"
            value={formatLong(r.arrival)}
          />
          <CalcResultRow
            label="Arrival FY"
            value={r.arrivalFy.label}
          />
          <CalcResultRow
            label="Resident in arrival FY?"
            value={r.arrivalFyResident ? "Likely yes" : "Probably NRI"}
          />
          <CalcResultRow divider />
          {r.eligible && (
            <>
              <CalcResultRow
                label="RNOR begins FY"
                value={r.rnorStartFy.label}
                bold
              />
              <CalcResultRow
                label="RNOR ends after FY"
                value={r.rnorEndFy.label}
              />
              <CalcResultRow
                label="Ordinarily Resident from FY"
                value={r.ordinarilyResidentFy.label}
              />
              <CalcResultRow divider />
              <div className="text-xs text-ink-300 leading-relaxed">
                <strong className="text-white">Use the window to:</strong> sell
                appreciated foreign equity (no Indian capital gains during
                RNOR), do Roth conversions, restructure foreign accounts —
                before Schedule FA + global income kick in.
              </div>
            </>
          )}
        </CalcResultPanel>
      }
    />
  );
}
