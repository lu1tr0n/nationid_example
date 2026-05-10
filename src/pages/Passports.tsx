import { ArrowUpRight, Check, Plane, Wand2, X } from "lucide-react";
import type { CountryCode, DocumentTypeCode } from "nationid";
import { getSpec, listSupportedCountries, validate } from "nationid";
import { getDocumentInfo, type DocumentInfo } from "nationid/catalog";
import { useEffect, useMemo, useState } from "react";
import { CodeBlock } from "@/components/CodeBlock.tsx";
import { LocaleSwitcher } from "@/components/LocaleSwitcher.tsx";
import { Badge, type BadgeProps } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { COUNTRY_META, countryName } from "@/lib/countries.ts";
import { useLocale } from "@/lib/i18n.tsx";
import { getSample } from "@/lib/sample-inputs.ts";
import { cn } from "@/lib/utils.ts";

const REPO_BASE = "https://github.com/lu1tr0n/nationid/tree/main/docs/countries";

const CONFIDENCE_VARIANT: Record<DocumentInfo["confidence"], BadgeProps["variant"]> = {
  high: "success",
  moderate: "warn",
  low: "muted",
  unconfirmed: "muted",
};

function passportCode(cc: CountryCode): DocumentTypeCode {
  return `${cc}_PASAPORTE` as DocumentTypeCode;
}

function buildSnippet(cc: CountryCode, input: string, locale: string): string {
  const code = passportCode(cc);
  const safe = input.replaceAll("`", "\\`");
  return `import { validate } from "nationid";
import { getDocumentInfo } from "nationid/catalog";

const code = "${code}" as const;
const input = \`${safe}\`;

const info = getDocumentInfo(code, "${locale}");
//   info.displayName, info.longName, info.confidence, …

validate(code, input);
//   ${validate(code, input)}`;
}

