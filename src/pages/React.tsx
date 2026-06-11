import {
  CountrySelect,
  DocumentDisplay,
  DocumentInput,
  DocumentTypeSelect,
  useCountries,
  useDocumentSpec,
  useDocumentTypes,
  useDocumentValidate,
} from "@nationid/react";
import { createDocumentValidator, NationidController } from "@nationid/react/rhf";
import { ArrowUpRight, Boxes, Code2, FormInput, Sparkles, Zap } from "lucide-react";
import type { CountryCode, DocumentTypeCode, ParseResult } from "nationid";
import { getErrorMessage, type Locale } from "nationid/i18n";
import { useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { CodeBlock } from "@/components/CodeBlock.tsx";
import { LocaleSwitcher } from "@/components/LocaleSwitcher.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useLocale } from "@/lib/i18n.tsx";
import { getSample } from "@/lib/sample-inputs.ts";

const REPO_URL = "https://github.com/lu1tr0n/nationid-react";
const NPM_URL = "https://www.npmjs.com/package/@nationid/react";

const INPUT_CLASS =
  "block w-full rounded-md border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2 text-sm text-[var(--color-ink)] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] aria-[invalid=true]:border-[var(--color-danger)] aria-[invalid=true]:focus-visible:ring-[var(--color-danger)]";

const ERROR_CLASS = "mt-1 text-xs text-[var(--color-danger)]";

const SELECT_CLASS =
  "block w-full rounded-md border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2 text-sm text-[var(--color-ink)] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]";

const INSTALL_SNIPPET = `pnpm add @nationid/react nationid
# or
npm install @nationid/react nationid
# or
yarn add @nationid/react nationid`;

const DOCUMENT_INPUT_SNIPPET = `import { useState } from "react";
import { DocumentInput, CountrySelect, DocumentTypeSelect } from "@nationid/react";
import "@nationid/react/styles.css";
import type { CountryCode, DocumentTypeCode, ParseResult } from "nationid";

export function Field() {
  const [country, setCountry] = useState<CountryCode | "">("MX");
  const [code, setCode] = useState<DocumentTypeCode | "">("MX_RFC_PF");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);

  return (
    <form>
      <CountrySelect value={country} onChange={setCountry} locale="es" />
      {country && (
        <DocumentTypeSelect
          country={country}
          value={code}
          onChange={setCode}
          locale="es"
        />
      )}
      {code && (
        <DocumentInput
          code={code}
          value={value}
          onChange={setValue}
          onValidate={setResult}
          locale="es"
          formatOnBlur
        />
      )}
    </form>
  );
}`;

const DOCUMENT_DISPLAY_SNIPPET = `import { DocumentDisplay } from "@nationid/react";

// Renders the canonical formatted value (e.g. "012.345.678-9" for SV_DUI).
// Falls back to the raw string when the input does not validate.
<DocumentDisplay code="SV_DUI" value="045678903" />

// Pass \`as="code"\` for tabular contexts, or \`fallback\` to style invalid input:
<DocumentDisplay
  code="BR_CPF"
  value={row.cpf}
  as="code"
  fallback={(raw) => <span className="text-muted">{raw} (invalid)</span>}
/>`;

const USE_DOCUMENT_VALIDATE_SNIPPET = `import { useDocumentValidate } from "@nationid/react";

export function CustomField({ code }: { code: DocumentTypeCode }) {
  // The four functions are stable per \`code\` — safe to pass to memoized children.
  const { validate, parse, format, normalize } = useDocumentValidate(code);

  return (
    <input
      onBlur={(event) => {
        const result = parse(event.target.value);
        if (result.ok) {
          event.target.value = format(event.target.value);
          // persist result.normalized
        } else {
          // surface result.reason
        }
      }}
    />
  );
}`;

const NATIONID_CONTROLLER_SNIPPET = `import { useForm } from "react-hook-form";
import { NationidController } from "@nationid/react/rhf";

type FormValues = { rfc: string };

export function Form() {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { rfc: "" },
    mode: "onBlur",
  });

  return (
    <form onSubmit={handleSubmit((v) => console.log(v))}>
      <NationidController
        name="rfc"
        control={control}
        code="MX_RFC_PF"
        locale="es"
        rules={{ required: "El RFC es requerido" }}
      />
      <button type="submit">Guardar</button>
    </form>
  );
}`;

const CREATE_VALIDATOR_SNIPPET = `import { useForm } from "react-hook-form";
import { createDocumentValidator } from "@nationid/react/rhf";

type FormValues = { dui: string };

export function Form() {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { dui: "" },
  });

  return (
    <form onSubmit={handleSubmit((v) => console.log(v))}>
      <input
        {...register("dui", {
          required: "El DUI es requerido",
          validate: createDocumentValidator("SV_DUI", "es"),
        })}
      />
      {formState.errors.dui && <span>{formState.errors.dui.message}</span>}
      <button type="submit">Guardar</button>
    </form>
  );
}`;

function safeSample(code: DocumentTypeCode | ""): string {
  if (!code) return "";
  return getSample(code) ?? "";
}

function ParseResultPanel({
  result,
  locale,
}: {
  readonly result: ParseResult | null;
  readonly locale: Locale;
}) {
  if (!result) {
    return (
      <p className="font-mono text-xs text-[var(--color-ink-muted)]">
        Tab out of the field to validate. The <code>onValidate</code> callback fires once per blur with the full <code>ParseResult</code>.
      </p>
    );
  }
  if (result.ok) {
    return (
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <Badge variant="success">ok</Badge>
          <span className="font-mono text-[var(--color-ink-muted)]">{result.code}</span>
        </div>
        <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 font-mono">
          <dt className="text-[var(--color-ink-muted)]">normalized</dt>
          <dd>{result.normalized}</dd>
          <dt className="text-[var(--color-ink-muted)]">formatted</dt>
          <dd>{result.formatted}</dd>
        </dl>
      </div>
    );
  }
  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center gap-2">
        <Badge variant="danger">invalid</Badge>
        <span className="font-mono text-[var(--color-ink-muted)]">{result.code}</span>
      </div>
      <p className="font-mono text-[var(--color-danger)]">{getErrorMessage(result.reason, locale)}</p>
      <p className="font-mono text-[10px] text-[var(--color-ink-muted)]">
        reason.kind = "{result.reason.kind}"
      </p>
    </div>
  );
}

