import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTimestamp() {
  return Math.round(Date.now() / 1000)
}

export function formatDate(dateString: string, locale?: string) {
  if (!locale) {
    locale = 'en-US';
  }

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric'};
  return date.toLocaleDateString(locale, options);
}

export function formatDateOnlyMonth(dateString: string, locale?: string) {
  if (!locale) {
    locale = 'en-US';
  }

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long'};
  return date.toLocaleDateString(locale, options);
}