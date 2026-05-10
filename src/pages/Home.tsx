import { ArrowRight, Cpu, Eye, Globe2, ShieldCheck } from "lucide-react";
import type { CountryCode } from "nationid";
import { listSupportedCountries } from "nationid";
import { Link } from "react-router";
import { CodeBlock } from "@/components/CodeBlock.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { COUNTRY_META } from "@/lib/countries.ts";

const FEATURES: ReadonlyArray<{
  readonly title: string;
  readonly tagline: string;
  readonly icon: typeof Cpu;
  readonly snippet: string;
}> = [
  {
    title: "Validation",
    tagline: "Regex shape and check-digit in one call.",
    icon: ShieldCheck,
    snippet: `import { validate } from "nationid";

validate("BR_CPF", "390.533.447-05"); // true
validate("MX_CURP", "GOMC850315HDFRRR07"); // true`,
  },
  {
    title: "Extract",
    tagline: "Pull DOB, sex, region from documents that encode them.",
    icon: Cpu,
    snippet: `import { extractDOB, extractSex } from "nationid/extract";

extractDOB("MX_CURP", "GOMC850315HDFRRR07");
//   { year: 1985, month: 3, day: 15 }
extractSex("AR_CUIT", "20-12345678-3"); // "M"`,
  },
  {
    title: "PII helpers",
    tagline: "Mask, hash, and last-N for safe storage and display.",
    icon: Eye,
    snippet: `import { hash, lastN, mask } from "nationid/pii";

mask("BR_CPF", "39053344705");        // "***.***.447-05"
lastN("BR_CPF", "39053344705", 4);    // "4705"
await hash("BR_CPF", "39053344705",
           { salt: "tenant-1" });`,
  },
  {
    title: "Catalog",
    tagline: "Localized metadata for every document type.",
    icon: Globe2,
    snippet: `import { listDocuments } from "nationid/catalog";

listDocuments("MX", "es");
//   [{ code: "MX_CURP", displayName: "CURP", … },
//    { code: "MX_RFC_PF", displayName: "RFC", … }]`,
  },
];

export function Home() {
  const countries = listSupportedCountries();
  return (
    <div className="bg-grid">
      <section className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 pb-16 pt-12 sm:px-6 sm:pt-20">
        <Badge variant="muted" className="font-mono">
          v0.3.0 · 22 countries · 0 runtime deps
        </Badge>
        <h1 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          Validate identity documents
          <br />
          <span className="text-[var(--color-accent)]">from 22 countries.</span>
        </h1>
        <p className="max-w-2xl text-base text-[var(--color-ink-muted)] sm:text-lg">
          <span className="font-mono text-[var(--color-ink)]">nationid</span> is a TypeScript-first,
          tree-shakable validator for national ID, tax, voter, and migratory documents — with
          locale-aware error messages and PII-safe storage helpers built in.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="accent" size="lg">
            <Link to="/playground">
              Open the playground <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/examples">See the examples</Link>
          </Button>
        </div>
        <CodeBlock
          className="w-full max-w-3xl"
          lang="bash"
          title="install"
          code="pnpm add nationid"
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl tracking-tight">Four primitives, one library.</h2>
          <Link
            to="/examples"
            className="hidden text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] sm:inline"
          >
            See the example gallery →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-md bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <h3 className="font-serif text-xl tracking-tight">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-[var(--color-ink-muted)]">{feature.tagline}</p>
                </CardHeader>
                <CardContent>
                  <CodeBlock lang="ts" code={feature.snippet} hideCopy />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl tracking-tight">Every supported country.</h2>
          <span className="text-sm text-[var(--color-ink-muted)]">
            tap any flag to browse its documents
          </span>
        </div>
        <ul className="flex flex-wrap gap-2">
          {countries.map((cc: CountryCode) => (
            <li key={cc}>
              <Link
                to={`/countries#${cc}`}
                className="group inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-line)] bg-[var(--color-canvas-muted)] px-3 py-1.5 text-sm transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <span aria-hidden>{COUNTRY_META[cc].flag}</span>
                <span>{COUNTRY_META[cc].name}</span>
                <span className="font-mono text-xs text-[var(--color-ink-muted)] group-hover:text-[var(--color-accent)]">
                  {cc}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
