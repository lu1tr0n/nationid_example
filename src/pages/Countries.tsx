import { ArrowUpRight } from "lucide-react";
import type { CountryCode } from "nationid";
import { listSupportedCountries } from "nationid";
import {
  type DocumentInfo,
  type DocumentPurpose,
  listDocuments,
  listDocumentsByPurpose,
} from "nationid/catalog";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { CountryFlag } from "@/components/CountryFlag.tsx";
import { LocaleSwitcher } from "@/components/LocaleSwitcher.tsx";
import { Badge, type BadgeProps } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { COUNTRY_META, countryName } from "@/lib/countries.ts";
import { useLocale } from "@/lib/i18n.tsx";
import { cn } from "@/lib/utils.ts";

const PURPOSE_OPTIONS: ReadonlyArray<{
  readonly value: DocumentPurpose | "all";
  readonly label: string;
}> = [
  { value: "all", label: "All purposes" },
  { value: "identity", label: "Identity" },
  { value: "tax", label: "Tax" },
  { value: "voter", label: "Voter" },
  { value: "social_security", label: "Social security" },
  { value: "migratory", label: "Migratory" },
  { value: "driver_license", label: "Driver license" },
];

const CONFIDENCE_VARIANT: Record<DocumentInfo["confidence"], BadgeProps["variant"]> = {
  high: "success",
  moderate: "warn",
  low: "muted",
  unconfirmed: "muted",
};

export function Countries() {
  const { locale } = useLocale();
  const countries = useMemo(() => listSupportedCountries(), []);
  const [purpose, setPurpose] = useState<DocumentPurpose | "all">("all");
  const [activeCountry, setActiveCountry] = useState<CountryCode | null>(null);

  // Honor `#XX` hash so deep-links from the homepage flag cloud open the right country.
  useEffect(() => {
    function syncFromHash() {
      const hash = window.location.hash.replace(/^#/, "").replace(/^\//, "");
      const code = hash.toUpperCase() as CountryCode;
      if (countries.includes(code)) {
        setActiveCountry(code);
      }
    }
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [countries]);

  const filteredCountries = useMemo(() => {
    if (purpose === "all") return countries;
    const codesWithPurpose = new Set(listDocumentsByPurpose(purpose, locale).map((d) => d.country));
    return countries.filter((c) => codesWithPurpose.has(c));
  }, [countries, purpose, locale]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">Country browser</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--color-ink-muted)]">
            Every document type bundled with <span className="font-mono">nationid</span>, served by{" "}
            <code className="rounded bg-[var(--color-canvas-muted)] px-1 font-mono text-xs">
              listDocuments(country, locale)
            </code>{" "}
            and <code className="rounded bg-[var(--color-canvas-muted)] px-1 font-mono text-xs">
              listDocumentsByPurpose()
            </code>.
          </p>
        </div>
        <LocaleSwitcher />
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-[280px_1fr] sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="purpose-filter">Purpose</Label>
          <Select value={purpose} onValueChange={(v) => setPurpose(v as DocumentPurpose | "all")}>
            <SelectTrigger id="purpose-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PURPOSE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-[var(--color-ink-muted)] sm:text-right">
          {filteredCountries.length} of {countries.length} countries · click any card to expand its
          documents.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCountries.map((cc) => {
          const docs = listDocuments(cc, locale).filter(
            (d) => purpose === "all" || d.purpose === purpose,
          );
          const isOpen = activeCountry === cc;
          return (
            <li key={cc} id={cc}>
              <Card
                className={cn(
                  "transition-colors",
                  isOpen && "border-[var(--color-accent)]",
                )}
              >
                <button
                  type="button"
                  onClick={() => setActiveCountry((curr) => (curr === cc ? null : cc))}
                  aria-expanded={isOpen}
                  aria-controls={`country-panel-${cc}`}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span aria-hidden className="text-2xl leading-none">
                      {COUNTRY_META[cc].flag}
                    </span>
                    <span>
                      <span className="block font-serif text-lg leading-tight">{countryName(cc)}</span>
                      <span className="font-mono text-xs text-[var(--color-ink-muted)]">
                        {cc} · {docs.length} {docs.length === 1 ? "spec" : "specs"}
                      </span>
                    </span>
                  </span>
                  <span aria-hidden className="text-xs text-[var(--color-ink-muted)]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={`country-panel-${cc}`}
                    className="border-t border-[var(--color-line)] bg-[var(--color-canvas)]"
                  >
                    {docs.length === 0 ? (
                      <p className="p-4 text-sm text-[var(--color-ink-muted)]">
                        No documents match this filter.
                      </p>
                    ) : (
                      <ul className="divide-y divide-[var(--color-line)]">
                        {docs.map((doc) => (
                          <li key={doc.code} className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-mono text-sm font-semibold text-[var(--color-ink)]">
                                    {doc.displayName}
                                  </h3>
                                  <Badge variant={CONFIDENCE_VARIANT[doc.confidence]}>
                                    {doc.confidence}
                                  </Badge>
                                  <Badge variant="muted">{doc.purpose.replace("_", " ")}</Badge>
                                </div>
                                <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                                  {doc.longName}
                                </p>
                                <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                                  {doc.description}
                                </p>
                                {doc.knownAs.length > 0 && (
                                  <ul className="mt-2 flex flex-wrap gap-1">
                                    {doc.knownAs.map((alias) => (
                                      <li key={alias}>
                                        <Badge variant="outline" className="font-mono">
                                          {alias}
                                        </Badge>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              <Button asChild variant="ghost" size="sm" className="shrink-0">
                                <Link to={`/playground#${doc.code}`}>
                                  Try
                                  <ArrowUpRight aria-hidden />
                                </Link>
                              </Button>
                            </div>
                            <p className="mt-2 font-mono text-[10px] text-[var(--color-ink-muted)]">
                              code {doc.code}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </Card>
            </li>
          );
        })}
      </ul>

      {filteredCountries.length === 0 && (
        <div className="mt-12 flex flex-col items-center gap-2 text-center">
          <CountryFlag country="SV" />
          <p className="text-sm text-[var(--color-ink-muted)]">
            No countries match the selected purpose. Try a different filter.
          </p>
        </div>
      )}
    </div>
  );
}
