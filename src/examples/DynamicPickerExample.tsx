import type { CountryCode, DocumentTypeCode } from "nationid";
import { listSupportedCountries, validate } from "nationid";
import { listDocuments } from "nationid/catalog";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { COUNTRY_META } from "@/lib/countries.ts";
import { useLocale } from "@/lib/i18n.tsx";

/**
 * Future-proof picker: every dropdown is computed from `nationid` itself, so
 * adding a country to the library auto-extends this UI. No manual switch
 * statements, no hardcoded country lists.
 */
export function DynamicPickerExample() {
  const { locale } = useLocale();
  const countries = useMemo(() => listSupportedCountries(), []);
  const [country, setCountry] = useState<CountryCode>("CO");
  const documents = useMemo(() => listDocuments(country, locale), [country, locale]);
  const [code, setCode] = useState<DocumentTypeCode>(documents[0]?.code ?? "CO_CC");
  const [input, setInput] = useState("");

  const isValid = input.length > 0 ? validate(code, input) : null;

  return (
    <div className="grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas)] p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="dyn-country">Country</Label>
          <Select
            value={country}
            onValueChange={(v) => {
              const cc = v as CountryCode;
              setCountry(cc);
              const next = listDocuments(cc, locale)[0]?.code;
              if (next) setCode(next);
            }}
          >
            <SelectTrigger id="dyn-country">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((cc) => (
                <SelectItem key={cc} value={cc}>
                  <span className="mr-2" aria-hidden>
                    {COUNTRY_META[cc].flag}
                  </span>
                  {COUNTRY_META[cc].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dyn-doc">Document</Label>
          <Select value={code} onValueChange={(v) => setCode(v as DocumentTypeCode)}>
            <SelectTrigger id="dyn-doc">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {documents.map((doc) => (
                <SelectItem key={doc.code} value={doc.code}>
                  {doc.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dyn-input">Input</Label>
          <Input
            id="dyn-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="paste any value"
            className="font-mono"
          />
        </div>
      </div>
      {isValid !== null && (
        <Badge variant={isValid ? "success" : "danger"} className="self-start">
          {isValid ? "valid" : "invalid"}
        </Badge>
      )}
    </div>
  );
}

export const DYNAMIC_PICKER_SOURCE = `import { listSupportedCountries } from "nationid";
import { listDocuments, type Locale } from "nationid/catalog";

// All 54 countries straight from the library. Add a new spec in nationid
// and this dropdown updates with zero changes here.
export function CountryAndDocumentPicker({ locale }: { locale: Locale }) {
  const [country, setCountry] = useState<CountryCode>("CO");
  const documents = listDocuments(country, locale);

  return (
    <>
      <select onChange={(e) => setCountry(e.target.value as CountryCode)}>
        {listSupportedCountries().map((cc) => (
          <option key={cc} value={cc}>{cc}</option>
        ))}
      </select>
      <select>
        {documents.map((doc) => (
          <option key={doc.code} value={doc.code}>
            {doc.displayName} — {doc.longName}
          </option>
        ))}
      </select>
    </>
  );
}`;
