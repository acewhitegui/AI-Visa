# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : strapi.py
@Author: White Gui
@Date  : 2025/5/8
@Desc :
"""

import aiohttp

from common.const import CONST
from common.logger import log


async def get_resource_list(resource_path: str, locale: str, filters: dict = None, populate: dict = None):
    # Build the query parameters
    params = __build_strapi_params(locale=locale, filters=filters, populate=populate)

    headers = {
        CONST.AUTHORIZATION: f"bearer {CONST.STRAPI_API_TOKEN}",
    }

    # Set the API URL
    base_url = CONST.STRAPI_BASE_URL
    url = f"{base_url}/{resource_path}"

    log.info(f"Try to get resource list from server: {url}, params: {params}")
    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params, headers=headers) as response:
            if response.status != 200:
                error_text = await response.text()
                raise Exception(f"Failed to fetch resources: {response.status} - {error_text}")

            data = await response.json()
            log.info(f"SUCCESS to get resource list from server: {url}, params: {params}")

    return data.get(CONST.DATA, {})


def __build_strapi_params(
        sort=None,
        filters=None,
        populate=None,
        fields=None,
        pagination=None,
        status=None,
        locale=None
):
    """
    Build query parameters for Strapi API in the correct format.

    Args:
        sort (list, optional): List of sorting criteria, e.g. ['title:asc', 'createdAt:desc']
        filters (dict, optional): Filtering criteria
        populate (dict, optional): Relations to populate
        fields (list, optional): Fields to return
        pagination (dict, optional): Pagination options with 'page' and 'pageSize'
        status (str, optional): Content status filter
        locale (str or list, optional): Locale(s) to return

    Returns:
        dict: Formatted query parameters for Strapi API
    """
    params = {}

    # Handle sort parameter
    if sort:
        for i, sort_item in enumerate(sort):
            params[f"sort[{i}]"] = sort_item

    # Handle filters parameter (recursively)
    if filters:
        _build_nested_params(params, "filters", filters)

    # Handle populate parameter (recursively)
    if populate:
        _build_nested_params(params, "populate", populate)

    # Handle fields parameter
    if fields:
        for i, field in enumerate(fields):
            params[f"fields[{i}]"] = field

    # Handle pagination parameter
    if pagination:
        for key, value in pagination.items():
            params[f"pagination[{key}]"] = value

    # Handle status parameter
    if status:
        params["status"] = status

    # Handle locale parameter
    if locale:
        if isinstance(locale, list):
            for i, loc in enumerate(locale):
                params[f"locale[{i}]"] = loc
        else:
            params["locale"] = locale

    return params


def _build_nested_params(params, prefix, obj):
    """
    Recursively build nested parameters for Strapi API.

    Args:
        params (dict): Parameters dictionary to update
        prefix (str): Current parameter prefix
        obj: The object to process (dict, list, or primitive value)
    """
    if isinstance(obj, dict):
        for key, value in obj.items():
            new_prefix = f"{prefix}[{key}]"
            _build_nested_params(params, new_prefix, value)
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            new_prefix = f"{prefix}[{i}]"
            _build_nested_params(params, new_prefix, item)
    else:
        # For primitive values
        params[prefix] = obj
