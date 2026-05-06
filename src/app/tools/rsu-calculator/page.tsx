import { RsuCalculator } from "@/components/RsuCalculator";

export const metadata = {
  title: "RSU Calculator — vesting, taxes & take-home",
  description:
    "Estimate your RSU take-home as an Indian resident: gross value, US withholding, India perquisite tax, and net rupees in hand.",
};

export default function RsuCalculatorPage() {
  return (
    <div className="container-wide py-16">
      <header className="max-w-2xl">
        <span className="badge-rsu">RSU Management</span>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          RSU Calculator
        </h1>
        <p className="mt-4 text-lg text-ink-600 leading-relaxed">
          Estimate the rupees in your hand after vesting an RSU tranche. Built
          for Indian residents holding US-listed RSUs from a multinational
          employer.
        </p>
        <p className="mt-3 text-sm text-ink-500">
          Educational tool. Numbers are estimates — your actual liability
          depends on your slab, surcharge, cess, and treaty position. Consult a
          CA before acting on any output.
        </p>
      </header>
      <div className="mt-10">
        <RsuCalculator />
      </div>
    </div>
  );
}
