"use server"
import qs from "qs";
import {getStrapiAPI} from "@/app/library/common/api-helpers";
import {logger} from "@/app/library/common/logger";
import util from "util";

export async function fetchAPI(
  path: string,
  urlParamsObject = {},
  options = {}
) {
  let requestUrl = ""
  try {
    // Merge default and user options
    const mergedOptions = {
      next: {revalidate: 60},
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject);
    requestUrl = `${getStrapiAPI(
      `/api${path}${queryString ? `?${queryString}` : ""}`
    )}`;

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    const status = response.status;
    if (200 !== status) {
      logger.error(util.format("ERROR to get data from server: ", requestUrl, ", status code: ", status, ", response info: ", await response.text()))
      return {}
    }
    return await response.json();
  } catch (error) {
    logger.error(util.format("ERROR to fetch: ", requestUrl, ", error info: ", error));
    return {}
  }
}
