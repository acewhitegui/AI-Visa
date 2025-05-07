# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : messages.py
@Author: White Gui
@Date  : 2025/3/20
@Desc :
"""

from sqlalchemy import String, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column

from models.db.base import Base, BaseModel


class Message(Base, BaseModel):
    """
        对话列表
    """
    __tablename__ = 'message'
    chat_id: Mapped[str] = mapped_column(String(36), primary_key=True)
    conversation_id: Mapped[str] = mapped_column(String(36), nullable=False)
    user_send: Mapped[str] = mapped_column(Text, nullable=False)
    create_time: Mapped[int] = mapped_column(Integer, nullable=False)
    complete_data: Mapped[str] = mapped_column(Text, nullable=False)
    complete_type: Mapped[str] = mapped_column(Text, nullable=False)
    complete_time: Mapped[int] = mapped_column(Integer, nullable=False)