function DocumentInputSection() {
  const { locale } = useLocale();
  const [country, setCountry] = useState<CountryCode | "">("MX");
  const [code, setCode] = useState<DocumentTypeCode | "">("MX_RFC_PF");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);

  const countryFieldId = useId();
  const codeFieldId = useId();
  const docFieldId = useId();
  const spec = useDocumentSpec(code || "MX_RFC_PF");

  const fillSample = () => {
    const sample = safeSample(code);
    if (sample) {
      setValue(sample);
      setResult(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FormInput aria-hidden className="size-4 text-[var(--color-accent)]" />
              &lt;DocumentInput&gt;
            </CardTitle>
            <CardDescription>
              Controlled, accessible input that validates on blur and wires the error through
              <code className="mx-1 rounded bg-[var(--color-canvas-muted)] px-1 py-0.5 font-mono text-xs">aria-invalid</code>
              +
              <code className="mx-1 rounded bg-[var(--color-canvas-muted)] px-1 py-0.5 font-mono text-xs">aria-describedby</code>
              + <code className="mx-1 rounded bg-[var(--color-canvas-muted)] px-1 py-0.5 font-mono text-xs">role="alert"</code>.
            </CardDescription>
          </div>
          <LocaleSwitcher />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor={countryFieldId}>Country</Label>
            <CountrySelect
              id={countryFieldId}
              value={country}
              onChange={(next) => {
                setCountry(next);
                setCode("");
                setValue("");
                setResult(null);
              }}
              locale={locale}
              className={SELECT_CLASS}
            />
          </div>
          <div>
            <Label htmlFor={codeFieldId}>Document type</Label>
            {country ? (
              <DocumentTypeSelect
                id={codeFieldId}
                country={country}
                value={code}
                onChange={(next) => {
                  setCode(next);
                  setValue("");
                  setResult(null);
                }}
                locale={locale}
                className={SELECT_CLASS}
              />
            ) : (
              <p className="pt-2 text-xs text-[var(--color-ink-muted)]">Pick a country first.</p>
            )}
          </div>
        </div>

        {code ? (
          <div className="grid gap-4 md:grid-cols-[1fr_minmax(0,18rem)]">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor={docFieldId}>{code}</Label>
                {safeSample(code) ? (
                  <Button type="button" variant="ghost" size="sm" onClick={fillSample}>
                    <Sparkles aria-hidden className="size-3.5" />
                    Try a sample
                  </Button>
                ) : null}
              </div>
              <DocumentInput
                id={docFieldId}
                code={code}
                value={value}
                onChange={(next) => {
                  setValue(next);
                  setResult(null);
                }}
                onValidate={setResult}
                locale={locale}
                placeholder={spec ? `Example: ${safeSample(code) || "—"}` : undefined}
                className={INPUT_CLASS}
                errorClassName={ERROR_CLASS}
              />
              <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
                Reformats on blur via <code className="font-mono">spec.format()</code>. Toggle <code className="font-mono">formatOnBlur=&#123;false&#125;</code> to keep the raw value.
              </p>
            </div>
            <aside className="rounded-md border border-[var(--color-line)] bg-[var(--color-canvas-muted)] p-3">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                onValidate payload
              </p>
              <ParseResultPanel result={result} locale={locale} />
            </aside>
          </div>
        ) : null}

        <CodeBlock code={DOCUMENT_INPUT_SNIPPET} lang="tsx" title="DocumentInput.tsx" />
      </CardContent>
    </Card>
  );
}

function DocumentDisplaySection() {
  const [code, setCode] = useState<DocumentTypeCode>("SV_DUI");
  const [value, setValue] = useState(safeSample("SV_DUI") || "045678903");
  const fieldId = useId();
  const codeId = useId();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 aria-hidden className="size-4 text-[var(--color-accent)]" />
          &lt;DocumentDisplay&gt;
        </CardTitle>
        <CardDescription>
          Read-only, accessible formatter. Normalises with <code className="font-mono">spec.format()</code> so raw and pre-formatted inputs render identically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,16rem)_1fr]">
          <div>
            <Label htmlFor={codeId}>Code</Label>
            <select
              id={codeId}
              className={SELECT_CLASS}
              value={code}
              onChange={(event) => {
                const next = event.target.value as DocumentTypeCode;
                setCode(next);
                setValue(getSample(next) ?? "");
              }}
            >
              <option value="SV_DUI">SV_DUI</option>
              <option value="BR_CPF">BR_CPF</option>
              <option value="BR_CNPJ">BR_CNPJ</option>
              <option value="MX_CURP">MX_CURP</option>
              <option value="CO_NIT">CO_NIT</option>
              <option value="AR_CUIT">AR_CUIT</option>
            </select>
          </div>
          <div>
            <Label htmlFor={fieldId}>Raw value</Label>
            <input
              id={fieldId}
              type="text"
              className={INPUT_CLASS}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Type any raw or pre-formatted value"
              aria-describedby={`${fieldId}-help`}
            />
            <p id={`${fieldId}-help`} className="mt-2 text-xs text-[var(--color-ink-muted)]">
              The component formats on render; the underlying value stays raw.
            </p>
          </div>
        </div>

        <div className="grid gap-3 rounded-md border border-[var(--color-line)] bg-[var(--color-canvas-muted)] p-4 sm:grid-cols-2">
          <dl>
            <dt className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
              as="span" (default)
            </dt>
            <dd className="mt-1 font-mono text-sm">
              <DocumentDisplay code={code} value={value} />
            </dd>
          </dl>
          <dl>
            <dt className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
              as="code"
            </dt>
            <dd className="mt-1">
              <DocumentDisplay
                as="code"
                code={code}
                value={value}
                className="rounded bg-[var(--color-canvas)] px-2 py-1 font-mono text-sm"
              />
            </dd>
          </dl>
        </div>

        <CodeBlock code={DOCUMENT_DISPLAY_SNIPPET} lang="tsx" title="DocumentDisplay.tsx" />
      </CardContent>
    </Card>
  );
}

