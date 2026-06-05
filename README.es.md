# nationid · showcase interactivo

**[English](./README.md) · [Español](./README.es.md) · [Português](./README.pt.md)**

Showcase interactivo para [`nationid`](https://github.com/lu1tr0n/nationid) — un validador
TypeScript-first y zero-dependency para documentos de identidad, tributarios, electorales y
migratorios de **54 países**.

> Demo en vivo: https://lu1tr0n.github.io/nationid_example/

Alineado con `nationid@^2.2.0` — 54 países, ~145 códigos de documento, cobertura completa de
pasaportes con primitivas MRZ ICAO 9303, BR_CNPJ alfanumérico (IN RFB 2.229/2024), MX_NSS, y
las mejoras de narrowing de tipos de v1.0 para `parse / getSpec / extract*` más el tarball
76% más chico en npm.

## Qué incluye

- **Home** — grid de features, nube de países, callout de "novedades", snippet de instalación.
- **Playground** — elegí un país y un documento, escribí un valor y mirá actualizarse en
  tiempo real cada helper (`validate`, `parse`, `format`, `normalize`, `mask`, `lastN`,
  `hash`, `extractDOB`, `extractSex`, `extractRegion`, `getErrorMessage`).
- **Pasaportes** (`/passports`) — playground de pasaportes de 54 países con comparación
  cross-country, metadata localizada y citas de fuentes.
- **MRZ** (`/mrz`) — calculadora en vivo del dígito verificador ICAO 9303 respaldada por
  `nationid/algorithms` (`mrzCheckDigit`, `validateMrzNumber`, `mrzCharValue`, `toMrzField9`).
- **Browser de países** — cada spec, localizable, filtrable por propósito. Servido
  exclusivamente por `nationid/catalog`.
- **Ejemplos** — ocho patrones de integración listos para producción: react-hook-form + Zod,
  validación server-side, enmascarado para KYC, hash-then-store, pickers dinámicos, búsqueda
  cross-country de tax ID, BR_CNPJ alfanumérico (IN RFB 2.229/2024), y validación Luhn de
  MX_NSS.

## Seguimiento de versiones

El showcase consume `nationid` directo desde npm y sigue la última versión. Hoy fija
`^2.2.0`, que sumó Singapur (`SG_NRIC`, `SG_FIN`, `SG_UEN`) sobre el lote de IVA de la UE de
v2.0 y Japón de v2.1. Subir la entrada `dependencies` y la línea de compatibilidad de arriba
suele ser todo lo necesario — las pantallas leen el catálogo y la lista de países directo de
la librería, así que las nuevas specs aparecen de forma automática.

## Correr localmente

```bash
pnpm install
pnpm dev
```

Después abrí http://localhost:5173/nationid_example/.

## Build

```bash
pnpm typecheck
pnpm build
pnpm preview
```

El sitio estático queda en `dist/`. El workflow de Pages en
`.github/workflows/deploy.yml` publica esa carpeta en GitHub Pages en cada push a `main`.

## Stack

- Vite 7 · React 19 · TypeScript 5.9 (strict)
- Tailwind CSS 4 (`@import "tailwindcss"` + tokens en `@theme`)
- Primitivos Radix estilados al estilo shadcn/ui
- Shiki 4 para syntax highlighting (lazy load)
- react-router 7 (HashRouter para que funcione en Pages)
- react-hook-form + zod para el ejemplo de formulario
- `nationid` consumido directo desde npm — sin link local.

## Licencia

MIT — ver [LICENSE](./LICENSE).
