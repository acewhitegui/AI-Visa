"use server"

import {fetchAPI} from "@/app/library/common/fetch-api";
import {logger} from "@/app/library/common/logger";
import {Category} from "@/app/library/objects/props";

export async function fetchArticleSideMenuData(locale: string, filter: string) {
  try {
    const token = process.env.STRAPI_API_TOKEN;
    const options = {headers: {Authorization: `Bearer ${token}`}};

    const categoriesResponse = await fetchAPI(
      "/categories",
      {populate: "*"},
      options
    );

    const articlesResponse = await fetchAPI(
      "/articles",
      filter
        ? {
          locale: locale,
          filters: {
            category: {
              slug: filter,
            },
          },
        }
        : {
          locale: locale
        },
      options
    );

    return {
      articles: articlesResponse.data,
      categories: categoriesResponse.data,
    };
  } catch (error) {
    logger.error("Error to fetch article side menu data, error info: ", error);
  }
}

export async function fetchCaseStudySideMenuData(locale: string, filter: string) {
  try {
    const token = process.env.STRAPI_API_TOKEN;
    const options = {headers: {Authorization: `Bearer ${token}`}};

    const categoriesResponse = await fetchAPI(
      "/categories",
      {populate: "*"},
      options
    );

    const caseStudiesResponse = await fetchAPI(
      "/case-studies",
      filter
        ? {
          locale: locale,
          filters: {
            category: {
              slug: filter,
            },
          },
        }
        : {
          locale: locale
        },
      options
    );

    return {
      caseStudies: caseStudiesResponse.data,
      categories: categoriesResponse.data,
    };
  } catch (error) {
    logger.error(error);
  }
}

export async function getCategoryList(): Promise<Array<Category>> {
  try {
    const token = process.env.STRAPI_API_TOKEN;
    const options = {headers: {Authorization: `Bearer ${token}`}};

    const categoriesResponse = await fetchAPI(
      "/categories",
      {
        populate: {
          fields: ["name", "slug"]
        },
      },
      options
    );

    return categoriesResponse.data
  } catch (error) {
    logger.error(error);
    return []
  }
}