type HookOp = "parse" | "validate" | "format" | "normalize";

function HookSection() {
  const [code] = useState<DocumentTypeCode>("MX_CURP");
  const [value, setValue] = useState(safeSample("MX_CURP") || "GOMC850315HDFRRR07");
  const [op, setOp] = useState<HookOp>("parse");
  const validator = useDocumentValidate(code);
  const fieldId = useId();

  const output = useMemo(() => {
    if (!value) return "—";
    try {
      switch (op) {
        case "parse":
          return JSON.stringify(validator.parse(value), null, 2);
        case "validate":
          return String(validator.validate(value));
        case "format":
          return validator.format(value);
        case "normalize":
          return validator.normalize(value);
      }
    } catch (error) {
      return error instanceof Error ? error.message : String(error);
    }
  }, [op, validator, value]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap aria-hidden className="size-4 text-[var(--color-accent)]" />
          useDocumentValidate
        </CardTitle>
        <CardDescription>
          When the bundled components don't fit, the hook returns four stable, memoised functions you can drive any UI with.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-[1fr_minmax(0,12rem)]">
          <div>
            <Label htmlFor={fieldId}>{code}</Label>
            <input
              id={fieldId}
              type="text"
              className={INPUT_CLASS}
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
          <div>
            <Label>Operation</Label>
            <div role="group" aria-label="Operation" className="flex flex-wrap gap-1">
              {(["parse", "validate", "format", "normalize"] as const).map((candidate) => (
                <Button
                  key={candidate}
                  type="button"
                  size="sm"
                  variant={candidate === op ? "default" : "outline"}
                  onClick={() => setOp(candidate)}
                >
                  {candidate}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <CodeBlock code={output} lang={op === "parse" ? "json" : "ts"} hideCopy title="Result" />
        <CodeBlock code={USE_DOCUMENT_VALIDATE_SNIPPET} lang="tsx" title="useDocumentValidate.tsx" />
      </CardContent>
    </Card>
  );
}

function ControllerForm() {
  const { locale } = useLocale();
  const { control, handleSubmit, reset, formState } = useForm<{ rfc: string }>({
    defaultValues: { rfc: "" },
    mode: "onBlur",
  });
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmit((values) => {
        setSubmitted(values.rfc);
      })}
      aria-label="NationidController demo"
    >
      <div>
        <Label htmlFor="rfc">MX_RFC_PF</Label>
        <NationidController
          name="rfc"
          control={control}
          code="MX_RFC_PF"
          locale={locale}
          rules={{ required: locale === "es" ? "Requerido" : "Required" }}
          className={INPUT_CLASS}
          errorClassName={ERROR_CLASS}
          placeholder="VECJ880326XXX"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm">
          Submit
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            reset();
            setSubmitted(null);
          }}
        >
          Reset
        </Button>
        {formState.isSubmitSuccessful && submitted ? (
          <Badge variant="success">submitted: {submitted}</Badge>
        ) : null}
      </div>
    </form>
  );
}

