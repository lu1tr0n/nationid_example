import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * shadcn/ui's canonical class merger. `clsx` resolves conditionals to a single
 * string; `twMerge` then dedupes conflicting Tailwind utilities so callers can
 * safely override defaults via props.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
