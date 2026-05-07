import { ShareButtons } from "@/components/ShareButtons";

interface CalcPageHeaderProps {
  badge: string;
  badgeClass?: "us" | "rsu";
  title: string;
  description: string;
  shareTitle: string;
  shareDescription: string;
}

/**
 * Standard header for every calculator page.
 * Includes the category badge, title, description, and share buttons.
 */
export function CalcPageHeader({
  badge,
  badgeClass = "us",
  title,
  description,
  shareTitle,
  shareDescription,
}: CalcPageHeaderProps) {
  return (
    <header className="max-w-2xl">
      <span className={badgeClass === "rsu" ? "badge-rsu" : "badge-us"}>
        {badge}
      </span>
      <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-base sm:text-lg text-ink-600 leading-relaxed">
        {description}
      </p>
      <div className="mt-5">
        <ShareButtons title={shareTitle} description={shareDescription} />
      </div>
    </header>
  );
}
