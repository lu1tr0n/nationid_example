import { zodResolver } from "@hookform/resolvers/zod";
import type { CountryCode, DocumentTypeCode } from "nationid";
import { listSupportedCountries, parse } from "nationid";
import { listDocuments } from "nationid/catalog";
import { getErrorMessage } from "nationid/i18n";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { COUNTRY_META } from "@/lib/countries.ts";
import { useLocale } from "@/lib/i18n.tsx";

/**
 * Best-practice form integration: Zod validates with `parse()`, RHF reads
 * the locale-aware error message back from `nationid/i18n`. The form never
 * hard-codes error copy.
 */
export function ReactHookFormExample() {
  const { locale } = useLocale();
  const countries = useMemo(() => listSupportedCountries(), []);

  const schema = useMemo(
    () =>
      z
        .object({
          country: z.custom<CountryCode>((v) => typeof v === "string" && v.length === 2),
          code: z.custom<DocumentTypeCode>((v) => typeof v === "string"),
          input: z.string().min(1, { message: "Required" }),
        })
        .superRefine((value, ctx) => {
          const result = parse(value.code, value.input);
          if (!result.ok) {
            ctx.addIssue({
              code: "custom",
              path: ["input"],
              message: getErrorMessage(result.reason, locale),
            });
          }
        }),
    [locale],
  );

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    watch,
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { country: "BR", code: "BR_CPF", input: "" },
    mode: "onBlur",
  });

  const country = watch("country");
  const documents = useMemo(() => listDocuments(country, locale), [country, locale]);

  function onSubmit(values: FormValues) {
    // In a real app, send the parse() result's `normalized` string to the API.
    console.info("Submitted", values);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas)] p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="rhf-country">Country</Label>
          <Select
            value={country}
            onValueChange={(v) => {
              const cc = v as CountryCode;
              setValue("country", cc, { shouldValidate: true });
              const next = listDocuments(cc, locale)[0]?.code;
              if (next) setValue("code", next);
            }}
          >
            <SelectTrigger id="rhf-country">
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
          <Label htmlFor="rhf-doc">Document</Label>
          <Select
            value={watch("code")}
            onValueChange={(v) => setValue("code", v as DocumentTypeCode, { shouldValidate: true })}
          >
            <SelectTrigger id="rhf-doc">
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
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="rhf-input">Document number</Label>
        <Input
          id="rhf-input"
          {...register("input")}
          placeholder="type any value, then tab out"
          className="font-mono"
          aria-invalid={errors.input ? "true" : "false"}
          aria-describedby={errors.input ? "rhf-input-error" : undefined}
        />
        {errors.input && (
          <p id="rhf-input-error" role="alert" className="text-sm text-[var(--color-danger)]">
            {errors.input.message}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="accent">
          Validate
        </Button>
        <Button type="button" variant="ghost" onClick={() => reset()}>
          Reset
        </Button>
      </div>
      {isSubmitSuccessful && !errors.input && (
        <p className="text-sm text-[var(--color-accent)]">
          Form passed nationid validation. Check the console for the payload.
        </p>
      )}
    </form>
  );
}

export const REACT_HOOK_FORM_SOURCE = `import { zodResolver } from "@hookform/resolvers/zod";
import { parse } from "nationid";
import { getErrorMessage, type Locale } from "nationid/i18n";
import { useForm } from "react-hook-form";
import { z } from "zod";

function buildSchema(locale: Locale) {
  return z
    .object({
      country: z.string().length(2),
      code: z.string(),
      input: z.string().min(1),
    })
    .superRefine((value, ctx) => {
      const result = parse(value.code as never, value.input);
      if (!result.ok) {
        ctx.addIssue({
          code: "custom",
          path: ["input"],
          message: getErrorMessage(result.reason, locale),
        });
      }
    });
}

export function DocumentForm({ locale }: { locale: Locale }) {
  const schema = buildSchema(locale);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register("input")} aria-invalid={!!errors.input} />
      {errors.input && <p role="alert">{errors.input.message}</p>}
    </form>
  );
}`;
