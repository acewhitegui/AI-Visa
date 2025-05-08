export function getStrapiAPI(path = '') {
  return `${process.env.STRAPI_API_URL || 'http://localhost:1337'}${path}`;
}

export function getStrapiURL(path = '') {
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${path}`;
}

export function getStrapiMedia(url: string | undefined) {
  if (url == null) {
    return "";
  }

  // Return the full URL if the media is hosted on an external provider
  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  // Otherwise prepend the URL path with the Strapi URL
  return `${getStrapiURL()}${url}`;
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

// ADDS DELAY TO SIMULATE SLOW API REMOVE FOR PRODUCTION
export const delay = (time: number) => new Promise((resolve) => setTimeout(() => resolve(1), time));


export function getApiBaseUrl(): string {
  const AI_VISA_API_BASE_URL = process.env.AI_VISA_API_BASE_URL;

  if (!AI_VISA_API_BASE_URL) {
    throw new Error('API base URL is not configured. Set AI_VISA_API_BASE_URL environment variable.');
  }

  return AI_VISA_API_BASE_URL;
}