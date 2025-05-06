"use server"
import {fetchAPI} from "@/app/library/common/fetch-api";

export async function getHomepage(locale: string) {
  const token = process.env.STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/homepage`;
  const options = {headers: {Authorization: `Bearer ${token}`}};

  const urlParamsObject = {
    populate: {
      blocks: {
        on: {
          "sections.hero": {
            populate: "*",
          },
          "sections.featured-on": {
            populate: {
              logos: {
                populate: "*"
              },
            }
          },
          "sections.bottom-actions": {
            populate: "*",
          },
          "sections.feature-columns-group": {
            populate: {
              features: {
                populate: "*",
              }
            },
          },
          "sections.feature-rows-group": {
            populate: {
              features: {
                populate: "*",
              }
            },
          },
          "shared.rich-text": {
            populate: "*",
          },
          "sections.pricing": {
            populate: {
              plans: {
                populate: "*",
              },
            },
          },
          "sections.lead-form": {
            populate: "*",
          },
          "sections.products": {
            populate: {
              products: {
                populate: {
                  icon: {
                    populate: "*"
                  },
                }
              }
            }
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
  return await fetchAPI(path, urlParamsObject, options);
}