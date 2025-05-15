# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : messages.py
@Author: White Gui
@Date  : 2025/3/20
@Desc :
"""
import enum

from sqlalchemy import String, JSON, Text, Enum
from sqlalchemy.orm import mapped_column, Mapped

from models.db.base import Base, BaseModel


class MessageStatus(enum.Enum):
    pending = 'pending'
    success = "success"
    failed = 'failed'
    canceled = 'canceled'


class Message(Base, BaseModel):
    """
        AI回答的消息记录表
    """
    __tablename__ = 'message'
    message_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    product_id: Mapped[str] = mapped_column(String(36), primary_key=True)
    conversation_id: Mapped[str] = mapped_column(String(36), nullable=False)
    payment_intent_id: Mapped[str] = mapped_column(String(36), nullable=False)
    status = mapped_column(Enum(MessageStatus, name="status"), default='pending',
                           nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    metafield: Mapped[str] = mapped_column(JSON(), nullable=False, default="")
