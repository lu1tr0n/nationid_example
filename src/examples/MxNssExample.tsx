import { Check, X } from "lucide-react";
import { normalize, parse } from "nationid";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { cn } from "@/lib/utils.ts";

const SAMPLE_NSS = "12345678903";

interface Segment {
  readonly label: string;
  readonly start: number;
  readonly length: number;
  readonly hint: string;
}

const SEGMENTS: ReadonlyArray<Segment> = [
  { label: "Subdelegación IMSS", start: 0, length: 2, hint: "Office of first registration" },
  { label: "Año de afiliación", start: 2, length: 2, hint: "Last 2 digits of the calendar year" },
  { label: "Año de nacimiento", start: 4, length: 2, hint: "Last 2 digits of the birth year" },
  { label: "Folio progresivo", start: 6, length: 4, hint: "Sequential number per office" },
  { label: "DV (Luhn)", start: 10, length: 1, hint: "Standard Luhn / ISO 7812-1" },
];

/**
 * Showcase: MX_NSS — IMSS Social Security Number (v0.5).
 *
 * Mexican payroll integrations need three IDs per worker: CURP (national ID),
 * RFC (tax), and NSS (social security). v0.5 closed the NSS gap.
 */
export function MxNssExample() {
  const [input, setInput] = useState<string>(SAMPLE_NSS);
  const result = useMemo(() => parse("MX_NSS", input), [input]);
  const digits = useMemo(() => normalize("MX_NSS", input), [input]);

  return (
    <div className="grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas)] p-4">
      <div className="grid gap-1.5">
        <Label htmlFor="nss-input">NSS</Label>
        <Input
          id="nss-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="00000000000"
          spellCheck={false}
          autoComplete="off"
          className="font-mono"
          maxLength={20}
        />
        <p className="text-xs text-[var(--color-ink-muted)]">
          IMSS sometimes prints as <span className="font-mono">XX-XX-XX-XXXX-X</span>; the spec
          accepts both contiguous and grouped forms.
        </p>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={cn(
          "flex items-center gap-3 rounded-[var(--radius-card)] border p-3",
          result.ok
            ? "border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]"
            : "border-[var(--color-danger)]/30 bg-[color-mix(in_oklch,var(--color-danger)_10%,transparent)]",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "grid size-8 place-items-center rounded-full",
            result.ok
              ? "bg-[var(--color-accent)] text-[var(--color-canvas)]"
              : "bg-[var(--color-danger)] text-[var(--color-canvas)]",
          )}
        >
          {result.ok ? <Check className="size-4" /> : <X className="size-4" />}
        </span>
        <div>
          <p className="font-serif text-base leading-tight">
            {result.ok ? "Valid NSS" : "Invalid NSS"}
          </p>
          <p className="font-mono text-xs text-[var(--color-ink-muted)]">
            parse().ok = {String(result.ok)}
            {!result.ok && ` · reason: ${result.reason.kind}`}
          </p>
        </div>
      </div>

      {digits.length === 11 && (
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas-muted)]">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-[var(--color-ink-muted)]">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">
                  Segment
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Position
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Value
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)] font-mono">
              {SEGMENTS.map((seg) => {
                const slice = digits.slice(seg.start, seg.start + seg.length);
                const isDv = seg.label.startsWith("DV");
                return (
                  <tr key={seg.label}>
                    <td className="px-3 py-2 font-sans text-[var(--color-ink)]">{seg.label}</td>
                    <td className="px-3 py-2 text-[11px] text-[var(--color-ink-muted)]">
                      [{seg.start}, {seg.start + seg.length})
                    </td>
                    <td
                      className={cn(
                        "px-3 py-2",
                        isDv ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]",
                      )}
                    >
                      {slice}
                    </td>
                    <td className="px-3 py-2 font-sans text-xs text-[var(--color-ink-muted)]">
                      {seg.hint}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap items-start gap-2 rounded-[var(--radius-card)] border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-3 text-xs text-[var(--color-ink)]">
        <Badge variant="success" className="font-mono">
          ISO/IEC 7812-1 Luhn
        </Badge>
        <p className="flex-1 text-[var(--color-ink-muted)]">
          Identical mod-10 algorithm to credit cards and CA_SIN. Same{" "}
          <span className="font-mono">luhnValid</span> primitive shipped under{" "}
          <span className="font-mono">nationid/algorithms</span>.
        </p>
      </div>
    </div>
  );
}

export const MX_NSS_SOURCE = `import { parse, validate } from "nationid";

// MX_NSS — Número de Seguridad Social (IMSS).
// 11 digits: subdelegación(2) + año-afiliación(2) + año-nacimiento(2)
//            + folio(4) + DV(1, Luhn).

validate("MX_NSS", "12345678903");          // true
validate("MX_NSS", "12-34-56-7890-3");      // true (separators stripped)

// Catch invalid check digits with a typed reason for your error UI.
const r = parse("MX_NSS", "12345678900");
if (!r.ok) {
  r.reason.kind === "invalid_checksum";    // your form can highlight the DV
}

// Tip: pair with extractDOB on MX_CURP to cross-check the worker's
// birth year against bytes 4-5 of the NSS.`;
