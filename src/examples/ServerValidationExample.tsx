import { parse } from "nationid";
import { getErrorMessage, type Locale } from "nationid/i18n";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { CodeBlock } from "@/components/CodeBlock.tsx";
import { useLocale } from "@/lib/i18n.tsx";

interface ApiResponse {
  readonly status: 200 | 422;
  readonly body: Record<string, unknown>;
}

/**
 * Simulates an HTTP handler running on Node, Edge, or any V8/SpiderMonkey
 * runtime. The same code is used unchanged on the server: parse, branch on
 * `result.ok`, and return RFC-7807-flavored JSON.
 */
function handle(input: string, locale: Locale): ApiResponse {
  const result = parse("BR_CPF", input);
  if (!result.ok) {
    return {
      status: 422,
      body: {
        error: {
          code: `INVALID_${result.reason.kind.toUpperCase()}`,
          field: "cpf",
          message: getErrorMessage(result.reason, locale, "CPF"),
        },
      },
    };
  }
  return {
    status: 200,
    body: {
      cpf: result.normalized,
      formatted: result.formatted,
      confidence: result.confidence,
    },
  };
}

export function ServerValidationExample() {
  const { locale } = useLocale();
  const [input, setInput] = useState("390.533.447-05");
  const [response, setResponse] = useState<ApiResponse | null>(null);

  return (
    <div className="grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas)] p-4">
      <div className="space-y-1.5">
        <Label htmlFor="srv-input">CPF (Brazilian taxpayer ID)</Label>
        <div className="flex gap-2">
          <Input
            id="srv-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="font-mono"
            spellCheck={false}
          />
          <Button type="button" variant="accent" onClick={() => setResponse(handle(input, locale))}>
            POST /api/users
          </Button>
        </div>
      </div>
      {response && (
        <CodeBlock
          lang="json"
          title={`HTTP ${response.status}`}
          code={JSON.stringify(response.body, null, 2)}
          hideCopy
        />
      )}
    </div>
  );
}

export const SERVER_VALIDATION_SOURCE = `// app/api/users/route.ts (Next.js App Router)
import { parse } from "nationid";
import { getErrorMessage, type Locale } from "nationid/i18n";

export async function POST(req: Request) {
  const { cpf } = await req.json();
  const locale = (req.headers.get("accept-language")?.slice(0, 2) ?? "en") as Locale;

  const result = parse("BR_CPF", cpf);
  if (!result.ok) {
    return Response.json(
      {
        error: {
          code: \`INVALID_\${result.reason.kind.toUpperCase()}\`,
          field: "cpf",
          message: getErrorMessage(result.reason, locale, "CPF"),
        },
      },
      { status: 422 },
    );
  }

  // Persist the normalized form. Always store the canonical version so
  // downstream queries don't have to re-normalize on read.
  await db.users.create({
    data: { cpfNormalized: result.normalized },
  });
  return Response.json({ ok: true }, { status: 201 });
}`;
