import { Lightbulb } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { CodeBlock } from "@/components/CodeBlock.tsx";
import { LocaleSwitcher } from "@/components/LocaleSwitcher.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {
  BR_CNPJ_ALPHANUM_SOURCE,
  BrCnpjAlphanumExample,
} from "@/examples/BrCnpjAlphanumExample.tsx";
import {
  CrossCountrySearchExample,
  CROSS_COUNTRY_SOURCE,
} from "@/examples/CrossCountrySearchExample.tsx";
import {
  DynamicPickerExample,
  DYNAMIC_PICKER_SOURCE,
} from "@/examples/DynamicPickerExample.tsx";
import { HashStorageExample, HASH_STORAGE_SOURCE } from "@/examples/HashStorageExample.tsx";
import { MaskingExample, MASKING_SOURCE } from "@/examples/MaskingExample.tsx";
import { MX_NSS_SOURCE, MxNssExample } from "@/examples/MxNssExample.tsx";
import {
  ReactHookFormExample,
  REACT_HOOK_FORM_SOURCE,
} from "@/examples/ReactHookFormExample.tsx";
import {
  ServerValidationExample,
  SERVER_VALIDATION_SOURCE,
} from "@/examples/ServerValidationExample.tsx";

interface Example {
  readonly title: string;
  readonly subtitle: string;
  readonly callout: ReactNode;
  readonly Component: ComponentType;
  readonly source: string;
  readonly lang: "tsx" | "ts";
}

const EXAMPLES: ReadonlyArray<Example> = [
  {
    title: "React form with Zod",
    subtitle: "react-hook-form delegates the validity decision to nationid.",
    callout:
      "Zod's superRefine calls parse() so the form schema is the single source of truth. Error copy is locale-aware via getErrorMessage — no hard-coded strings to translate.",
    Component: ReactHookFormExample,
    source: REACT_HOOK_FORM_SOURCE,
    lang: "tsx",
  },
  {
    title: "Server-side validation",
    subtitle: "Same parse() call, returning RFC-7807-style JSON.",
    callout:
      "Use parse() at the API boundary. Branch on result.ok, persist result.normalized only, and return getErrorMessage() with the request's Accept-Language header.",
    Component: ServerValidationExample,
    source: SERVER_VALIDATION_SOURCE,
    lang: "ts",
  },
  {
    title: "KYC dashboard masking",
    subtitle: "mask() in the table, lastN() in the search index.",
    callout:
      "mask() preserves separators so a CPF stays recognizable as a CPF. lastN() gives you a small, indexable suffix so support agents can find a record by its visible tail without leaking the full document.",
    Component: MaskingExample,
    source: MASKING_SOURCE,
    lang: "tsx",
  },
  {
    title: "Hash-then-store",
    subtitle: "Per-tenant salt + last4 = lookups without raw PII at rest.",
    callout:
      "Always salt. Unsalted SHA-256 of an 11-digit CPF is rainbow-table-able. The salt should be tenant- or user-scoped so two databases stolen separately don't collide.",
    Component: HashStorageExample,
    source: HASH_STORAGE_SOURCE,
    lang: "ts",
  },
  {
    title: "Dynamic country picker",
    subtitle: "listSupportedCountries() + listDocuments() drive the UI.",
    callout:
      "Add a country to nationid and this dropdown grows automatically. No switch statements to update, no translations to maintain in your app — the catalog ships its own locale strings.",
    Component: DynamicPickerExample,
    source: DYNAMIC_PICKER_SOURCE,
    lang: "tsx",
  },
  {
    title: "Cross-country tax-ID search",
    subtitle: "listDocumentsByPurpose('tax') for multi-country onboarding.",
    callout:
      "Useful for B2B SaaS onboarding when a customer's country isn't known up-front. Filter by purpose and let users search by either local name (RFC) or full name (Registro Federal de Contribuyentes).",
    Component: CrossCountrySearchExample,
    source: CROSS_COUNTRY_SOURCE,
    lang: "tsx",
  },
  {
    title: "BR_CNPJ alphanumeric (IN RFB 2.229/2024)",
    subtitle: "Same validate() call accepts legacy and post-2026-07-01 forms.",
    callout:
      "Receita Federal extended the CNPJ alphabet to [A-Z0-9] effective 2026-07-01 while keeping the same code, mod-11 weights, and 14-character total length. nationid handles both forms transparently — every existing digit-only CNPJ keeps validating because the char-value formula collapses to the legacy parseInt for digits.",
    Component: BrCnpjAlphanumExample,
    source: BR_CNPJ_ALPHANUM_SOURCE,
    lang: "tsx",
  },
  {
    title: "MX_NSS — IMSS Social Security Number",
    subtitle: "11-digit Luhn, the third leg of every Mexican payroll integration.",
    callout:
      "Mexican workers carry three IDs: CURP (national identity), RFC (tax), and NSS (social security). The NSS uses the standard ISO/IEC 7812-1 Luhn check digit — identical to credit cards and Canada's SIN. v0.5 closed the longstanding NSS gap so payroll, IMSS portal, and benefits flows can validate the third ID with the same library.",
    Component: MxNssExample,
    source: MX_NSS_SOURCE,
    lang: "tsx",
  },
];

export function Examples() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">Code examples</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--color-ink-muted)]">
            Production-ready patterns. Each card is interactive and the source below is what runs.
          </p>
        </div>
        <LocaleSwitcher />
      </header>

      <div className="grid gap-10">
        {EXAMPLES.map((example) => {
          const Component = example.Component;
          return (
            <section key={example.title} aria-labelledby={`ex-${slug(example.title)}`}>
              <Card>
                <CardHeader>
                  <CardTitle id={`ex-${slug(example.title)}`}>{example.title}</CardTitle>
                  <CardDescription>{example.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Component />
                  <div className="flex items-start gap-2 rounded-md border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-3 text-sm text-[var(--color-ink)]">
                    <Lightbulb className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                    <p>
                      <span className="font-semibold">Why this is best practice. </span>
                      {example.callout}
                    </p>
                  </div>
                  <CodeBlock title={example.lang === "tsx" ? "component.tsx" : "handler.ts"} lang={example.lang} code={example.source} />
                </CardContent>
              </Card>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
