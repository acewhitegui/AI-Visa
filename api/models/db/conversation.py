# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : conversations.py
@Author: White Gui
@Date  : 2025/3/20
@Desc :
"""

from sqlalchemy import String, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column

from models.db.base import Base, BaseModel


class Conversation(Base, BaseModel):
    """
        对话列表
    """
    __tablename__ = 'conversation'
    conversation_id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), nullable=False)
    name = mapped_column(String(32), default="")  # 对话名称
    step = mapped_column(Integer, default=0)
    answers = mapped_column(Text)
