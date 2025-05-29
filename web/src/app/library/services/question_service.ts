"use server"
import {fetchAPI} from "@/app/library/common/fetch-api";

import {Question} from "@/app/library/objects/types";

export async function getQuestionList(productId: string, locale: string): Promise<Question[]> {
  const token = process.env.STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/products/${productId}`;
  const options = {headers: {Authorization: `Bearer ${token}`}};
  const urlParamsObject = {
    populate: {
      questions: {
        populate: {
          choices: {
            fields: ["title", "action"],
            populate: {
              question: {
                fields: ["id", "documentId", "title", "showDefault"]
              }
            }
          }
        }
      },
    },
    locale: locale,
  };
  const resp = await fetchAPI(path, urlParamsObject, options);
  const questions = resp?.data.questions;
  console.log("SUCCESS to get question from server, resp data: ", JSON.stringify(questions, null, 2));
  return questions;
}