export function Passports() {
  const { locale } = useLocale();
  const countries = useMemo(() => listSupportedCountries(), []);
  const [activeCountry, setActiveCountry] = useState<CountryCode>(countries[0] ?? "SV");
  const [input, setInput] = useState<string>(() => getSample(passportCode(countries[0] ?? "SV")) ?? "");
  const [compareInput, setCompareInput] = useState<string>("");

  // Honor `?cc=XX` on initial load so deep-links from other pages open the right country.
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
    const cc = params.get("cc")?.toUpperCase() as CountryCode | undefined;
    if (cc && countries.includes(cc)) {
      setActiveCountry(cc);
      setInput(getSample(passportCode(cc)) ?? "");
    }
  }, [countries]);

  const passportInfos = useMemo(
    () =>
      countries
        .map((cc) => ({ cc, info: getDocumentInfo(passportCode(cc), locale) }))
        .filter((entry): entry is { cc: CountryCode; info: DocumentInfo } => entry.info !== null),
    [countries, locale],
  );

  const summary = useMemo(() => {
    const acc = { high: 0, moderate: 0, low: 0, unconfirmed: 0 };
    for (const entry of passportInfos) {
      acc[entry.info.confidence]++;
    }
    return acc;
  }, [passportInfos]);

  const activeCode = passportCode(activeCountry);
  const activeInfo = useMemo(() => getDocumentInfo(activeCode, locale), [activeCode, locale]);
  const activeSpec = useMemo(() => getSpec(activeCode), [activeCode]);
  const isValid = input.length > 0 && validate(activeCode, input);

  const compareResults = useMemo(() => {
    if (compareInput.trim().length === 0) return [];
    return passportInfos.map((entry) => ({
      cc: entry.cc,
      info: entry.info,
      passes: validate(passportCode(entry.cc), compareInput),
    }));
  }, [compareInput, passportInfos]);

  const passingCount = compareResults.filter((r) => r.passes).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-md bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <Plane className="size-4" aria-hidden />
            </span>
            <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">Passport playground</h1>
          </div>
          <p className="max-w-2xl text-sm text-[var(--color-ink-muted)]">
            v0.5 ships a <code className="rounded bg-[var(--color-canvas-muted)] px-1 font-mono text-xs">
              {"<CC>_PASAPORTE"}
            </code>{" "}
            spec for every supported country. Pick one, type a passport number, and see the live
            <span className="mx-1 font-mono">validate()</span> result with full catalog metadata.
          </p>
        </div>
        <LocaleSwitcher />
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Coverage summary</CardTitle>
          <CardDescription>
            {passportInfos.length} passport specs across {countries.length} countries. Confidence
            tier reflects how strongly the printed number can be validated; the strong checks for
            travel documents live on the MRZ (see{" "}
            <a className="text-[var(--color-accent)] hover:underline" href="#/mrz">
              the MRZ calculator
            </a>
            ).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-4">
          <SummaryCard label="Total specs" value={passportInfos.length} variant="default" />
          <SummaryCard label="High confidence" value={summary.high} variant="success" />
          <SummaryCard label="Moderate" value={summary.moderate} variant="warn" />
          <SummaryCard label="Lenient regex" value={summary.low + summary.unconfirmed} variant="muted" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Country</CardTitle>
            <CardDescription>22 supported · sorted by ISO code</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid max-h-[480px] gap-1.5 overflow-y-auto pr-1">
              {passportInfos.map(({ cc, info }) => {
                const selected = cc === activeCountry;
                return (
                  <li key={cc}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCountry(cc);
                        setInput(getSample(passportCode(cc)) ?? "");
                      }}
                      aria-pressed={selected}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                        selected
                          ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                          : "border-[var(--color-line)] bg-[var(--color-canvas-muted)] hover:border-[var(--color-accent)]",
                      )}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span aria-hidden>{COUNTRY_META[cc].flag}</span>
                        <span className="truncate">{countryName(cc)}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Badge variant={CONFIDENCE_VARIANT[info.confidence]}>{info.confidence}</Badge>
                        <span className="font-mono text-[11px] text-[var(--color-ink-muted)]">
                          {cc}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <span aria-hidden className="text-3xl leading-none">
                  {COUNTRY_META[activeCountry].flag}
                </span>
                <div>
                  <CardTitle className="font-mono text-base">
                    {activeInfo?.displayName ?? activeCode}
                  </CardTitle>
                  <CardDescription>{activeInfo?.longName ?? ""}</CardDescription>
                </div>
                {activeInfo && (
                  <Badge variant={CONFIDENCE_VARIANT[activeInfo.confidence]} className="ml-auto">
                    {activeInfo.confidence}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              {activeInfo && (
                <p className="text-sm text-[var(--color-ink-muted)]">{activeInfo.description}</p>
              )}
              <div className="grid gap-1.5">
                <Label htmlFor="passport-input">Passport number</Label>
                <div className="flex gap-2">
                  <Input
                    id="passport-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={activeSpec.mask}
                    spellCheck={false}
                    autoComplete="off"
                    className="font-mono uppercase"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setInput(getSample(activeCode) ?? "")}
                    aria-label="Insert a sample value"
                  >
                    <Wand2 aria-hidden />
                    <span className="hidden sm:inline">sample</span>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Badge variant="muted" className="font-mono">
                    mask {activeSpec.mask}
                  </Badge>
                  <Badge variant="muted" className="font-mono">
                    {activeCode}
                  </Badge>
                </div>
              </div>

              <ValidationResult input={input} valid={isValid} />

              <div className="flex flex-wrap items-center gap-3 border-t border-[var(--color-line)] pt-3 text-xs">
                <a
                  href={`${REPO_BASE}/${activeCountry.toLowerCase()}.md`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-[var(--color-accent)] hover:underline"
                >
                  Source: docs/countries/{activeCountry.toLowerCase()}.md
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
                <a
                  className="inline-flex items-center gap-1 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  href={`#/playground?code=${activeCode}`}
                >
                  Open in playground
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Snippet</CardTitle>
              <CardDescription>The exact code that drives the panel above.</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                lang="ts"
                title={`${activeCountry.toLowerCase()}-passport.ts`}
                code={buildSnippet(activeCountry, input, locale)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cross-country compare</CardTitle>
              <CardDescription>
                Paste a passport number; we run it through every country's regex and report
                matches. Useful for sanity-checking ambiguous inputs.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="compare-input">Number</Label>
                <Input
                  id="compare-input"
                  value={compareInput}
                  onChange={(e) => setCompareInput(e.target.value)}
                  placeholder="e.g. AB123456"
                  spellCheck={false}
                  autoComplete="off"
                  className="font-mono uppercase"
                />
              </div>
              {compareInput.trim().length === 0 ? (
                <p className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-line)] p-4 text-sm text-[var(--color-ink-muted)]">
                  Type a number to see which countries' passport spec accepts it.
                </p>
              ) : (
                <>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                    {passingCount} of {compareResults.length} passport specs accept this input.
                  </p>
                  <ul className="grid gap-1.5 sm:grid-cols-2">
                    {compareResults
                      .slice()
                      .sort(
                        (a, b) =>
                          Number(b.passes) - Number(a.passes) || a.cc.localeCompare(b.cc),
                      )
                      .map((r) => (
                        <li
                          key={r.cc}
                          className={cn(
                            "flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm",
                            r.passes
                              ? "border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)]"
                              : "border-[var(--color-line)] bg-[var(--color-canvas-muted)] text-[var(--color-ink-muted)]",
                          )}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span aria-hidden>{COUNTRY_META[r.cc].flag}</span>
                            <span className="truncate">{countryName(r.cc)}</span>
                            <span className="font-mono text-[11px] text-[var(--color-ink-muted)]">
                              {r.cc}
                            </span>
                          </span>
                          <span aria-hidden className="shrink-0">
                            {r.passes ? (
                              <Check className="size-4 text-[var(--color-accent)]" />
                            ) : (
                              <X className="size-4" />
                            )}
                          </span>
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  variant,
}: {
  readonly label: string;
  readonly value: number;
  readonly variant: BadgeProps["variant"];
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas-muted)] p-3">
      <p className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)]">{label}</p>
      <p className="mt-1 font-serif text-2xl">{value}</p>
      <Badge variant={variant} className="mt-1 font-mono text-[10px]">
        confidence
      </Badge>
    </div>
  );
}

function ValidationResult({
  input,
  valid,
}: {
  readonly input: string;
  readonly valid: boolean;
}) {
  if (input.trim().length === 0) {
    return (
      <p className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-line)] p-4 text-sm text-[var(--color-ink-muted)]">
        Type a passport number to validate.
      </p>
    );
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-card)] border p-4",
        valid
          ? "border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]"
          : "border-[var(--color-danger)]/30 bg-[color-mix(in_oklch,var(--color-danger)_10%,transparent)]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid size-8 place-items-center rounded-full",
          valid
            ? "bg-[var(--color-accent)] text-[var(--color-canvas)]"
            : "bg-[var(--color-danger)] text-[var(--color-canvas)]",
        )}
      >
        {valid ? <Check className="size-4" /> : <X className="size-4" />}
      </span>
      <div>
        <p className="font-serif text-base leading-tight">
          {valid ? "Passes the passport spec" : "Does not match the passport spec"}
        </p>
        <p className="font-mono text-xs text-[var(--color-ink-muted)]">
          validate() = {valid ? "true" : "false"}
        </p>
      </div>
    </div>
  );
}
