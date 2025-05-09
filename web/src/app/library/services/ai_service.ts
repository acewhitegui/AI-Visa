"use server"
import {getApiBaseUrl} from "@/app/library/common/api-helpers";
import {logger} from "@/app/library/common/logger";
import {redirect} from "next/navigation";

export async function submitAI(userToken: string, productId: string, conversationId: string): Promise<boolean> {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/ai`;

  const postData = JSON.stringify({
    product_id: productId,
    conversation_id: conversationId,
  });

  logger.info(`Try to generate ai to url: ${url}, with data: ${postData}`)
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
    console.error("ERROR to generate ai, get status code: ", statusCode, "resp info: ", await response.text());
    if (401 == response.status) {
      redirect("/auth/login")
    }
    return false;
  }

  return true
}