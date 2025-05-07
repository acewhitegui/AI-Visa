# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : conversation.py
@Author: White Gui
@Date  : 2025/5/7
@Desc :
"""
from pydantic import BaseModel


class ConversationVO(BaseModel):
    product_id: str
    name: str
    answers: dict


class ConversationListVO(BaseModel):
    product_id: str


class ModifyConversationVO(BaseModel):
    conversation_id: str
    name: str
    answers: dict
