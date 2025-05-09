"use server"
import {getApiBaseUrl} from "@/app/library/common/api-helpers";

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
