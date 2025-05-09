# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : material_service.py
@Author: White Gui
@Date  : 2025/5/8
@Desc :
"""

from fastapi import HTTPException

from common.const import CONST
from dao.cms import strapi
from models.view.material import MaterialVO
from services import product_service, conversation_service, question_service


async def get_material_list(user_id: int, params: MaterialVO):
    """
        查询客户需要的材料列表
        1. 查询产品本身需要的材料清单 from strapi
        2. 查询对话客户的答案 from db
        3. 从保存的答案中，查询额外增加的材料清单 from strapi
    :return:
    """
    # 查询产品本身
    product_details = await product_service.get_product_details(params.product_id, params.locale)
    default_materials = product_details.get(CONST.MATERIALS)
    # 查询对话答案
    conversation_id = params.conversation_id
    conversation_details = await conversation_service.get_conversation(user_id, conversation_id)
    if not conversation_details:
        raise HTTPException(status_code=404, detail=f"Conversation not found, id: {conversation_id}")
    # 查询增加的材料
    answers_dict = conversation_details.answers
    if not answers_dict:
        return default_materials

    for question_id, choice_dict in answers_dict.items():
        user_choice_id = choice_dict.get(CONST.CHOICE_ID)
        question_details = await question_service.get_question_details(question_id, params.locale)
        choices = question_details.get(CONST.CHOICES)
        for choice in choices:
            choice_id = choice.get(CONST.ID)
            if choice_id == user_choice_id:
                default_materials.extend(choice.get(CONST.MATERIALS))

    return default_materials


async def get_material(document_id, locale):
    result = await strapi.get_resource_list(f"materials/{document_id}", locale)
    return result
