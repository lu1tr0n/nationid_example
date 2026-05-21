# nationid · showcase interativo

**[English](./README.md) · [Español](./README.es.md) · [Português](./README.pt.md)**

Showcase interativo para [`nationid`](https://github.com/lu1tr0n/nationid) — um validador
TypeScript-first e zero-dependency para documentos de identidade, fiscais, eleitorais e
migratórios de **34 países**.

> Demo ao vivo: https://lu1tr0n.github.io/nationid_example/

Alinhado com `nationid@^1.0.0` — 34 países, ~120 códigos de documento, cobertura completa de
passaportes com primitivas MRZ ICAO 9303, BR_CNPJ alfanumérico (IN RFB 2.229/2024), MX_NSS, e
as melhorias de narrowing de tipos da v1.0 para `parse / getSpec / extract*` mais o tarball
76% menor no npm.

## O que tem dentro

- **Home** — grade de features, nuvem de países, callout de "novidades", snippet de
  instalação.
- **Playground** — escolha um país e um documento, digite um valor e veja cada helper
  (`validate`, `parse`, `format`, `normalize`, `mask`, `lastN`, `hash`, `extractDOB`,
  `extractSex`, `extractRegion`, `getErrorMessage`) atualizar em tempo real.
- **Passaportes** (`/passports`) — playground de passaportes de 34 países com comparação
  cross-country, metadados localizados e citações de fontes.
- **MRZ** (`/mrz`) — calculadora ao vivo do dígito verificador ICAO 9303 alimentada por
  `nationid/algorithms` (`mrzCheckDigit`, `validateMrzNumber`, `mrzCharValue`, `toMrzField9`).
- **Navegador de países** — cada spec, localizada, filtrável por propósito. Servido
  exclusivamente por `nationid/catalog`.
- **Exemplos** — oito padrões de integração prontos para produção: react-hook-form + Zod,
  validação server-side, mascaramento KYC, hash-then-store, pickers dinâmicos, busca
  cross-country de tax ID, BR_CNPJ alfanumérico (IN RFB 2.229/2024), e validação Luhn do
  MX_NSS.

## Acompanhando a v1.0

O showcase consome `nationid` direto do npm. Assim que `nationid@1.0.0` chegar, a linha de
compatibilidade deste README e a entrada `dependencies` em package.json passam para
`^1.0.0`. Nenhuma tela existente precisa de mudanças no código — os breaking changes da
v1.0 foram todos em superfícies de baixo tráfego (`pii.mask` lançando erro em códigos
desconhecidos, `exports` negando subpaths não documentados, e dois rebaixamentos de
`confidence` em passaportes) e este showcase já seguia os padrões documentados.

## Rodar localmente

```bash
pnpm install
pnpm dev
```

Depois abra http://localhost:5173/nationid_example/.

## Build

```bash
pnpm typecheck
pnpm build
pnpm preview
```

O site estático fica em `dist/`. O workflow do Pages em
`.github/workflows/deploy.yml` publica essa pasta no GitHub Pages a cada push para `main`.

## Stack

- Vite 7 · React 19 · TypeScript 5.9 (strict)
- Tailwind CSS 4 (`@import "tailwindcss"` + tokens em `@theme`)
- Primitivos Radix estilizados no padrão shadcn/ui
- Shiki 4 para syntax highlighting (lazy load)
- react-router 7 (HashRouter para funcionar no Pages)
- react-hook-form + zod para o exemplo de formulário
- `nationid` consumido direto do npm — sem link local.

## Licença

MIT — veja [LICENSE](./LICENSE).
