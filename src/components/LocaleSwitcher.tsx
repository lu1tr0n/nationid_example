import type { Locale } from "nationid/i18n";
import { useLocale } from "@/lib/i18n.tsx";
import { cn } from "@/lib/utils.ts";

const LOCALES: ReadonlyArray<{ readonly code: Locale; readonly label: string }> = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "pt", label: "PT" },
];

/**
 * Compact 3-button toggle for the locale that drives library calls.
 *
 * Stays as a button group (not a Select) so all three options are always
 * visible and one tap switches — important on the playground page where
 * users compare i18n output side-by-side.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border border-[var(--color-line)] bg-[var(--color-canvas-muted)] p-0.5 text-xs",
        className,
      )}
      role="group"
      aria-label="Locale"
    >
      {LOCALES.map((l) => {
        const isActive = l.code === locale;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            aria-pressed={isActive}
            className={cn(
              "rounded-sm px-2.5 py-1 font-mono font-medium transition-colors",
              isActive
                ? "bg-[var(--color-canvas)] text-[var(--color-ink)] shadow-sm"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
            )}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
