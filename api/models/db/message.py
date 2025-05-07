# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : messages.py
@Author: White Gui
@Date  : 2025/3/20
@Desc :
"""

from sqlalchemy.orm import mapped_column

from models.db.base import Base, BaseModel


class Message(Base, BaseModel):
    """
        AI回答的消息记录表
    """
    __tablename__ = 'message'
    message_id = mapped_column(max_length=50, primary_key=True, default="")
    answer = mapped_column(blank=False, default="")
    metadata = mapped_column(blank=False, default=dict)
