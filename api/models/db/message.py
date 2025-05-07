# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : messages.py
@Author: White Gui
@Date  : 2025/3/20
@Desc :
"""
from sqlalchemy import String, JSON
from sqlalchemy.orm import mapped_column, Mapped

from models.db.base import Base, BaseModel


class Message(Base, BaseModel):
    """
        AI回答的消息记录表
    """
    __tablename__ = 'message'
    message_id: Mapped[str] = mapped_column(String(36), primary_key=True)
    answer: Mapped[str] = mapped_column(JSON(), nullable=False)
    metafield: Mapped[str] = mapped_column(JSON(), nullable=False, default="")
