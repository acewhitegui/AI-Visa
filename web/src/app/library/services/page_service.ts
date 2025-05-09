"use server"
import {fetchAPI} from "@/app/library/common/fetch-api";
import {Page, SitemapItem} from "@/app/library/objects/types";

export async function getPageBySlug(locale: string, slug: string): Promise<Page> {
  const token = process.env.STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/pages`;
  const options = {headers: {Authorization: `Bearer ${token}`}};

  const urlParamsObject = {
    filters: {
      slug: slug
    },
    populate: {
      blocks: {
        on: {
          "shared.rich-text": {
            populate: "*",
          }, "sections.hero": {
            populate: "*",
          },
          "sections.feature-rows-group": {
            populate: {
              features: {
                populate: "*",
              }
            },
          },
          "sections.faq-group": {
            populate: "*"
          },
        },
      },
      seo: {
        populate: "*",
      },
    },
    locale: locale,
  };
  const resp = await fetchAPI(path, urlParamsObject, options);
  return resp?.data?.[0]
}

export async function getPageSitemap(locale: string): Promise<Array<SitemapItem>> {
  const token = process.env.STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/pages`;
  const options = {headers: {Authorization: `Bearer ${token}`}};

  const urlParamsObject = {
    locale: locale,
  };
  const resp = await fetchAPI(path, urlParamsObject, options);
  if (!resp?.data) {
    return []
  }

  const result: Array<SitemapItem> = [];

  for (const page of resp.data) {
    result.push({
      path: "/pages/" + page.slug,
      priority: 0.4,
      changeFrequency: "monthly"
    });
  }
  return result
}