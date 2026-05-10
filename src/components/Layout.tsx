import { Github, Moon, Package, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import { useTheme } from "@/lib/theme.tsx";
import { cn } from "@/lib/utils.ts";

const NAV_ITEMS: ReadonlyArray<{ readonly to: string; readonly label: string }> = [
  { to: "/", label: "Home" },
  { to: "/playground", label: "Playground" },
  { to: "/passports", label: "Passports" },
  { to: "/mrz", label: "MRZ" },
  { to: "/countries", label: "Countries" },
  { to: "/examples", label: "Examples" },
];

const REPO_URL = "https://github.com/lu1tr0n/nationid";
const NPM_URL = "https://www.npmjs.com/package/nationid";
const DOCS_URL = "https://lu1tr0n.github.io/nationid/";

export function Layout({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme();
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--color-ink)] focus:px-3 focus:py-2 focus:text-sm focus:text-[var(--color-canvas)]"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-30 border-b border-[var(--color-line)] bg-[color-mix(in_oklch,var(--color-canvas)_92%,transparent)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-md bg-[var(--color-ink)] font-mono text-sm font-bold text-[var(--color-accent)]">
              id
            </span>
            <span className="font-serif text-lg font-medium tracking-tight">nationid</span>
            <span className="hidden rounded-[var(--radius-pill)] border border-[var(--color-line)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-ink-muted)] sm:inline-flex">
              showcase
            </span>
          </NavLink>
          <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-[var(--color-canvas-muted)] text-[var(--color-ink)]"
                      : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="icon" aria-label="GitHub repository">
              <a href={REPO_URL} target="_blank" rel="noreferrer noopener">
                <Github aria-hidden />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? <Sun aria-hidden /> : <Moon aria-hidden />}
            </Button>
          </div>
        </div>
        <nav aria-label="Primary mobile" className="sm:hidden">
          <ul className="flex w-full overflow-x-auto border-t border-[var(--color-line)] px-4 py-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to} className="shrink-0">
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-md px-3 py-1.5 text-sm",
                      isActive
                        ? "text-[var(--color-ink)]"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <footer className="border-t border-[var(--color-line)] bg-[var(--color-canvas-muted)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 text-sm text-[var(--color-ink-muted)] sm:flex-row sm:items-center sm:px-6">
          <p>
            <span className="font-serif text-base text-[var(--color-ink)]">nationid</span> · zero-dep
            identity-document validator · MIT licensed
          </p>
          <ul className="flex flex-wrap items-center gap-4">
            <li>
              <a
                href={NPM_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 hover:text-[var(--color-ink)]"
              >
                <Package className="size-4" aria-hidden /> npm
              </a>
            </li>
            <li>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 hover:text-[var(--color-ink)]"
              >
                <Github className="size-4" aria-hidden /> github
              </a>
            </li>
            <li>
              <a
                href={DOCS_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-[var(--color-ink)]"
              >
                docs
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
