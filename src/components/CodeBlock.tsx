import { Check, Copy } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import type { HighlighterCore } from "shiki/core";
import { Button } from "@/components/ui/button.tsx";
import { useTheme } from "@/lib/theme.tsx";
import { cn } from "@/lib/utils.ts";

interface CodeBlockProps {
  readonly code: string;
  readonly lang?: "ts" | "tsx" | "js" | "json" | "bash" | "html";
  readonly title?: ReactNode;
  readonly className?: string;
  /** Hide the copy button for read-only displays (e.g. live JSON results). */
  readonly hideCopy?: boolean;
}

/**
 * Lazy singleton: build the highlighter once for the whole app, with only the
 * grammars and themes we actually render. Importing from `shiki/core` (instead
 * of the default `shiki` entry) keeps Vite from auto-bundling every grammar
 * and theme shiki ships — that would balloon the main chunk past 600 KB gz.
 */
let highlighterPromise: Promise<HighlighterCore> | null = null;

async function getHighlighter(): Promise<HighlighterCore> {
  if (highlighterPromise) return highlighterPromise;
  highlighterPromise = (async () => {
    const [{ createHighlighterCore }, { createOnigurumaEngine }] = await Promise.all([
      import("shiki/core"),
      import("shiki/engine/oniguruma"),
    ]);
    return createHighlighterCore({
      themes: [
        import("shiki/themes/github-dark-default.mjs"),
        import("shiki/themes/github-light-default.mjs"),
      ],
      langs: [
        import("shiki/langs/tsx.mjs"),
        import("shiki/langs/ts.mjs"),
        import("shiki/langs/js.mjs"),
        import("shiki/langs/json.mjs"),
        import("shiki/langs/bash.mjs"),
        import("shiki/langs/html.mjs"),
      ],
      engine: createOnigurumaEngine(import("shiki/wasm")),
    });
  })();
  return highlighterPromise;
}

/**
 * Syntax-highlighted code block with copy-to-clipboard.
 *
 * NOTE on dangerouslySetInnerHTML: Shiki tokenizes source text into `<span>`
 * elements with class/style attributes only and HTML-escapes the text content
 * before emitting markup. The `code` input here is always developer-authored
 * source from this repo (never user input). This is the documented usage.
 */
export function CodeBlock({ code, lang = "tsx", title, className, hideCopy = false }: CodeBlockProps) {
  const { theme } = useTheme();
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getHighlighter()
      .then((hl) => {
        if (cancelled) return;
        const out = hl.codeToHtml(code, {
          lang,
          theme: theme === "dark" ? "github-dark-default" : "github-light-default",
        });
        setHtml(out);
      })
      .catch(() => {
        // Highlighter failure is non-fatal — fall back to plain <pre>.
        if (!cancelled) setHtml("");
      });
    return () => {
      cancelled = true;
    };
  }, [code, lang, theme]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API can be blocked by permissions or non-secure contexts.
      // Silent failure is acceptable; the user can still select and copy.
    }
  }

  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-canvas-muted)]",
        className,
      )}
    >
      {(title || !hideCopy) && (
        <figcaption className="flex items-center justify-between gap-2 border-b border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-1.5 text-xs">
          <span className="font-mono text-[var(--color-ink-muted)]">{title ?? lang}</span>
          {!hideCopy && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
              className="h-7 gap-1 px-2 text-xs"
            >
              {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
              {copied ? "copied" : "copy"}
            </Button>
          )}
        </figcaption>
      )}
      {html ? (
        <div
          className="code-scroll overflow-x-auto px-1 py-1 text-[13px] [&_pre]:!bg-transparent [&_pre]:!p-3 [&_pre]:font-mono [&_pre]:leading-relaxed"
          // Shiki tokenizer output. See note above the function.
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="code-scroll overflow-x-auto p-3 font-mono text-[13px] leading-relaxed text-[var(--color-ink)]">
          <code>{code}</code>
        </pre>
      )}
    </figure>
  );
}