function ValidatorForm() {
  const { locale } = useLocale();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<{ dui: string }>({
    defaultValues: { dui: "" },
  });
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmit((values) => {
        setSubmitted(values.dui);
      })}
      aria-label="createDocumentValidator demo"
    >
      <div>
        <Label htmlFor="dui">SV_DUI</Label>
        <input
          id="dui"
          type="text"
          className={INPUT_CLASS}
          placeholder="04567890-3"
          aria-invalid={Boolean(errors.dui)}
          aria-describedby={errors.dui ? "dui-err" : undefined}
          {...register("dui", {
            required: locale === "es" ? "Requerido" : "Required",
            validate: createDocumentValidator("SV_DUI", locale),
          })}
        />
        {errors.dui ? (
          <span id="dui-err" role="alert" className={ERROR_CLASS}>
            {errors.dui.message}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm">
          Submit
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            reset();
            setSubmitted(null);
          }}
        >
          Reset
        </Button>
        {isSubmitSuccessful && submitted ? (
          <Badge variant="success">submitted: {submitted}</Badge>
        ) : null}
      </div>
    </form>
  );
}

function RhfSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Boxes aria-hidden className="size-4 text-[var(--color-accent)]" />
          react-hook-form integration
        </CardTitle>
        <CardDescription>
          Two adapters under <code className="font-mono">@nationid/react/rhf</code>. Pick the one that matches how your form is already wired — both surface localised errors through RHF's native error machinery.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-3">
            <header className="flex items-center justify-between gap-2">
              <h3 className="font-medium">NationidController</h3>
              <Badge variant="muted">Controller-style</Badge>
            </header>
            <p className="text-sm text-[var(--color-ink-muted)]">
              Drop-in <code className="font-mono">&lt;NationidController name="rfc" control=&#123;control&#125; code="MX_RFC_PF" /&gt;</code>. Derives the <code className="font-mono">validate</code> rule from the code + locale automatically.
            </p>
            <ControllerForm />
          </section>
          <section className="space-y-3">
            <header className="flex items-center justify-between gap-2">
              <h3 className="font-medium">createDocumentValidator</h3>
              <Badge variant="muted">register-style</Badge>
            </header>
            <p className="text-sm text-[var(--color-ink-muted)]">
              Bring your own <code className="font-mono">&lt;input&gt;</code> and call <code className="font-mono">register(name, &#123; validate: createDocumentValidator(code, locale) &#125;)</code>. Useful when the form already wraps a design system input.
            </p>
            <ValidatorForm />
          </section>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock code={NATIONID_CONTROLLER_SNIPPET} lang="tsx" title="NationidController.tsx" />
          <CodeBlock code={CREATE_VALIDATOR_SNIPPET} lang="tsx" title="createDocumentValidator.tsx" />
        </div>
      </CardContent>
    </Card>
  );
}

