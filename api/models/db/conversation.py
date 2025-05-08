# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : conversations.py
@Author: White Gui
@Date  : 2025/3/20
@Desc :
"""

from sqlalchemy import String, Integer, Column, JSON
from sqlalchemy.orm import Mapped, mapped_column

from common import utils
from models.db.base import Base, BaseModel


class Conversation(Base, BaseModel):
    """
        对话列表
    """
    __tablename__ = 'conversation'
    conversation_id: Mapped[str] = mapped_column(String(36), primary_key=True, default=utils.generate_uuid)
    product_id: Mapped[int] = Column(Integer, nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    name = mapped_column(String(32), nullable=False)  # 对话名称
    step = mapped_column(Integer, default=0)
    answers: Mapped[dict] = mapped_column(JSON)
