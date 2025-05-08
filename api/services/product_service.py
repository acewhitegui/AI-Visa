# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : product_service.py
@Author: White Gui
@Date  : 2025/5/8
@Desc :
"""
from common.const import CONST
from dao.cms import strapi


async def get_product_details(product_id: str, locale: str) -> dict:
    populate = {
        CONST.MATERIALS: {
            CONST.FIELDS: [CONST.TITLE, CONST.TYPE, CONST.LIMITS]
        }
    }
    result = await strapi.get_resource_list(f"products/{product_id}", locale, populate=populate)
    return result
