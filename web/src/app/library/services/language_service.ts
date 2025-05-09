"use strict"
import {fetchAPI} from "@/app/library/common/fetch-api";
import {Language} from "@/app/library/objects/types";
import {routing} from "@/i18n/routing";
import {LOCALE_DISPLAY_MAP} from "@/app/library/common/constants";

export async function getLanguageList() {
  // filter list prepare
  const localesList = routing.locales
  const locales = localesList.map(locale => {
    return locale.toString()
  })
  // get languages select list
  const token = process.env.STRAPI_API_TOKEN;
  const path = `/i18n/locales`;
  const urlParamsObject = {
    pagination: {
      page: 1,
      pageSize: 50,
    },
  };
  const options = {headers: {Authorization: `Bearer ${token}`}};
  const languages: Array<Language> = await fetchAPI(path, urlParamsObject, options);
  for (const language of languages) {
    language.displayName = LOCALE_DISPLAY_MAP.get(language.code) || "";
  }
  // filter
  return languages.filter(language => locales.includes(language.code));
}