function CatalogHooksAside() {
  const { locale } = useLocale();
  const countries = useCountries(locale);
  const [country, setCountry] = useState<CountryCode>("MX");
  const types = useDocumentTypes(country, locale);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Catalog hooks</CardTitle>
        <CardDescription>
          <code className="font-mono">useCountries(locale)</code> and <code className="font-mono">useDocumentTypes(country, locale)</code> expose the same catalog the bundled selects use — handy when you need a non-<code>&lt;select&gt;</code> picker (combobox, command palette, mobile sheet).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-[var(--color-ink-muted)]">
          <strong className="text-[var(--color-ink)]">{countries.length}</strong> countries, currently showing{" "}
          <strong className="text-[var(--color-ink)]">{types.length}</strong> document types for{" "}
          <select
            aria-label="Country"
            className="rounded border border-[var(--color-line)] bg-[var(--color-canvas)] px-2 py-1 font-mono text-xs"
            value={country}
            onChange={(event) => setCountry(event.target.value as CountryCode)}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} · {c.name}
              </option>
            ))}
          </select>
          .
        </p>
        <ul className="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2 md:grid-cols-3">
          {types.map((type) => (
            <li
              key={type.code}
              className="rounded border border-[var(--color-line)] bg-[var(--color-canvas-muted)] px-2 py-1 font-mono"
              title={type.displayName}
            >
              {type.code}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function React() {
  return (
    <div id="main-content" className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Badge variant="muted">react</Badge>
          <h1 className="text-3xl font-serif font-medium tracking-tight">@nationid/react</h1>
          <p className="max-w-2xl text-[var(--color-ink-muted)]">
            Headless, accessible React components and hooks on top of <code className="font-mono">nationid</code>. Ten exports across two subpaths: bundled inputs / selects / display, low-level hooks, and an opt-in <code className="font-mono">/rhf</code> adapter for <code className="font-mono">react-hook-form</code>.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={REPO_URL} target="_blank" rel="noreferrer noopener">
                GitHub
                <ArrowUpRight aria-hidden className="size-3.5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={NPM_URL} target="_blank" rel="noreferrer noopener">
                npm
                <ArrowUpRight aria-hidden className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>
        <CodeBlock code={INSTALL_SNIPPET} lang="bash" title="Install" className="w-full sm:w-[24rem]" />
      </header>

      <DocumentInputSection />
      <DocumentDisplaySection />
      <HookSection />
      <CatalogHooksAside />
      <RhfSection />
    </div>
  );
}
