import { format, validate } from "nationid";
import { lastN, mask } from "nationid/pii";
import { Badge } from "@/components/ui/badge.tsx";

interface Row {
  readonly name: string;
  readonly code: "BR_CPF" | "MX_CURP" | "SV_DUI" | "ES_DNI";
  readonly raw: string;
}

const ROWS: ReadonlyArray<Row> = [
  { name: "Carla Mendes", code: "BR_CPF", raw: "39053344705" },
  { name: "Cristina Gómez", code: "MX_CURP", raw: "GOMC850315HDFRRR07" },
  { name: "Roberto Pérez", code: "SV_DUI", raw: "045678903" },
  { name: "Lucía Ramírez", code: "ES_DNI", raw: "12345678Z" },
];

/**
 * Dashboard / KYC display pattern: never leak the full document to the UI.
 * `mask()` keeps separators and reveals just enough trailing characters to
 * be recognizable; `lastN()` is what your indexed-search column stores.
 */
export function MaskingExample() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--color-canvas-muted)] text-left text-xs text-[var(--color-ink-muted)]">
          <tr>
            <th scope="col" className="px-4 py-2 font-medium">
              Customer
            </th>
            <th scope="col" className="px-4 py-2 font-medium">
              Document
            </th>
            <th scope="col" className="px-4 py-2 font-medium">
              UI shown
            </th>
            <th scope="col" className="px-4 py-2 font-medium">
              Search index
            </th>
            <th scope="col" className="px-4 py-2 font-medium">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-line)]">
          {ROWS.map((row) => {
            const isValid = validate(row.code, row.raw);
            return (
              <tr key={row.name}>
                <td className="px-4 py-3">{row.name}</td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-[var(--color-ink-muted)]">{row.code}</span>
                  <span className="ml-2 font-mono text-sm">{format(row.code, row.raw)}</span>
                </td>
                <td className="px-4 py-3 font-mono text-sm">{mask(row.code, row.raw)}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--color-ink-muted)]">
                  …{lastN(row.code, row.raw, 4)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={isValid ? "success" : "danger"}>{isValid ? "verified" : "rejected"}</Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export const MASKING_SOURCE = `import { format } from "nationid";
import { lastN, mask } from "nationid/pii";

// In your dashboard table:
function CustomerRow({ customer }: { customer: Customer }) {
  return (
    <tr>
      <td>{customer.name}</td>
      {/* Never show the raw document. mask() preserves separators and
          reveals \`min(4, floor(placeholders / 3))\` trailing chars. */}
      <td className="font-mono">{mask(customer.docCode, customer.docRaw)}</td>
      {/* The search-friendly suffix lives in its own indexed column. */}
      <td className="text-muted">…{lastN(customer.docCode, customer.docRaw, 4)}</td>
    </tr>
  );
}`;
