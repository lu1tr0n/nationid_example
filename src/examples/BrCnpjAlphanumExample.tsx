import { Check, X } from "lucide-react";
import { format, normalize, parse } from "nationid";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { cn } from "@/lib/utils.ts";

type Mode = "legacy" | "alphanumeric";

const SAMPLES: Readonly<Record<Mode, string>> = {
  // Receita Federal worked example used in test fixtures since v0.1.
  legacy: "11.222.333/0001-81",
  // Alphanumeric specimen (post-2026-07-01) — body 12 chars [A-Z0-9], DV 2 digits.
  // Synthetic, generated against the IN RFB 2.229/2024 algorithm.
  alphanumeric: "12.ABC.345/01DE-35",
};

/**
 * Showcase: BR_CNPJ accepts both the legacy 14-digit form and the post-
 * 2026-07-01 alphanumeric form (IN RFB 2.229/2024).
 *
 * Same `validate("BR_CNPJ", value)` call. Same code path for legacy CNPJs.
 * No client-side migration needed.
 */
export function BrCnpjAlphanumExample() {
  const [mode, setMode] = useState<Mode>("legacy");
  const [input, setInput] = useState<string>(SAMPLES.legacy);

  const result = useMemo(() => parse("BR_CNPJ", input), [input]);
  const normalized = useMemo(() => normalize("BR_CNPJ", input), [input]);
  const formatted = useMemo(() => format("BR_CNPJ", input), [input]);
  const body = normalized.length === 14 ? normalized.slice(0, 12) : normalized;
  const dv = normalized.length === 14 ? normalized.slice(12) : "";

  function handleMode(next: Mode) {
    setMode(next);
    setInput(SAMPLES[next]);
  }

  return (
    <div className="grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas)] p-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={mode === "legacy" ? "accent" : "outline"}
          size="sm"
          onClick={() => handleMode("legacy")}
          aria-pressed={mode === "legacy"}
        >
          Legacy (digit-only)
        </Button>
        <Button
          variant={mode === "alphanumeric" ? "accent" : "outline"}
          size="sm"
          onClick={() => handleMode("alphanumeric")}
          aria-pressed={mode === "alphanumeric"}
        >
          Alphanumeric (post-2026-07-01)
        </Button>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="cnpj-input">CNPJ</Label>
        <Input
          id="cnpj-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          className="font-mono uppercase"
          maxLength={20}
        />
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
            {result.ok ? "Valid CNPJ" : "Invalid CNPJ"}
          </p>
          <p className="font-mono text-xs text-[var(--color-ink-muted)]">
            parse().ok = {String(result.ok)}
            {!result.ok && ` · reason: ${result.reason.kind}`}
          </p>
        </div>
      </div>

      {result.ok && (
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas-muted)] p-3">
            <p className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)]">
              Body (12 chars · alphanumeric)
            </p>
            <p className="font-mono text-base text-[var(--color-ink)]">{body || "—"}</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas-muted)] p-3">
            <p className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)]">
              DV (2 chars · numeric)
            </p>
            <p className="font-mono text-base text-[var(--color-accent)]">{dv || "—"}</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas-muted)] p-3 sm:col-span-2">
            <p className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)]">format()</p>
            <p className="font-mono text-base text-[var(--color-ink)]">{formatted}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-start gap-2 rounded-[var(--radius-card)] border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-3 text-xs text-[var(--color-ink)]">
        <Badge variant="success" className="font-mono">
          backwards compatible
        </Badge>
        <p className="flex-1 text-[var(--color-ink-muted)]">
          Every digit-only CNPJ ever issued (through 2026-06-30) keeps validating under the new
          algorithm. Char value <span className="font-mono">c.charCodeAt(0) − 48</span> reduces
          to plain numeric values for digits, so the weighted mod-11 sum is byte-identical.
        </p>
      </div>
    </div>
  );
}

export const BR_CNPJ_ALPHANUM_SOURCE = `import { parse, validate } from "nationid";

// Same validate() call handles both forms. No conditional logic needed.

// Legacy (digit-only, every CNPJ issued through 2026-06-30).
validate("BR_CNPJ", "11.222.333/0001-81");   // true

// Alphanumeric (issued from 2026-07-01 onward, IN RFB 2.229/2024).
validate("BR_CNPJ", "12.ABC.345/01DE-35");   // true

// parse() reports the same shape regardless of letter content.
const r = parse("BR_CNPJ", "12.ABC.345/01DE-35");
if (r.ok) {
  // r.normalized = "12ABC34501DE35"
  // r.formatted  = "12.ABC.345/01DE-35"
  // r.confidence = "high" — algorithm matches RFB Nota Técnica v1.0
}

// Why no migration is needed:
// For the alphanumeric DV, each char's numeric value is c.charCodeAt(0) - 48.
//   '0'..'9' → 0..9   (identical to the legacy parseInt path)
//   'A'..'Z' → 17..42
// For body chars that are digits, the weighted mod-11 sum reduces byte-for-byte
// to the legacy algorithm. Every legacy CNPJ stays valid.`;
