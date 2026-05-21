import type { CountryCode } from "nationid";

/**
 * Display metadata for every country bundled by `nationid`.
 *
 * Kept here (not in the library) because flag emoji + display country name
 * are UI-only concerns. The library itself stays locale-agnostic.
 *
 * Aligned with `nationid@^1.0.0` — 34 countries (v0.1 + v0.4 + v0.6 EU expansion).
 */
export const COUNTRY_META: Readonly<Record<CountryCode, { readonly name: string; readonly flag: string }>> = {
  // v0.1.0
  SV: { name: "El Salvador", flag: "🇸🇻" },
  MX: { name: "México", flag: "🇲🇽" },
  CO: { name: "Colombia", flag: "🇨🇴" },
  BR: { name: "Brasil", flag: "🇧🇷" },
  PE: { name: "Perú", flag: "🇵🇪" },
  AR: { name: "Argentina", flag: "🇦🇷" },
  CL: { name: "Chile", flag: "🇨🇱" },
  DO: { name: "Dominican Republic", flag: "🇩🇴" },
  GT: { name: "Guatemala", flag: "🇬🇹" },
  HN: { name: "Honduras", flag: "🇭🇳" },
  CR: { name: "Costa Rica", flag: "🇨🇷" },
  ES: { name: "España", flag: "🇪🇸" },
  US: { name: "United States", flag: "🇺🇸" },
  // v0.4.0 — 9 new countries
  BO: { name: "Bolivia", flag: "🇧🇴" },
  EC: { name: "Ecuador", flag: "🇪🇨" },
  PY: { name: "Paraguay", flag: "🇵🇾" },
  NI: { name: "Nicaragua", flag: "🇳🇮" },
  PA: { name: "Panamá", flag: "🇵🇦" },
  UY: { name: "Uruguay", flag: "🇺🇾" },
  CA: { name: "Canada", flag: "🇨🇦" },
  PT: { name: "Portugal", flag: "🇵🇹" },
  VE: { name: "Venezuela", flag: "🇻🇪" },
  // v0.6.0 — 12 European countries
  GB: { name: "United Kingdom", flag: "🇬🇧" },
  FR: { name: "France", flag: "🇫🇷" },
  DE: { name: "Germany", flag: "🇩🇪" },
  IT: { name: "Italy", flag: "🇮🇹" },
  NL: { name: "Netherlands", flag: "🇳🇱" },
  BE: { name: "Belgium", flag: "🇧🇪" },
  CH: { name: "Switzerland", flag: "🇨🇭" },
  PL: { name: "Poland", flag: "🇵🇱" },
  SE: { name: "Sweden", flag: "🇸🇪" },
  NO: { name: "Norway", flag: "🇳🇴" },
  DK: { name: "Denmark", flag: "🇩🇰" },
  FI: { name: "Finland", flag: "🇫🇮" },
};

export function countryName(code: CountryCode): string {
  return COUNTRY_META[code].name;
}

export function countryFlag(code: CountryCode): string {
  return COUNTRY_META[code].flag;
}
