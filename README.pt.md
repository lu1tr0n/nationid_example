# nationid · showcase interativo

**[English](./README.md) · [Español](./README.es.md) · [Português](./README.pt.md)**

Showcase interativo para [`nationid`](https://github.com/lu1tr0n/nationid) — um validador
TypeScript-first e zero-dependency para documentos de identidade, fiscais, eleitorais e
migratórios de **54 países**.

> Demo ao vivo: https://lu1tr0n.github.io/nationid_example/

Alinhado com `nationid@^2.2.0` — 54 países, ~145 códigos de documento, cobertura completa de
passaportes com primitivas MRZ ICAO 9303, BR_CNPJ alfanumérico (IN RFB 2.229/2024), MX_NSS, e
as melhorias de narrowing de tipos da v1.0 para `parse / getSpec / extract*` mais o tarball
76% menor no npm.

## O que tem dentro

- **Home** — grade de features, nuvem de países, callout de "novidades", snippet de
  instalação.
- **Playground** — escolha um país e um documento, digite um valor e veja cada helper
  (`validate`, `parse`, `format`, `normalize`, `mask`, `lastN`, `hash`, `extractDOB`,
  `extractSex`, `extractRegion`, `getErrorMessage`) atualizar em tempo real.
- **Passaportes** (`/passports`) — playground de passaportes de 54 países com comparação
  cross-country, metadados localizados e citações de fontes.
- **MRZ** (`/mrz`) — calculadora ao vivo do dígito verificador ICAO 9303 alimentada por
  `nationid/algorithms` (`mrzCheckDigit`, `validateMrzNumber`, `mrzCharValue`, `toMrzField9`).
- **Navegador de países** — cada spec, localizada, filtrável por propósito. Servido
  exclusivamente por `nationid/catalog`.
- **Exemplos** — oito padrões de integração prontos para produção: react-hook-form + Zod,
  validação server-side, mascaramento KYC, hash-then-store, pickers dinâmicos, busca
  cross-country de tax ID, BR_CNPJ alfanumérico (IN RFB 2.229/2024), e validação Luhn do
  MX_NSS.

## Acompanhando as versões

O showcase consome `nationid` direto do npm e acompanha a versão mais recente. Hoje fixa
`^2.2.0`, que adicionou Singapura (`SG_NRIC`, `SG_FIN`, `SG_UEN`) sobre o lote de IVA da UE da
v2.0 e o Japão da v2.1. Subir a entrada `dependencies` e a linha de compatibilidade acima
costuma ser tudo o que é preciso — as telas leem o catálogo e a lista de países direto da
biblioteca, então as novas specs aparecem automaticamente.

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
