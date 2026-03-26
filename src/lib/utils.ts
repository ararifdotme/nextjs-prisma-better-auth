import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const locales = ["en", "bn"] as const;
export type AppLocale = (typeof locales)[number];

export function setLocale(nextLocale: AppLocale) {
  document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`
  window.location.reload()
}
