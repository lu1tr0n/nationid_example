import type { CountryCode } from "nationid";

/**
 * Display metadata for every country bundled by `nationid`.
 *
 * Kept here (not in the library) because flag emoji + display country name
 * are UI-only concerns. The library itself stays locale-agnostic.
 *
 * Pinned to `nationid@0.3.0` — the v0.1 country set. When upgrading to v0.4
 * (BO/EC/PY/NI/PA/UY/CA/PT/VE), append the new entries here and they'll flow
 * through to every page automatically.
 */
export const COUNTRY_META: Readonly<Record<CountryCode, { readonly name: string; readonly flag: string }>> = {
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
};

export function countryName(code: CountryCode): string {
  return COUNTRY_META[code].name;
}

export function countryFlag(code: CountryCode): string {
  return COUNTRY_META[code].flag;
}
