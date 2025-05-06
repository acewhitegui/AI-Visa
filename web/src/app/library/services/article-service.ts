"use server";


import {fetchAPI} from "@/app/library/common/fetch-api";
import {Article, ArticlePageData, SEO, SitemapItem} from "@/app/library/objects/props";

export async function getArticleList(locale: string, category: string, page: number, pageSize: number): Promise<ArticlePageData> {
  const token = process.env.STRAPI_API_TOKEN;
  const path = `/articles`;
  const urlParamsObject = {
    locale: locale,
    sort: {createdAt: "desc"},
    populate: {
      cover: {fields: ["url"]},
      category: {fields: ["name", "slug"]},
      author: {
        populate: "*",
      },
      blocks: {
        on: {
          "shared.rich-text": {
            populate: "*"
          }
        }
      }
    },
    pagination: {
      page: page,
      pageSize: pageSize,
    },
    filters: {}
  };

  if (category && category !== "All") {
    urlParamsObject.filters = {category: {name: category}};
  }

  const options = {headers: {Authorization: `Bearer ${token}`}};
  return await fetchAPI(path, urlParamsObject, options)
}

export async function getArticleBySlug(locale: string, slug: string): Promise<Article> {
  const token = process.env.STRAPI_API_TOKEN;
  const path = `/articles`;
  const urlParamsObject = {
    locale: locale,
    filters: {slug},
    populate: {
      cover: {fields: ['url']},
      author: {populate: '*'},
      category: {fields: ['name']},
      blocks: {
        on: {
          "shared.rich-text": {
            populate: "*",
          },
        }
      },
      seo: {
        populate: "*"
      }
    },
  };
  const options = {headers: {Authorization: `Bearer ${token}`}};
  const resp = await fetchAPI(path, urlParamsObject, options);
  return resp?.data?.[0];
}

export async function getArticleMetaData(locale: string, slug: string): Promise<SEO> {
  const token = process.env.STRAPI_API_TOKEN;
  const path = `/articles`;
  const urlParamsObject = {
    locale: locale,
    filters: {slug},
    populate: {seo: {populate: '*'}},
  };
  const options = {headers: {Authorization: `Bearer ${token}`}};
  const response = await fetchAPI(path, urlParamsObject, options);
  return response.data;
}

export async function getArticleSitemap(locale: string): Promise<Array<SitemapItem>> {
  const token = process.env.STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/articles`;
  const options = {headers: {Authorization: `Bearer ${token}`}};

  const urlParamsObject = {
    locale: locale,
  };
  const resp = await fetchAPI(path, urlParamsObject, options);
  if (!resp?.data) {
    return []
  }

  const result: Array<SitemapItem> = [];

  for (const article of resp.data) {
    result.push({
      path: "/articles/" + article.slug,
      priority: 0.6,
      changeFrequency: "weekly"
    });
  }
  return result
}