"use server"

import {Conversation} from "@/app/library/objects/types"
import {getApiBaseUrl} from "@/app/library/common/api-helpers";
import {logger} from "@/app/library/common/logger";

export async function getConversationList(productId: string): Promise<Conversation[]> {
  return []
}

export async function createNewConversation(userToken: string, productId: string, name: string): Promise<Conversation | null> {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/conversation`;

  const postData = JSON.stringify({
    product_id: productId,
    name: name,
    answers: {}
  });

  logger.info(`Try to create new conversation to url: ${url}, with data: ${postData}`)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + userToken
    },
    body: postData
  });


  if (!response.ok) {
    const statusCode = response.status;
    console.error("ERROR to create conversation, get status code: ", statusCode, "resp info: ", response.body || 'created failed');
    return null;
  }

  const data = await response.json();
  return data.data;
}