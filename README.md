# nationid · interactive showcase

Interactive showcase for [`nationid`](https://github.com/lu1tr0n/nationid) — a TypeScript-first,
zero-dependency validator for national identity, tax, voter and migratory documents from 22
countries.

> Live demo: https://lu1tr0n.github.io/nationid_example/

Aligned with `nationid@^0.5.0` — 22 countries, 80+ document codes, full passport
coverage, ICAO 9303 MRZ primitives, BR_CNPJ alphanumeric, MX_NSS.

## What's inside

- **Home** — feature grid, country cloud, "what's new" callout for v0.4 + v0.5,
  install snippet.
- **Playground** — pick a country and document, type a value, see every helper
  (`validate`, `parse`, `format`, `normalize`, `mask`, `lastN`, `hash`, `extractDOB`,
  `extractSex`, `extractRegion`, `getErrorMessage`) update in real time.
- **Passports** (`/passports`) — 22-country passport playground with cross-country
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
