import type { CountryCode } from "nationid";

/**
 * Display metadata for every country bundled by `nationid`.
 *
 * Kept here (not in the library) because flag emoji + display country name
 * are UI-only concerns. The library itself stays locale-agnostic.
 *
 * Aligned with `nationid@^2.0.0` — 52 countries (v0.1 + v0.4 + v0.6 EU
 * principal + v1.2 India + v2.0 EU-VAT complete).
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
  // v1.2.0 — Asia phase 1
  IN: { name: "India", flag: "🇮🇳" },
  // v1.7.0 — EU-VAT complete (16 EU + 1 EEA)
  IE: { name: "Ireland", flag: "🇮🇪" },
  AT: { name: "Austria", flag: "🇦🇹" },
  LU: { name: "Luxembourg", flag: "🇱🇺" },
  GR: { name: "Greece", flag: "🇬🇷" },
  CZ: { name: "Czechia", flag: "🇨🇿" },
  HU: { name: "Hungary", flag: "🇭🇺" },
  RO: { name: "Romania", flag: "🇷🇴" },
  BG: { name: "Bulgaria", flag: "🇧🇬" },
  HR: { name: "Croatia", flag: "🇭🇷" },
  SK: { name: "Slovakia", flag: "🇸🇰" },
  SI: { name: "Slovenia", flag: "🇸🇮" },
  LT: { name: "Lithuania", flag: "🇱🇹" },
  LV: { name: "Latvia", flag: "🇱🇻" },
  EE: { name: "Estonia", flag: "🇪🇪" },
  MT: { name: "Malta", flag: "🇲🇹" },
  CY: { name: "Cyprus", flag: "🇨🇾" },
  IS: { name: "Iceland", flag: "🇮🇸" },
};

export function countryName(code: CountryCode): string {
  return COUNTRY_META[code].name;
}

export function countryFlag(code: CountryCode): string {
  return COUNTRY_META[code].flag;
}
