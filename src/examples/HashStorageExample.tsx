import { hash, lastN } from "nationid/pii";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { CodeBlock } from "@/components/CodeBlock.tsx";

interface Indexed {
  readonly tenantSalt: string;
  readonly hashHex: string;
  readonly last4: string;
}

/**
 * Hash-then-store pattern: use a per-tenant salt to defeat rainbow tables,
 * keep `last4` for human-recognizable lookups, and never persist the raw
 * document. Equality checks then become "hash the candidate and compare".
 */
export function HashStorageExample() {
  const [tenant, setTenant] = useState("tenant-acme");
  const [input, setInput] = useState("390.533.447-05");
  const [computed, setComputed] = useState<Indexed | null>(null);

  useEffect(() => {
    let cancelled = false;
    hash("BR_CPF", input, { salt: tenant })
      .then((digest) => {
        if (cancelled) return;
        setComputed({ tenantSalt: tenant, hashHex: digest, last4: lastN("BR_CPF", input, 4) });
      })
      .catch(() => {
        if (!cancelled) setComputed(null);
      });
    return () => {
      cancelled = true;
    };
  }, [tenant, input]);

  return (
    <div className="grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas)] p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="hash-tenant">Tenant salt</Label>
          <Input
            id="hash-tenant"
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hash-input">CPF</Label>
          <Input
            id="hash-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="font-mono"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setTenant(`tenant-${Math.random().toString(36).slice(2, 7)}`);
          }}
        >
          Rotate salt
        </Button>
      </div>
      {computed && (
        <CodeBlock
          lang="json"
          title="row stored in db"
          hideCopy
          code={JSON.stringify(
            {
              tenant_salt: computed.tenantSalt,
              cpf_hash: computed.hashHex,
              cpf_last4: computed.last4,
            },
            null,
            2,
          )}
        />
      )}
    </div>
  );
}

export const HASH_STORAGE_SOURCE = `import { hash, lastN } from "nationid/pii";

interface CustomerRow {
  cpfHash: string;     // SubtleCrypto SHA-256 hex
  cpfLast4: string;    // for human-friendly search & display
}

export async function indexCustomer(cpf: string, tenantId: string): Promise<CustomerRow> {
  // SECURITY: always use a per-tenant or per-user salt. An unsalted SHA-256
  // of an 11-digit CPF can be brute-forced in milliseconds.
  return {
    cpfHash: await hash("BR_CPF", cpf, { salt: tenantId }),
    cpfLast4: lastN("BR_CPF", cpf, 4),
  };
}

// Equality lookup, no raw PII at rest:
const candidate = await hash("BR_CPF", userInput, { salt: tenantId });
const row = await db.query(\`SELECT * FROM customers
  WHERE tenant_id = $1 AND cpf_hash = $2\`,
  [tenantId, candidate]);`;
