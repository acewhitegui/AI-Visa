"use server"

import {Conversation} from "@/app/library/objects/types"
import {getApiBaseUrl} from "@/app/library/common/api-helpers";
import {logger} from "@/app/library/common/logger";
import {redirect} from "next/navigation";

export async function getConversationList(userToken: string, productId: string): Promise<Conversation[]> {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/conversations?product_id=${productId}`;

  logger.info(`Try to get conversation list from url: ${url}, product id: ${productId}`)
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'bearer ' + userToken
    },
  });


  if (!response.ok) {
    const statusCode = response.status;
    logger.error(`ERROR to get conversation list from url: ${url}, get status code: ${statusCode} resp info: " ${await response.text() || 'created failed'}`);
    return [];
  }

  const data = await response.json();
  return data.data;
}

export async function getConversation(userToken: string, conversationId: string): Promise<Conversation | null> {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/conversation?conversation_id=${conversationId}`;

  logger.info(`Try to get conversation details from url: ${url}, conversation id: ${conversationId}`)
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'bearer ' + userToken
    },
  });


  if (!response.ok) {
    const statusCode = response.status;
    logger.error(`ERROR to get conversation details from url: ${url}, get status code: ${statusCode} resp info: " ${await response.text() || 'get failed'}`);
    return null;
  }

  const data = await response.json();
  return data.data;
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
    console.error("ERROR to create conversation, get status code: ", statusCode, "resp info: ", await response.text() || 'created failed');
    if (401 == response.status) {
      redirect("/auth/login")
    }
    return null;
  }

  const data = await response.json();
  return data.data;
}

export async function updateConversation(userToken: string, productId: string, conversationId: string, name: string, answers?: any): Promise<Conversation | null> {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/conversation`;

  if (!answers) {
    answers = {}
  }

  const putData = JSON.stringify({
    product_id: productId,
    conversation_id: conversationId,
    name: name,
    answers: answers
  });

  logger.info(`Try to update conversation to url: ${url}, with data: ${putData}`)
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + userToken
    },
    body: putData
  });


  if (!response.ok) {
    const statusCode = response.status;
    console.error("ERROR to update conversation, get status code: ", statusCode, "resp info: ", await response.text() || 'update failed');
    if (401 == response.status) {
      redirect("/auth/login")
    }
    return null;
  }

  const data = await response.json();
  return data.data;
}

export async function deleteConversation(userToken: string, conversationId: string): Promise<boolean> {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/conversation`;

  const deleteData = JSON.stringify({
    conversation_id: conversationId,
  });

  logger.info(`Try to delete conversation to url: ${url}, with data: ${deleteData}`)
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + userToken
    },
    body: deleteData
  });


  if (!response.ok) {
    const statusCode = response.status;
    console.error("ERROR to update conversation, get status code: ", statusCode, "resp info: ", await response.text() || 'update failed');
    if (401 == response.status) {
      redirect("/auth/login")
    }
    return false;
  }

  return true;
}