import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils.ts";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[var(--radius-pill)] border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-ink)] text-[var(--color-canvas)]",
        outline: "border-[var(--color-line)] text-[var(--color-ink)]",
        success:
          "border-transparent bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
        danger:
          "border-transparent bg-[color-mix(in_oklch,var(--color-danger)_18%,transparent)] text-[var(--color-danger)]",
        warn: "border-transparent bg-[color-mix(in_oklch,var(--color-warn)_18%,transparent)] text-[var(--color-warn)]",
        muted:
          "border-[var(--color-line)] bg-[var(--color-canvas)] text-[var(--color-ink-muted)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
