"use server"
import {getApiBaseUrl} from "@/app/library/common/api-helpers";
import {logger} from "@/app/library/common/logger";
import {Material} from "@/app/library/objects/types";

export async function getMaterialList(userToken: string, productId: string, conversationId: string, locale: string): Promise<Material[]> {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/materials?product_id=${productId}&&conversation_id=${conversationId}&&locale=${locale}`;

  logger.info(`Try to get material list from url: ${url}, product id: ${productId}`)
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'bearer ' + userToken
    },
  });


  if (!response.ok) {
    const statusCode = response.status;
    logger.error(`ERROR to get material list from url: ${url}, get status code: ${statusCode} resp info: " ${await response.text()}`);
    return [];
  }

  const data = await response.json();
  return data.data.materials;
}