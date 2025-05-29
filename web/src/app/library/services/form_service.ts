"use server"
import {StrapiForm} from "@/app/library/objects/types";
import {logger} from "@/app/library/common/logger";
import {getStrapiAPI} from "@/app/library/common/api-helpers";

export async function submitFormData(data: any): Promise<StrapiForm | null> {
  const strapiUrl = getStrapiAPI();
  const token = process.env.STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const url = `${strapiUrl}/forms`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + token
    },
    body: JSON.stringify(data)
  });


  if (!response.ok) {
    const statusCode = response.status;
    logger.error(`ERROR to get material list from url: ${url}, get status code: ${statusCode} resp info: " ${await response.text()}`);
    return null;
  }

  const respJson = await response.json();
  return respJson.data;
}