"use server"
import {getApiBaseUrl} from "@/app/library/common/api-helpers";
import {UploadFile} from "@/app/library/objects/types";
import {logger} from "@/app/library/common/logger";

export async function uploadFile(userToken: string, formData: FormData): Promise<boolean> {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/files`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`
        // Note: Content-Type is automatically set when using FormData
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Upload failed: ', errorData);
      return false
    }

    const result = await response.json();
    console.log('Upload successful:', result);
    return true;
  } catch (error) {
    console.error('Network or other error during upload:', error);
    return false;
  }
}

export async function getUploadedFiles(userToken: string, conversationId: string): Promise<Record<string, UploadFile | undefined>> {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/files?conversation_id=${conversationId}`;

  logger.info(`Try to get uploaded file list from url: ${url}, conversation id: ${conversationId}`)
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'bearer ' + userToken
    },
  });


  if (!response.ok) {
    const statusCode = response.status;
    logger.error(`ERROR to get uploaded file list from url: ${url}, get status code: ${statusCode} resp info: " ${await response.text()}`);
    return {};
  }

  const data = await response.json();
  return data.data.files;
}
