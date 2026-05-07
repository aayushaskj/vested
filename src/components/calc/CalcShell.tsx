"use client";

import type { ReactNode } from "react";

/**
 * Standard shell for every calculator: two-column on desktop (inputs left,
 * results right), single column on mobile with results on top after inputs.
 */
export function CalcShell({
  inputs,
  results,
}: {
  inputs: ReactNode;
  results: ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">{inputs}</div>
      <div className="lg:col-span-2">
        <div className="lg:sticky lg:top-24">{results}</div>
      </div>
    </div>
  );
}

export function CalcCard({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
      {title && (
        <h2 className="font-display text-lg font-semibold text-ink-900">
          {title}
        </h2>
      )}
      {title && <div className="mt-4">{children}</div>}
      {!title && children}
    </div>
  );
}

export function CalcResultPanel({
  label,
  value,
  sub,
  children,
}: {
  label: string;
  value: string;
  sub?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 p-6 text-white sm:p-8">
      <p className="text-xs uppercase tracking-wider text-ink-300">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {value}
      </p>
      {sub && <p className="mt-1 text-sm text-ink-300">{sub}</p>}
      {children && <div className="mt-6 space-y-3 text-sm">{children}</div>}
    </div>
  );
}

export function CalcResultRow({
  label,
  value,
  bold,
  divider,
}: {
  label?: string;
  value?: string;
  bold?: boolean;
  divider?: boolean;
}) {
  if (divider) return <div className="h-px bg-white/10" />;
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-ink-300">{label}</span>
      <span
        className={
          bold ? "font-display font-semibold text-white" : "text-white"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function NumberField({
  label,
  value,
  setValue,
  min,
  step,
  prefix,
  suffix,
  hint,
  placeholder,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-800">{label}</span>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-ink-400">
            {prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : 0}
          min={min}
          step={step}
          placeholder={placeholder}
          onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
          className={`w-full rounded-lg border border-ink-200 bg-white py-2.5 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-7" : "pr-3"}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-ink-400">
            {suffix}
          </span>
        )}
      </div>
      {hint && <span className="text-xs text-ink-500">{hint}</span>}
    </label>
  );
}

export function DateField({
  label,
  value,
  setValue,
  hint,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-800">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
      {hint && <span className="text-xs text-ink-500">{hint}</span>}
    </label>
  );
}

export function SelectField<T extends string | number>({
  label,
  value,
  setValue,
  options,
  hint,
}: {
  label: string;
  value: T;
  setValue: (v: T) => void;
  options: { v: T; l: string }[];
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-800">{label}</span>
      <select
        value={String(value)}
        onChange={(e) => {
          const raw = e.target.value;
          const sample = options[0]?.v;
          const parsed =
            typeof sample === "number" ? (parseFloat(raw) as T) : (raw as T);
          setValue(parsed);
        }}
        className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      >
        {options.map((o) => (
          <option key={String(o.v)} value={String(o.v)}>
            {o.l}
          </option>
        ))}
      </select>
      {hint && <span className="text-xs text-ink-500">{hint}</span>}
    </label>
  );
}

export function CheckboxField({
  label,
  checked,
  setChecked,
}: {
  label: string;
  checked: boolean;
  setChecked: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
      />
      {label}
    </label>
  );
}

export const SLAB_OPTIONS = [
  { v: 5, l: "5%" },
  { v: 10, l: "10%" },
  { v: 15, l: "15%" },
  { v: 20, l: "20%" },
  { v: 30, l: "30%" },
];

export const SURCHARGE_OPTIONS = [
  { v: 0, l: "0% (income < ₹50L)" },
  { v: 10, l: "10% (₹50L–₹1Cr)" },
  { v: 15, l: "15% (₹1Cr–₹2Cr)" },
  { v: 25, l: "25% (₹2Cr–₹5Cr)" },
  { v: 37, l: "37% (> ₹5Cr)" },
];
