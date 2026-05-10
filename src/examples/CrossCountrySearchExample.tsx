import { listDocumentsByPurpose, type DocumentInfo } from "nationid/catalog";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { COUNTRY_META } from "@/lib/countries.ts";
import { useLocale } from "@/lib/i18n.tsx";

const PURPOSES = ["tax", "identity", "voter"] as const;
type Purpose = (typeof PURPOSES)[number];

/**
 * "Show me all tax IDs across every country" — useful for global B2B
 * onboarding, sanctions screening, or pan-LATAM accounting tools where the
 * user picks "their" tax document from one consolidated list.
 */
export function CrossCountrySearchExample() {
  const { locale } = useLocale();
  const [purpose, setPurpose] = useState<Purpose>("tax");
  const [query, setQuery] = useState("");

  const docs = useMemo(() => listDocumentsByPurpose(purpose, locale), [purpose, locale]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return docs;
    return docs.filter(
      (d) =>
        d.displayName.toLowerCase().includes(q) ||
        d.longName.toLowerCase().includes(q) ||
        d.knownAs.some((k) => k.toLowerCase().includes(q)) ||
        d.country.toLowerCase().includes(q),
    );
  }, [docs, query]);

  return (
    <div className="grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas)] p-4">
      <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
        <div className="space-y-1.5">
          <Label htmlFor="ccs-purpose">Purpose</Label>
          <Select value={purpose} onValueChange={(v) => setPurpose(v as Purpose)}>
            <SelectTrigger id="ccs-purpose">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PURPOSES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ccs-search">Search</Label>
          <Input
            id="ccs-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="filter by name, alias, or country"
          />
        </div>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doc: DocumentInfo) => (
          <li
            key={doc.code}
            className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas-muted)] p-3"
          >
            <span aria-hidden className="text-lg leading-none">
              {COUNTRY_META[doc.country].flag}
            </span>
            <div className="min-w-0">
              <p className="font-mono text-sm font-semibold">{doc.displayName}</p>
              <p className="truncate text-xs text-[var(--color-ink-muted)]">{doc.longName}</p>
              <Badge variant="muted" className="mt-1 font-mono text-[10px]">
                {doc.code}
              </Badge>
            </div>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className="py-6 text-center text-sm text-[var(--color-ink-muted)]">
          No matches. Try a different search.
        </p>
      )}
    </div>
  );
}

export const CROSS_COUNTRY_SOURCE = `import { listDocumentsByPurpose } from "nationid/catalog";

// Single global "tax ID" picker for a multi-country SaaS onboarding flow.
// Returns 14 tax-scoped documents in one list across LATAM, Iberia, NA.
const taxOptions = listDocumentsByPurpose("tax", "en");

// taxOptions =>
//  [{ code: "SV_NIT",     displayName: "NIT",  country: "SV", … },
//   { code: "MX_RFC_PF",  displayName: "RFC",  country: "MX", … },
//   { code: "BR_CNPJ",    displayName: "CNPJ", country: "BR", … },
//   …]

<select>
  {taxOptions.map((doc) => (
    <option key={doc.code} value={doc.code}>
      {doc.country} — {doc.displayName}
    </option>
  ))}
</select>`;
