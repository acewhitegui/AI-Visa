import {routing} from "@/i18n/routing";
import {HOST} from "@/app/library/common/constants";

/**
 * Gets alternate language URLs for SEO purposes
 * @param baseUrl The URL path (with or without leading slash)
 * @returns Object with canonical URL and alternate language URLs
 */
export function getAlternate(baseUrl?: string): {
  canonical: string;
  languages: Record<string, string>;
} {
  const canonicalLang = "en";

  // Ensure baseUrl starts with a slash if provided
  const formattedPath = baseUrl ? (baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`) : '';

  return {
    canonical: `${HOST}/${canonicalLang}${formattedPath}`,
    languages: getAlternateLanguages(formattedPath, canonicalLang)
  };
}

/**
 * Generates URLs for all supported languages except the canonical one
 * @param path The URL path (with leading slash)
 * @param canonicalLang The canonical language code to exclude
 * @returns Record of language codes to their respective URLs
 */
function getAlternateLanguages(path: string = '', canonicalLang: string = 'en'): Record<string, string> {
  // Guard against routing.locales being undefined
  if (!routing.locales || !Array.isArray(routing.locales)) {
    console.warn('routing.locales is undefined or not an array');
    return {};
  }

  const languageMap: Record<string, string> = {};

  for (const locale of routing.locales) {
    // Skip the canonical language
    if (locale === canonicalLang) {
      continue;
    }

    // Handle potential short locale codes safely
    if (locale.length >= 2) {
      const iso = locale.slice(0, 2);

      // Handle potential duplicate keys by appending the full locale if needed
      const key = iso in languageMap ? locale : iso;

      languageMap[key] = `${HOST}/${locale}${path}`;
    } else {
      console.warn(`Locale "${locale}" is too short to extract ISO code`);
      languageMap[locale] = `${HOST}/${locale}${path}`;
    }
  }

  return languageMap;
}
