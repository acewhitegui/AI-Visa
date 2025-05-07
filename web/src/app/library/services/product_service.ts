"use server"
import {fetchAPI} from "@/app/library/common/fetch-api";

import {Product, SitemapItem} from "@/app/library/objects/types";

export async function getProductList(locale: string): Promise<Product[]> {
  const token = process.env.STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/products`;
  const options = {headers: {Authorization: `Bearer ${token}`}};
  const urlParamsObject = {
    locale: locale,
  };
  const resp = await fetchAPI(path, urlParamsObject, options);
  return resp?.data
}

export async function getProductBySlug(locale: string, slug: string): Promise<Product> {
  const token = process.env.STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/products`;
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
          "sections.how-to-group": {
            populate: {
              step: {
                populate: "*"
              },
              image: {
                populate: "*"
              }
            }
          }
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

export async function getProductSitemap(locale: string): Promise<Array<SitemapItem>> {
  const token = process.env.STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/products`;
  const options = {headers: {Authorization: `Bearer ${token}`}};

  const urlParamsObject = {
    locale: locale,
  };
  const resp = await fetchAPI(path, urlParamsObject, options);
  if (!resp?.data) {
    return []
  }

  const result: Array<SitemapItem> = [];

  for (const product of resp.data) {
    result.push({
      path: "/products/" + product.slug,
      priority: 0.8,
      changeFrequency: "weekly"
    });
  }
  return result
}