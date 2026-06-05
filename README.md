# nationid · interactive showcase

**[English](./README.md) · [Español](./README.es.md) · [Português](./README.pt.md)**

Interactive showcase for [`nationid`](https://github.com/lu1tr0n/nationid) — a TypeScript-first,
zero-dependency validator for national identity, tax, voter and migratory documents from
**54 countries**.

> Live demo: https://lu1tr0n.github.io/nationid_example/

Aligned with `nationid@^2.2.0` — 54 countries, ~145 document codes, full passport coverage
with ICAO 9303 MRZ primitives, BR_CNPJ alphanumeric (IN RFB 2.229/2024), MX_NSS, and the
v1.0 type-narrowing improvements for `parse / getSpec / extract*` plus the 76%-smaller npm
tarball.

## What's inside

- **Home** — feature grid, country cloud, "what's new" callout, install snippet.
- **Playground** — pick a country and document, type a value, see every helper
  (`validate`, `parse`, `format`, `normalize`, `mask`, `lastN`, `hash`, `extractDOB`,
  `extractSex`, `extractRegion`, `getErrorMessage`) update in real time.
- **Passports** (`/passports`) — 54-country passport playground with cross-country
  compare, locale-aware metadata, source citations.
- **MRZ** (`/mrz`) — live ICAO 9303 check-digit calculator backed by
  `nationid/algorithms` (`mrzCheckDigit`, `validateMrzNumber`, `mrzCharValue`,
  `toMrzField9`).
- **Country browser** — every spec, locale-aware, filterable by purpose. Powered
  exclusively by `nationid/catalog`.
- **Examples** — eight production-ready integration patterns: react-hook-form + Zod,
  server-side validation, KYC masking, hash-then-store, dynamic pickers,
  cross-country tax-ID search, BR_CNPJ alphanumeric (IN RFB 2.229/2024), and
  MX_NSS Luhn validation.

## Tracking releases

The showcase consumes `nationid` straight from npm and tracks the latest release.
It currently pins `^2.2.0`, which added Singapore (`SG_NRIC`, `SG_FIN`, `SG_UEN`)
on top of the v2.0 EU-VAT batch and v2.1 Japan. Bumping the `dependencies` entry
and the compatibility line above is usually all that is needed — the screens read
the catalog and country list straight from the library, so new specs surface
automatically.

## Run locally

```bash
pnpm install
pnpm dev
```

Then open http://localhost:5173/nationid_example/.

## Build

```bash
pnpm typecheck
pnpm build
pnpm preview
```

The static site lands in `dist/`. The Pages workflow at `.github/workflows/deploy.yml`
publishes that directory to GitHub Pages on every push to `main`.

## Stack

- Vite 7 · React 19 · TypeScript 5.9 (strict)
- Tailwind CSS 4 (`@import "tailwindcss"` + `@theme` tokens)
- Radix primitives styled in the shadcn/ui mold
- Shiki 4 for syntax highlighting (lazy-loaded)
- react-router 7 (HashRouter for Pages-friendly routing)
- react-hook-form + zod for the form example
- `nationid` consumed straight from npm — no local link.

## License

MIT — see [LICENSE](./LICENSE).
