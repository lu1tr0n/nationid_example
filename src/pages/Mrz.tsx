import { Plane, Wand2 } from "lucide-react";
import { mrzCharValue, mrzCheckDigit, toMrzField9, validateMrzNumber } from "nationid/algorithms";
import { useMemo, useState } from "react";
import { CodeBlock } from "@/components/CodeBlock.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

type Mode = "compute" | "validate";

interface ComputeOutcome {
  readonly kind: "compute";
  readonly input: string;
  readonly checkDigit: number | null;
  readonly error: string | null;
}

interface ValidateOutcome {
  readonly kind: "validate";
  readonly input: string;
  readonly valid: boolean;
}

type Outcome = ComputeOutcome | ValidateOutcome;

const ICAO_SPECIMEN = "L898902C<";

/**
 * ICAO 9303 MRZ check-digit calculator.
 *
 * `mrzCheckDigit("L898902C<")` returns 3 — the canonical worked example
 * cited in ICAO Doc 9303 Part 3 §4.9.
 */
function computeOutcome(input: string, mode: Mode): Outcome {
  const upper = input.toUpperCase();
  if (mode === "validate") {
    return { kind: "validate", input: upper, valid: validateMrzNumber(upper) };
  }
  if (upper.length === 0) {
    return { kind: "compute", input: upper, checkDigit: null, error: null };
  }
  try {
    const cd = mrzCheckDigit(upper);
    return { kind: "compute", input: upper, checkDigit: cd, error: null };
  } catch (err) {
    return {
      kind: "compute",
      input: upper,
      checkDigit: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

const SOURCE_SNIPPET = `import {
  mrzCharValue,
  mrzCheckDigit,
  toMrzField9,
  validateMrzNumber,
} from "nationid/algorithms";

// 1) Compute the check digit for a 9-char MRZ field.
mrzCheckDigit("L898902C<");           // 3 (ICAO 9303 specimen)

// 2) Validate the 10-char body+CD form.
validateMrzNumber("L898902C<3");      // true

// 3) Pad a printed passport number (<9 chars) with the
//    canonical "<" filler.
toMrzField9("AB1234");                // "AB1234<<<"

// 4) Inspect the per-character numeric value used by the
//    weighted sum (W = [7,3,1] cycled).
mrzCharValue("L");                    // 21
mrzCharValue("<");                    // 0
mrzCharValue("0");                    // 0`;

export function Mrz() {
  const [mode, setMode] = useState<Mode>("compute");
  const [input, setInput] = useState<string>(ICAO_SPECIMEN);

  const outcome = useMemo(() => computeOutcome(input, mode), [input, mode]);

  const charBreakdown = useMemo(() => {
    return Array.from(input.toUpperCase()).map((ch, i) => ({
      index: i,
      char: ch,
      value: mrzCharValue(ch),
      weight: [7, 3, 1][i % 3] as number,
    }));
  }, [input]);

  function handleSpecimen() {
    setMode("compute");
    setInput(ICAO_SPECIMEN);
  }

  function handlePadTo9() {
    if (input.length >= 9) return;
    try {
      setInput(toMrzField9(input));
    } catch {
      // Invalid characters — surface in the outcome panel via mrzCheckDigit error path.
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-md bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <Plane className="size-4" aria-hidden />
          </span>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">MRZ calculator</h1>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-[var(--color-ink-muted)]">
          Live ICAO 9303 Machine Readable Zone check-digit calculator. The same primitives that
          back nationid's passport specs, exported under{" "}
          <code className="rounded bg-[var(--color-canvas-muted)] px-1 font-mono text-xs">
            nationid/algorithms
          </code>{" "}
          for direct use in your own passport, visa, or travel-document workflows.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,420px)]">
        <Card>
          <CardHeader>
            <CardTitle>Live calculator</CardTitle>
            <CardDescription>
              Type a 9-character document body to compute its check digit, or switch to
              <span className="mx-1 font-mono">validate</span> mode to verify the 10-character
              body + CD form.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={mode === "compute" ? "accent" : "outline"}
                size="sm"
                onClick={() => setMode("compute")}
                aria-pressed={mode === "compute"}
              >
                Compute (9 chars)
              </Button>
              <Button
                variant={mode === "validate" ? "accent" : "outline"}
                size="sm"
                onClick={() => setMode("validate")}
                aria-pressed={mode === "validate"}
              >
                Validate (10 chars)
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSpecimen}>
                <Wand2 aria-hidden />
                Worked example
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePadTo9}
                disabled={input.length >= 9}
                title="Right-pad to 9 chars with `<` filler"
              >
                Pad to 9
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mrz-input">
                MRZ field {mode === "compute" ? "(up to 9 chars)" : "(10 chars: body + CD)"}
              </Label>
              <Input
                id="mrz-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "compute" ? "L898902C<" : "L898902C<3"}
                spellCheck={false}
                autoComplete="off"
                className="font-mono uppercase"
                maxLength={mode === "compute" ? 9 : 10}
                aria-describedby="mrz-help"
              />
              <p id="mrz-help" className="text-xs text-[var(--color-ink-muted)]">
                MRZ alphabet: digits <span className="font-mono">0-9</span>, uppercase{" "}
                <span className="font-mono">A-Z</span>, filler <span className="font-mono">{"<"}</span>.
              </p>
            </div>

            <OutcomePanel outcome={outcome} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Snippet</CardTitle>
            <CardDescription>
              Tree-shakable import. Each primitive is independently usable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock lang="ts" title="mrz.ts" code={SOURCE_SNIPPET} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Per-character breakdown</CardTitle>
          <CardDescription>
            Weighted sum: <span className="font-mono">Σ value(c<sub>i</sub>) · W[i mod 3]</span>{" "}
            with cyclic weights <span className="font-mono">W = [7, 3, 1]</span>. Check digit ={" "}
            <span className="font-mono">sum mod 10</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {charBreakdown.length === 0 ? (
            <p className="text-sm text-[var(--color-ink-muted)]">Type a character to see the breakdown.</p>
          ) : (
            <BreakdownTable chars={charBreakdown} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OutcomePanel({ outcome }: { readonly outcome: Outcome }) {
  if (outcome.kind === "compute") {
    if (outcome.error) {
      return (
        <div
          role="status"
          className="rounded-[var(--radius-card)] border border-[var(--color-danger)]/30 bg-[color-mix(in_oklch,var(--color-danger)_10%,transparent)] p-4 text-sm"
        >
          <p className="font-mono text-[var(--color-danger)]">{outcome.error}</p>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            mrzCheckDigit() throws on chars outside the MRZ alphabet.
          </p>
        </div>
      );
    }
    if (outcome.checkDigit === null) {
      return (
        <p className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas-muted)] p-4 text-sm text-[var(--color-ink-muted)]">
          Enter at least one character.
        </p>
      );
    }
    return (
      <div
        role="status"
        aria-live="polite"
        className="grid gap-2 rounded-[var(--radius-card)] border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-4"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-accent)]">
          Check digit
        </p>
        <p className="font-mono text-3xl text-[var(--color-ink)]">{outcome.checkDigit}</p>
        <p className="text-xs text-[var(--color-ink-muted)]">
          Full MRZ field:{" "}
          <span className="font-mono text-[var(--color-ink)]">
            {outcome.input}
            <span className="text-[var(--color-accent)]">{outcome.checkDigit}</span>
          </span>
        </p>
      </div>
    );
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid gap-1 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas-muted)] p-4"
    >
      <div className="flex items-center gap-2">
        <Badge variant={outcome.valid ? "success" : "danger"}>
          {outcome.valid ? "valid" : "invalid"}
        </Badge>
        <span className="font-mono text-sm text-[var(--color-ink)]">{outcome.input}</span>
      </div>
      <p className="text-xs text-[var(--color-ink-muted)]">
        validateMrzNumber checks length === 10, MRZ-alphabet body, decimal CD, and{" "}
        <span className="font-mono">mrzCheckDigit(body) === Number(cd)</span>.
      </p>
    </div>
  );
}

