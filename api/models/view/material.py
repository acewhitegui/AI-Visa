# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : material.py
@Author: White Gui
@Date  : 2025/5/8
@Desc :
"""
from pydantic import BaseModel


class MaterialVO(BaseModel):
    product_id: str
    conversation_id: str
    locale: str
