# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : ai.py
@Author: White Gui
@Date  : 2025/5/15
@Desc :
"""
from pydantic import BaseModel


class AIVO(BaseModel):
    product_id: str
    conversation_id: str
    session_id: str
    locale: str