function BreakdownTable({
  chars,
}: {
  readonly chars: ReadonlyArray<{
    readonly index: number;
    readonly char: string;
    readonly value: number;
    readonly weight: number;
  }>;
}) {
  const total = chars.reduce(
    (acc, c) => acc + (c.value < 0 ? 0 : c.value * c.weight),
    0,
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wide text-[var(--color-ink-muted)]">
          <tr>
            <th scope="col" className="py-2 pr-3 font-medium">
              i
            </th>
            <th scope="col" className="py-2 pr-3 font-medium">
              char
            </th>
            <th scope="col" className="py-2 pr-3 font-medium">
              value
            </th>
            <th scope="col" className="py-2 pr-3 font-medium">
              weight
            </th>
            <th scope="col" className="py-2 pr-3 font-medium">
              product
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-line)] font-mono">
          {chars.map((c) => {
            const invalid = c.value < 0;
            return (
              <tr key={c.index} className={invalid ? "text-[var(--color-danger)]" : ""}>
                <td className="py-1.5 pr-3 text-[var(--color-ink-muted)]">{c.index}</td>
                <td className="py-1.5 pr-3">{c.char === " " ? "·" : c.char}</td>
                <td className="py-1.5 pr-3">{invalid ? "—" : c.value}</td>
                <td className="py-1.5 pr-3">{c.weight}</td>
                <td className="py-1.5 pr-3">{invalid ? "—" : c.value * c.weight}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="text-sm">
          <tr className="border-t-2 border-[var(--color-line)]">
            <td colSpan={4} className="py-2 pr-3 text-right font-medium text-[var(--color-ink-muted)]">
              Σ products
            </td>
            <td className="py-2 pr-3 font-mono">{total}</td>
          </tr>
          <tr>
            <td colSpan={4} className="py-2 pr-3 text-right font-medium text-[var(--color-ink-muted)]">
              mod 10 → check digit
            </td>
            <td className="py-2 pr-3 font-mono text-[var(--color-accent)]">{total % 10}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
