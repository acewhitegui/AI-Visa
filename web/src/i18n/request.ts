import {getRequestConfig} from 'next-intl/server';
import {routing} from "@/i18n/routing";

export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
  // Ensure that a valid locale is used
  const localeItems = routing.locales.map((item) => {
    return item.valueOf();
  });

  if (!locale || !localeItems.includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`@/i18n/langs/${locale}.json`)).default
  };
});