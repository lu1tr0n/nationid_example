import { Check, X } from "lucide-react";
import { format, normalize, parse, validate, type DocumentTypeCode, type ParseResult } from "nationid";
import { getDocumentInfo } from "nationid/catalog";
import { extractDOB, extractRegion, extractSex, supports } from "nationid/extract";
import { getErrorMessage, type Locale } from "nationid/i18n";
import { hash, lastN, mask } from "nationid/pii";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { CodeBlock } from "@/components/CodeBlock.tsx";
import { cn } from "@/lib/utils.ts";

interface ResultPanelProps {
  readonly code: DocumentTypeCode;
  readonly input: string;
  readonly locale: Locale;
}

interface DerivedResults {
  readonly isValid: boolean;
  readonly parseResult: ParseResult;
  readonly formatted: string;
  readonly normalized: string;
  readonly maskedDisplay: string;
  readonly last4: string;
  readonly dob: ReturnType<typeof extractDOB>;
  readonly sex: ReturnType<typeof extractSex>;
  readonly region: ReturnType<typeof extractRegion>;
  readonly displayName: string;
  readonly errorMessage: string | null;
}

/** Compute every demoable function output in one go. Pure; safe to memoize. */
function deriveResults(code: DocumentTypeCode, input: string, locale: Locale): DerivedResults | null {
  if (input.length === 0) return null;
  try {
    const info = getDocumentInfo(code, locale);
    const displayName = info?.displayName ?? code;
    const parseResult = parse(code, input);
    const isValid = validate(code, input);
    return {
      isValid,
      parseResult,
      formatted: format(code, input),
      normalized: normalize(code, input),
      maskedDisplay: mask(code, input),
      last4: lastN(code, input, 4),
      dob: supports(code, "dob") ? extractDOB(code, input) : null,
      sex: supports(code, "sex") ? extractSex(code, input) : null,
      region: supports(code, "region") ? extractRegion(code, input) : null,
      displayName,
      errorMessage: parseResult.ok
        ? null
        : getErrorMessage(parseResult.reason, locale, displayName),
    };
  } catch {
    // Defensive: getSpec throws on unknown codes; parents pass union members
    // so this shouldn't fire, but we degrade gracefully if it does.
    return null;
  }
}

/** Debounced async hash so typing fast doesn't spam SubtleCrypto. */
function useDebouncedHash(code: DocumentTypeCode, input: string): string | null {
  const [digest, setDigest] = useState<string | null>(null);
  useEffect(() => {
    if (input.length === 0) {
      setDigest(null);
      return;
    }
    let cancelled = false;
    const handle = window.setTimeout(() => {
      hash(code, input, { salt: "demo-tenant" })
        .then((h) => {
          if (!cancelled) setDigest(h);
        })
        .catch(() => {
          if (!cancelled) setDigest(null);
        });
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [code, input]);
  return digest;
}

export function ResultPanel({ code, input, locale }: ResultPanelProps) {
  const results = deriveResults(code, input, locale);
  const digest = useDebouncedHash(code, input);

  if (!results) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-line)] p-8 text-center text-sm text-[var(--color-ink-muted)]">
        Enter a value above to see live results.
      </div>
    );
  }

  const {
    isValid,
    parseResult,
    formatted,
    normalized,
    maskedDisplay,
    last4,
    dob,
    sex,
    region,
    errorMessage,
  } = results;

  const sourceCode = buildSourceSnippet(code, input, locale);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas-muted)] p-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className={cn(
              "grid size-9 place-items-center rounded-full",
              isValid
                ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                : "bg-[color-mix(in_oklch,var(--color-danger)_15%,transparent)] text-[var(--color-danger)]",
            )}
          >
            {isValid ? <Check className="size-5" /> : <X className="size-5" />}
          </span>
          <div>
            <p className="font-serif text-lg leading-tight">
              {isValid ? "Valid" : "Invalid"}
            </p>
            <p className="text-xs text-[var(--color-ink-muted)]">
              {isValid
                ? `Passed regex and check digit for ${results.displayName}.`
                : (errorMessage ?? "Input does not pass the spec.")}
            </p>
          </div>
        </div>
        <Badge variant={isValid ? "success" : "danger"}>
          {isValid ? "validate() = true" : "validate() = false"}
        </Badge>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <KeyValueCard label="format()" value={formatted} mono />
        <KeyValueCard label="normalize()" value={normalized} mono />
        <KeyValueCard label="mask()" value={maskedDisplay} mono />
        <KeyValueCard label="lastN(4)" value={last4 || "—"} mono />
      </div>

      {(dob || sex || region) && (
        <div className="grid gap-3 md:grid-cols-3">
          {dob && (
            <KeyValueCard
              label="extractDOB()"
              value={`${dob.year}-${pad(dob.month)}-${pad(dob.day)}`}
              mono
              hint="from document body"
            />
          )}
          {sex && <KeyValueCard label="extractSex()" value={sex} hint="from document body" />}
          {region && (
            <KeyValueCard
              label="extractRegion()"
              value={region.code}
              hint={`kind: ${region.kind}`}
            />
          )}
        </div>
      )}

      <CodeBlock
        title="parse() result"
        lang="json"
        code={JSON.stringify(parseResult, null, 2)}
        hideCopy
      />

      {digest && (
        <KeyValueCard
          label='hash({ salt: "demo-tenant" })'
          value={digest}
          mono
          hint="SHA-256 hex · safe for indexed lookups"
          truncate
        />
      )}

      <CodeBlock title="source for this panel" lang="ts" code={sourceCode} />
    </div>
  );
}

function KeyValueCard({
  label,
  value,
  hint,
  mono = false,
  truncate = false,
}: {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  readonly mono?: boolean;
  readonly truncate?: boolean;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas-muted)] p-4">
      <p className="font-mono text-[11px] tracking-wide text-[var(--color-ink-muted)]">{label}</p>
      <p
        className={cn(
          "mt-1 break-all text-base text-[var(--color-ink)]",
          mono && "font-mono text-sm",
          truncate && "truncate",
        )}
        title={truncate ? value : undefined}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{hint}</p>}
    </div>
  );
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function buildSourceSnippet(code: DocumentTypeCode, input: string, locale: Locale): string {
  const safeInput = input.replaceAll("`", "\\`");
  const supportsDob = supports(code, "dob");
  const supportsSex = supports(code, "sex");
  const supportsRegion = supports(code, "region");
  return `import { format, normalize, parse, validate } from "nationid";
import { getDocumentInfo } from "nationid/catalog";
import { hash, lastN, mask } from "nationid/pii";${supportsDob || supportsSex || supportsRegion ? '\nimport { extractDOB, extractRegion, extractSex, supports } from "nationid/extract";' : ""}
import { getErrorMessage } from "nationid/i18n";

const code = "${code}" as const;
const input = \`${safeInput}\`;
const locale = "${locale}" as const;

const info = getDocumentInfo(code, locale);
const isValid = validate(code, input);
const result = parse(code, input);

const display = {
  formatted: format(code, input),
  normalized: normalize(code, input),
  masked: mask(code, input),
  last4: lastN(code, input, 4),
};

${supportsDob ? "const dob = supports(code, \"dob\") ? extractDOB(code, input) : null;\n" : ""}${supportsSex ? "const sex = supports(code, \"sex\") ? extractSex(code, input) : null;\n" : ""}${supportsRegion ? "const region = supports(code, \"region\") ? extractRegion(code, input) : null;\n" : ""}
const digest = await hash(code, input, { salt: "demo-tenant" });

const error = result.ok
  ? null
  : getErrorMessage(result.reason, locale, info?.displayName);
`;
}
