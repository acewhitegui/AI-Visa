"use server"
import {fetchAPI} from "@/app/library/common/fetch-api";

import {Question} from "@/app/library/objects/types";

export async function getQuestionList(productId: string, locale: string): Promise<Question[]> {
  const token = process.env.STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/questions`;
  const options = {headers: {Authorization: `Bearer ${token}`}};
  const urlParamsObject = {
    filters: {
      "products": {
        documentId: productId,
      }
    },
    populate: {
      choices: {
        fields: ["title", "action"],
        populate: {
          question: {
            fields: ["title"]
          }
        }
      }
    },
    locale: locale,
  };
  const resp = await fetchAPI(path, urlParamsObject, options);
  return resp?.data
}