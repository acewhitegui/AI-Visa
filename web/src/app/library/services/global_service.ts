"use server"
import {fetchAPI} from "@/app/library/common/fetch-api";
import {Navigation} from "@/app/library/objects/types";

export async function getGlobal(locale: string) {
  const token = process.env.STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/global`;
  const options = {headers: {Authorization: `Bearer ${token}`}};

  const urlParamsObject = {
    populate: [
      "seo",
      "favicon",
      "notificationBanner.link",
      "navbar.navbarLogo.logoImg",
      "footer.footerLogo.logoImg",
      "footer.legalLinks",
      "footer.socialLinks",
      "footer.categories",
    ],
    locale: locale,
  };
  return await fetchAPI(path, urlParamsObject, options);
}

export async function getNavbarMenu(locale: string): Promise<Array<Navigation>> {
  const token = process.env.STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/navigation/render/navigation`;
  const options = {headers: {Authorization: `Bearer ${token}`}};

  const urlParamsObject = {
    locale: locale,
    type: "TREE",
  };
  return await fetchAPI(path, urlParamsObject, options);
}

export async function getFooterMenu(locale: string): Promise<Array<Navigation>> {
  const token = process.env.STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/navigation/render/footer`;
  const options = {headers: {Authorization: `Bearer ${token}`}};

  const urlParamsObject = {
    locale: locale,
    type: "TREE",
  };
  return await fetchAPI(path, urlParamsObject, options);
}