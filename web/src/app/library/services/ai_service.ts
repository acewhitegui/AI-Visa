"use server"
import {getApiBaseUrl} from "@/app/library/common/api-helpers";
import {logger} from "@/app/library/common/logger";
import {redirect} from "next/navigation";
import {Message} from "@/app/library/objects/types";

export async function submitAI(userToken: string, productId: string, conversationId: string, sessionId: string): Promise<boolean> {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/ai`;

  const postData = JSON.stringify({
    product_id: productId,
    conversation_id: conversationId,
    session_id: sessionId
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

export async function updateAIResult(userToken: string, productId: string, conversationId: string, sessionId: string): Promise<boolean> {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/ai`;

  const postData = JSON.stringify({
    product_id: productId,
    conversation_id: conversationId,
    session_id: sessionId
  });

  logger.info(`Try to generate ai to url: ${url}, with data: ${postData}`)
  const response = await fetch(url, {
    method: 'PUT',
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

export async function getAIResult(userToken: string, productId: string, conversationId: string): Promise<Message | null> {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/ai?product_id=${productId}&&conversation_id=${conversationId}`;

  logger.info(`Try to get ai result from url: ${url}, conversation id: ${conversationId}`)
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'bearer ' + userToken
    },
  });


  if (!response.ok) {
    const statusCode = response.status;
    logger.error(`ERROR to get ai result from url: ${url}, get status code: ${statusCode} resp info: " ${await response.text()}`);
    return null;
  }

  const data = await response.json();
  return data.data.message;
}