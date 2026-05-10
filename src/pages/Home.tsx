import { ArrowRight, BookOpen, Cpu, Eye, Globe2, Plane, ShieldCheck, Sparkles } from "lucide-react";
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
  {
    title: "Passports",
    tagline: "22-country passport coverage + ICAO 9303 MRZ primitives.",
    icon: Plane,
    snippet: `import { validate } from "nationid";
import { mrzCheckDigit } from "nationid/algorithms";

validate("CO_PASAPORTE", "AB123456");      // true
mrzCheckDigit("L898902C<");                // 3 (canonical)`,
  },
];

export function Home() {
  const countries = listSupportedCountries();
  return (
    <div className="bg-grid">
      <section className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 pb-16 pt-12 sm:px-6 sm:pt-20">
        <Badge variant="muted" className="font-mono">
          v0.5.0 · 22 countries · 80+ document codes · 0 runtime deps
        </Badge>
        <h1 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          Validate identity documents
          <br />
          <span className="text-[var(--color-accent)]">from 22 countries.</span>
        </h1>
        <p className="max-w-2xl text-base text-[var(--color-ink-muted)] sm:text-lg">
          <span className="font-mono text-[var(--color-ink)]">nationid</span> is a TypeScript-first,
          tree-shakable validator for national ID, tax, voter, social-security, migratory, and
          passport documents — with locale-aware error messages and PII-safe storage helpers built
          in.
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
          <Button asChild variant="outline" size="lg">
            <Link to="/passports">
              Passport playground <Plane aria-hidden />
            </Link>
          </Button>
        </div>
        <CodeBlock
          className="w-full max-w-3xl"
          lang="bash"
          title="install"
          code="pnpm add nationid"
        />
      </section>

      <section
        id="whats-new"
        className="mx-auto max-w-6xl px-4 pb-16 sm:px-6"
        aria-labelledby="whats-new-title"
      >
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-md bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <Sparkles className="size-4" aria-hidden />
              </span>
              <h2 id="whats-new-title" className="font-serif text-2xl tracking-tight">
                What's new
              </h2>
            </div>
            <p className="text-sm text-[var(--color-ink-muted)]">
              Recent releases that shaped the showcase you're looking at.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas)] p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="success" className="font-mono">
                  v0.4.0
                </Badge>
                <span className="text-xs text-[var(--color-ink-muted)]">9 new countries</span>
              </div>
              <p className="text-sm text-[var(--color-ink-muted)]">
                Bolivia, Ecuador, Paraguay, Nicaragua, Panamá, Uruguay, Canada, Portugal, Venezuela
                — pushing total coverage from 13 to 22 countries with their identity, tax, and
                migratory specs.
              </p>
              <Link
                to="/countries"
                className="mt-3 inline-flex items-center gap-1 text-sm text-[var(--color-accent)] hover:underline"
              >
                Browse the catalog <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
            <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas)] p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="success" className="font-mono">
                  v0.5.0
                </Badge>
                <span className="text-xs text-[var(--color-ink-muted)]">passports + IMSS + alphanumeric CNPJ</span>
              </div>
              <ul className="space-y-1.5 text-sm text-[var(--color-ink-muted)]">
                <li>
                  <Link to="/passports" className="text-[var(--color-accent)] hover:underline">
                    22 passport specs
                  </Link>{" "}
                  — one <code className="font-mono text-xs">{"<CC>_PASAPORTE"}</code> per country.
                </li>
                <li>
                  <Link to="/mrz" className="text-[var(--color-accent)] hover:underline">
                    ICAO 9303 MRZ calculator
                  </Link>{" "}
                  exposed via <code className="font-mono text-xs">nationid/algorithms</code>.
                </li>
                <li>
                  <Link to="/examples" className="text-[var(--color-accent)] hover:underline">
                    BR_CNPJ alphanumeric
                  </Link>{" "}
                  per IN RFB 2.229/2024 (effective 2026-07-01) and{" "}
                  <Link to="/examples" className="text-[var(--color-accent)] hover:underline">
                    MX_NSS
                  </Link>{" "}
                  Luhn validator.
                </li>
              </ul>
            </div>
          </CardContent>
          <div className="border-t border-[var(--color-line)] bg-[var(--color-canvas-muted)] px-4 py-2.5 text-xs text-[var(--color-ink-muted)]">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="size-3.5" aria-hidden /> Read the full changelog on GitHub.
            </span>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl tracking-tight">Five primitives, one library.</h2>
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
