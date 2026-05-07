"use client";

import { useMemo, useState } from "react";
import {
  CalcShell,
  CalcCard,
  CalcResultPanel,
  CalcResultRow,
  NumberField,
  SelectField,
  CheckboxField,
  SLAB_OPTIONS,
  SURCHARGE_OPTIONS,
} from "@/components/calc/CalcShell";
import { computeIndianTax, formatINR } from "@/lib/calc";

export function Form67Calculator() {
  const [grossDivINR, setGrossDivINR] = useState(50_000);
  const [usWhPct, setUsWhPct] = useState(25);
  const [slab, setSlab] = useState(30);
  const [surcharge, setSurcharge] = useState(15);
  const [cessOn, setCessOn] = useState(true);

  const r = useMemo(() => {
    const usTax = (grossDivINR * usWhPct) / 100;
    const indianTax = computeIndianTax(grossDivINR, slab, surcharge, cessOn);
    const ftc = Math.min(usTax, indianTax.total);
    const netIndianTax = Math.max(0, indianTax.total - ftc);
    const totalTax = usTax + netIndianTax;
    const cashRetained = grossDivINR - totalTax;
    const wastedFtc = Math.max(0, usTax - ftc);

    return {
      usTax,
      indianTax,
      ftc,
      netIndianTax,
      totalTax,
      cashRetained,
      wastedFtc,
      effectiveRate: grossDivINR > 0 ? (totalTax / grossDivINR) * 100 : 0,
    };
  }, [grossDivINR, usWhPct, slab, surcharge, cessOn]);

  const noFiling = r.usTax + r.indianTax.total;

  return (
    <CalcShell
      inputs={
        <div className="space-y-6">
          <CalcCard title="Foreign income">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Gross dividend received (INR)"
                value={grossDivINR}
                setValue={setGrossDivINR}
                min={0}
                step={1000}
                suffix="₹"
                hint="Total US dividends, before US withholding, in INR (use SBI TT-buying on each dividend date)."
              />
              <SelectField
                label="US withholding rate"
                value={usWhPct}
                setValue={setUsWhPct}
                options={[
                  { v: 25, l: "25% (W-8BEN on file, treaty)" },
                  { v: 30, l: "30% (no W-8BEN — statutory)" },
                  { v: 15, l: "15% (US bonds)" },
                ]}
              />
            </div>
          </CalcCard>

          <CalcCard title="Indian tax assumptions">
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Marginal slab"
                value={slab}
                setValue={setSlab}
                options={SLAB_OPTIONS}
              />
              <SelectField
                label="Surcharge"
                value={surcharge}
                setValue={setSurcharge}
                options={SURCHARGE_OPTIONS}
              />
            </div>
            <div className="mt-4">
              <CheckboxField
                label="Apply 4% Health & Education cess"
                checked={cessOn}
                setChecked={setCessOn}
              />
            </div>
          </CalcCard>

          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>If you skip Form 67:</strong> you forfeit the FTC entirely.
            Total tax becomes <strong>{formatINR(noFiling)}</strong> instead of{" "}
            <strong>{formatINR(r.totalTax)}</strong> — a leak of{" "}
            <strong>{formatINR(noFiling - r.totalTax)}</strong>.
          </div>
        </div>
      }
      results={
        <CalcResultPanel
          label="Net cash retained"
          value={formatINR(r.cashRetained)}
          sub={`Effective tax rate: ${r.effectiveRate.toFixed(1)}%`}
        >
          <CalcResultRow
            label="Gross dividend"
            value={formatINR(grossDivINR)}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label={`US withholding @ ${usWhPct}%`}
            value={`− ${formatINR(r.usTax)}`}
          />
          <CalcResultRow
            label={`Indian tax @ ${r.indianTax.effectivePct.toFixed(1)}%`}
            value={`− ${formatINR(r.indianTax.total)}`}
          />
          <CalcResultRow
            label="FTC claimable (Form 67)"
            value={`+ ${formatINR(r.ftc)}`}
          />
          <CalcResultRow divider />
          <CalcResultRow
            label="Net Indian tax payable"
            value={`− ${formatINR(r.netIndianTax)}`}
          />
          <CalcResultRow
            label="Total tax burden"
            value={`− ${formatINR(r.totalTax)}`}
            bold
          />
          {r.wastedFtc > 0 && (
            <CalcResultRow
              label="Wasted US tax (cannot carry forward)"
              value={`${formatINR(r.wastedFtc)}`}
            />
          )}
        </CalcResultPanel>
      }
    />
  );
}
