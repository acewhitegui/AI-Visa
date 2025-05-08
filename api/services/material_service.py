# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : material_service.py
@Author: White Gui
@Date  : 2025/5/8
@Desc :
"""


async def get_material_list(product_id, conversation_id):
    """
        查询客户需要的材料列表
        1. 查询产品本身需要的材料清单 from strapi
        2. 查询对话客户的答案 from db
        3. 从保存的答案中，查询额外增加的材料清单 from strapi
    :param product_id:
    :param conversation_id:
    :return:
    """
    return None