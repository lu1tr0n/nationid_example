import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Locale } from "nationid/i18n";

interface LocaleContextValue {
  readonly locale: Locale;
  setLocale(next: Locale): void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Demo-side locale state.
 *
 * This drives `getErrorMessage` (i18n) and `listDocuments(_, locale)` (catalog)
 * so visitors can see how the same call returns Spanish, English, or Portuguese
 * strings from the library — no extra translation layer in the example.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within <LocaleProvider>");
  }
  return ctx;
}
