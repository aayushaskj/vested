/**
 * Registry of all calculators on the site. Used by the /tools index page,
 * sitemap, and cross-linking.
 */

export interface CalculatorMeta {
  slug: string;
  href: string;
  title: string;
  description: string;
  category: "rsu" | "tax" | "investing" | "planning";
  status: "live" | "soon";
}

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "rsu-calculator",
    href: "/tools/rsu-calculator",
    title: "RSU take-home calculator",
    description:
      "Estimate INR take-home after perquisite tax, surcharge, and cess on a vesting RSU tranche.",
    category: "rsu",
    status: "live",
  },
  {
    slug: "lrs-tcs-calculator",
    href: "/tools/lrs-tcs-calculator",
    title: "LRS & TCS calculator",
    description:
      "Compute the 20% TCS on LRS remittances above Rs 10 lakh and how much actually lands at your broker.",
    category: "tax",
    status: "live",
  },
  {
    slug: "us-capital-gains-calculator",
    href: "/tools/us-capital-gains-calculator",
    title: "US capital gains calculator (INR)",
    description:
      "STCG vs LTCG, the 24-month rule, and Indian tax on US stock sales with currency conversion.",
    category: "tax",
    status: "live",
  },
  {
    slug: "form-67-ftc-calculator",
    href: "/tools/form-67-ftc-calculator",
    title: "Form 67 / FTC calculator",
    description:
      "Compute foreign tax credit available on US dividends and net Indian tax owed.",
    category: "tax",
    status: "live",
  },
  {
    slug: "espp-roi-calculator",
    href: "/tools/espp-roi-calculator",
    title: "ESPP ROI calculator",
    description:
      "Calculate your ESPP return after the 15% discount, lookback, and Indian perquisite tax.",
    category: "rsu",
    status: "live",
  },
  {
    slug: "stock-options-calculator",
    href: "/tools/stock-options-calculator",
    title: "Stock options (NSO/ISO) calculator",
    description:
      "Cash needed to exercise + Indian perquisite tax on the spread, plus net shares retained.",
    category: "rsu",
    status: "live",
  },
  {
    slug: "rsu-concentration-tracker",
    href: "/tools/rsu-concentration-tracker",
    title: "RSU concentration tracker",
    description:
      "Project your single-stock concentration over time as RSUs vest and accumulate.",
    category: "rsu",
    status: "live",
  },
  {
    slug: "schedule-fa-helper",
    href: "/tools/schedule-fa-helper",
    title: "Schedule FA helper",
    description:
      "Compute initial value, peak value, and closing balance in INR for foreign-asset disclosure.",
    category: "tax",
    status: "live",
  },
  {
    slug: "us-etf-sip-calculator",
    href: "/tools/us-etf-sip-calculator",
    title: "US ETF SIP calculator",
    description:
      "Project a multi-year US ETF SIP corpus in INR and USD with FX drift baked in.",
    category: "planning",
    status: "live",
  },
  {
    slug: "currency-hedge-calculator",
    href: "/tools/currency-hedge-calculator",
    title: "Currency hedge sizing calculator",
    description:
      "How much of your long-term portfolio should be in USD assets, based on USD-flavored expenses.",
    category: "planning",
    status: "live",
  },
  {
    slug: "indian-vs-direct-us-calculator",
    href: "/tools/indian-vs-direct-us-calculator",
    title: "Indian funds vs direct US (cost comparison)",
    description:
      "Compare 20-year wealth from PPFAS, MOSL Nasdaq FoF, and direct US ETFs via LRS.",
    category: "investing",
    status: "live",
  },
  {
    slug: "rnor-window-calculator",
    href: "/tools/rnor-window-calculator",
    title: "RNOR window calculator",
    description:
      "When does your RNOR status start and end if you return to India on a given date?",
    category: "tax",
    status: "live",
  },
  {
    slug: "repatriation-cost-calculator",
    href: "/tools/repatriation-cost-calculator",
    title: "Repatriation cost calculator",
    description:
      "Total cost of bringing US investment proceeds back to India: FX, fees, capital gains tax.",
    category: "tax",
    status: "live",
  },
  {
    slug: "holding-period-checker",
    href: "/tools/holding-period-checker",
    title: "Holding period checker",
    description:
      "Given an acquisition date, when does an asset cross the LTCG threshold for its asset class?",
    category: "tax",
    status: "live",
  },
  {
    slug: "sell-to-cover-simulator",
    href: "/tools/sell-to-cover-simulator",
    title: "Sell-to-cover simulator",
    description:
      "Project net shares retained after sell-to-cover for a vest, with subsequent stock-move scenarios.",
    category: "rsu",
    status: "live",
  },
  {
    slug: "old-vs-new-tax-regime",
    href: "/tools/old-vs-new-tax-regime",
    title: "Old vs new tax regime (with foreign income)",
    description:
      "Compare Indian old vs new regime tax for someone with foreign salary, dividends, or RSU income.",
    category: "tax",
    status: "live",
  },
  {
    slug: "tax-loss-harvesting-calendar",
    href: "/tools/tax-loss-harvesting-calendar",
    title: "Tax-loss harvesting calendar",
    description:
      "Find dates to realize losses across your foreign-equity lots, given Indian holding-period rules.",
    category: "planning",
    status: "live",
  },
];

export function getCalculator(slug: string): CalculatorMeta | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}
