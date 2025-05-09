# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : conversation.py
@Author: White Gui
@Date  : 2025/5/7
@Desc :
"""
from typing import Optional

from pydantic import BaseModel


class ConversationVO(BaseModel):
    conversation_id: str


class PostConversationVO(BaseModel):
    product_id: str
    name: str
    answers: dict


class ConversationListVO(BaseModel):
    product_id: str


class ModifyConversationVO(BaseModel):
    conversation_id: str
    name: str
    answers: Optional[dict] = None
    step: Optional[int] = None

class DeleteConversationVO(BaseModel):
    conversation_id: str
