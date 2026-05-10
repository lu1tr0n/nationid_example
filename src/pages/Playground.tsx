import { Wand2 } from "lucide-react";
import type { CountryCode, DocumentTypeCode } from "nationid";
import { getSpec, listSupportedCountries } from "nationid";
import { listDocuments } from "nationid/catalog";
import { useEffect, useMemo, useState } from "react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher.tsx";
import { ResultPanel } from "@/components/ResultPanel.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { COUNTRY_META } from "@/lib/countries.ts";
import { useLocale } from "@/lib/i18n.tsx";
import { getSample } from "@/lib/sample-inputs.ts";

const DEFAULT_COUNTRY: CountryCode = "SV";

export function Playground() {
  const { locale } = useLocale();
  const countries = useMemo(() => listSupportedCountries(), []);
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);

  const documents = useMemo(() => listDocuments(country, locale), [country, locale]);
  const [code, setCode] = useState<DocumentTypeCode>(documents[0]?.code ?? "SV_DUI");

  // When the country changes the previously selected code may not belong to
  // the new country. Reset to the first document of the new country.
  useEffect(() => {
    if (documents.length > 0 && !documents.some((d) => d.code === code)) {
      setCode(documents[0]!.code);
    }
  }, [documents, code]);

  const spec = useMemo(() => getSpec(code), [code]);
  const [input, setInput] = useState<string>(() => getSample(code) ?? "");

  // When the document type changes, prefill with a known-valid sample so the
  // results panel shows something interesting on first interaction.
  useEffect(() => {
    setInput(getSample(code) ?? "");
  }, [code]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">Playground</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--color-ink-muted)]">
            Pick a country and document type, type a value, and watch every helper from{" "}
            <span className="font-mono">nationid</span> evaluate live. The source on the right is
            the actual code that produced the panel.
          </p>
        </div>
        <LocaleSwitcher />
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
          <CardDescription>
            Locale also drives the catalog display name and the i18n error message when invalid.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="pg-country">Country</Label>
            <Select
              value={country}
              onValueChange={(v) => {
                setCountry(v as CountryCode);
              }}
            >
              <SelectTrigger id="pg-country">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((cc) => (
                  <SelectItem key={cc} value={cc}>
                    <span className="mr-2" aria-hidden>
                      {COUNTRY_META[cc].flag}
                    </span>
                    {COUNTRY_META[cc].name} <span className="ml-1 font-mono text-xs opacity-60">{cc}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pg-doc">Document type</Label>
            <Select
              value={code}
              onValueChange={(v) => {
                setCode(v as DocumentTypeCode);
              }}
            >
              <SelectTrigger id="pg-doc">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {documents.map((doc) => (
                  <SelectItem key={doc.code} value={doc.code}>
                    {doc.displayName} <span className="ml-1 font-mono text-xs opacity-60">{doc.code}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-[var(--color-ink-muted)]">
              {documents[0] ? documents.find((d) => d.code === code)?.longName ?? "" : ""}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pg-input">Input</Label>
            <div className="flex gap-2">
              <Input
                id="pg-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={spec.mask}
                spellCheck={false}
                autoComplete="off"
                className="font-mono"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setInput(getSample(code) ?? "");
                }}
                aria-label="Insert a sample value"
              >
                <Wand2 aria-hidden />
                <span className="hidden sm:inline">sample</span>
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="muted" className="font-mono">
                mask {spec.mask}
              </Badge>
              <Badge variant="muted">confidence: {spec.confidence}</Badge>
              <Badge variant="muted">scope: {spec.scope}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <ResultPanel code={code} input={input} locale={locale} />
    </div>
  );
}
