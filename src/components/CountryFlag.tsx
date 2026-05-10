import type { CountryCode } from "nationid";
import { COUNTRY_META } from "@/lib/countries.ts";
import { cn } from "@/lib/utils.ts";

interface CountryFlagProps {
  readonly country: CountryCode;
  readonly className?: string;
  readonly showName?: boolean;
}

/**
 * Inline flag emoji + (optional) country name. Emoji is wrapped in
 * `aria-hidden` so screen readers announce the country name only.
 */
export function CountryFlag({ country, className, showName = false }: CountryFlagProps) {
  const meta = COUNTRY_META[country];
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span aria-hidden className="text-base leading-none">
        {meta.flag}
      </span>
      {showName && <span>{meta.name}</span>}
      {!showName && <span className="sr-only">{meta.name}</span>}
    </span>
  );
}
