# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : question_service.py
@Author: White Gui
@Date  : 2025/5/8
@Desc :
"""
from common.const import CONST
from dao.cms import strapi


async def get_question_details(question_id: str, locale: str):
    populate = {
        CONST.CHOICES: {
            CONST.POPULATE: {
                CONST.MATERIALS: {
                    CONST.FIELDS: [CONST.TITLE, CONST.TYPE, CONST.LIMITS]
                }
            },
        }
    }
    result = await strapi.get_resource_list(f"questions/{question_id}", locale, populate=populate)
    return result
