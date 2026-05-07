import Image from "next/image";

/**
 * Employer registry. Each entry maps an `id` (used in MDX) to the display
 * name and the path to a logo SVG under /public/logos/employers/.
 *
 * If a logo file isn't available (typical for trademarked corporate logos
 * that simple-icons excludes), set `logo` to `null` and the component
 * falls back to rendering the company name as a styled text chip.
 */
const EMPLOYERS = {
  google: { name: "Google", logo: "/logos/employers/google.svg" },
  amazon: { name: "Amazon", logo: "/logos/employers/amazon.svg" },
  paloalto: {
    name: "Palo Alto Networks",
    logo: "/logos/employers/paloaltonetworks.svg",
  },
  cisco: { name: "Cisco", logo: "/logos/employers/cisco.svg" },
  fortinet: { name: "Fortinet", logo: "/logos/employers/fortinet.svg" },
  intel: { name: "Intel", logo: "/logos/employers/intel.svg" },
  arm: { name: "Arm", logo: "/logos/employers/arm.svg" },
  servicenow: { name: "ServiceNow", logo: null },
  microsoft: { name: "Microsoft", logo: "/logos/employers/microsoft.svg" },
  netapp: { name: "NetApp", logo: "/logos/employers/netapp.svg" },
  broadcom: { name: "Broadcom", logo: "/logos/employers/broadcom.svg" },
  walmart: { name: "Walmart", logo: "/logos/employers/walmart.svg" },
  oracle: { name: "Oracle", logo: "/logos/employers/oracle.svg" },
  salesforce: { name: "Salesforce", logo: "/logos/employers/salesforce.svg" },
  elilily: { name: "Eli Lilly", logo: null },
  intuit: { name: "Intuit", logo: "/logos/employers/intuit.svg" },
  spotify: { name: "Spotify", logo: "/logos/employers/spotify.svg" },
  arista: { name: "Arista Networks", logo: null },
  couchbase: { name: "Couchbase", logo: "/logos/employers/couchbase.svg" },
  udemy: { name: "Udemy", logo: "/logos/employers/udemy.svg" },
} as const;

export type EmployerId = keyof typeof EMPLOYERS;

interface EmployerCalloutProps {
  /** Comma- or space-separated list of employer IDs, e.g. "google,amazon,cisco". */
  for: string;
  /** Optional override label. Defaults to "Relevant if you work at:" */
  label?: string;
}

/**
 * Inline employer callout used at the top of broker-comparison posts.
 * Renders a small "Relevant if you work at: [logos]" chip so a reader can
 * tell at a glance whether the post applies to them.
 *
 * Usage in MDX:
 *   <EmployerCallout for="google,amazon,paloalto,cisco,fortinet" />
 */
export function EmployerCallout({
  for: forProp,
  label = "Relevant if you work at",
}: EmployerCalloutProps) {
  const ids = forProp
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean) as EmployerId[];

  const employers = ids
    .map((id) => EMPLOYERS[id])
    .filter(Boolean);

  if (employers.length === 0) return null;

  return (
    <aside
      className="not-prose my-6 rounded-xl border border-ink-100 bg-ink-50/60 px-5 py-4"
      aria-label="Employer relevance"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
        {employers.map((emp) => (
          <span
            key={emp.name}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-800"
            title={emp.name}
          >
            {emp.logo ? (
              <Image
                src={emp.logo}
                alt={emp.name}
                width={20}
                height={20}
                className="h-5 w-5 opacity-80"
                unoptimized
              />
            ) : (
              <span
                aria-hidden
                className="inline-flex h-5 w-5 items-center justify-center rounded bg-ink-200 text-[10px] font-bold text-ink-600"
              >
                {emp.name
                  .split(/\s+/)
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
            <span>{emp.name}</span>
          </span>
        ))}
      </div>
    </aside>
  );
}
