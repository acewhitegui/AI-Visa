"use server"

import {ImageItem, PDFResponse} from "@/app/library/objects/image";

export async function imagesToPDF(images: ImageItem[]): Promise<PDFResponse> {
  const ANY_CONVERTERS_API_BASE = process.env.ANY_CONVERTERS_API_BASE;

  if (!ANY_CONVERTERS_API_BASE) {
    throw new Error('API base URL is not configured. Set ANY_CONVERTERS_API_BASE environment variable.');
  }

  const url = `${ANY_CONVERTERS_API_BASE}/image/images-to-pdf`;
  console.log("Attempting to convert images to PDF using server: ", url);

  const formData = new FormData();
  formData.set("expires", "86400")
  // handles images
  for (const image of images) {
    if (!image.url && !image.file) {
      continue;
    }

    if (image.file) {
      // If it's a file object, add it directly
      formData.append("images", image.file);
    } else if (image.url) {
      // If it's a URL, fetch the file and append it
      try {
        const fileResponse = await fetch(image.url);
        const blob = await fileResponse.blob();
        const fileName = `image-${Date.now()}.jpg`;
        const file = new File([blob], fileName, {type: blob.type});
        formData.append("images", file);
      } catch (error) {
        console.error(`Failed to fetch image from URL ${image.url}:`, error);
      }
    }
  }
  // upload to server
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error converting images to PDF');
    }

    const data: PDFResponse = await response.json();
    console.log("Successfully converted images to PDF from server: ", url, ", response data: ", data);
    return data;
  } catch (error) {
    console.error("Failed to convert images to PDF:", error);
    throw error;
  }
}