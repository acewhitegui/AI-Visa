# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : message_service.py
@Author: White Gui
@Date  : 2025/4/7
@Desc :
"""
import json

from common.const import CONST
from common.globals import GLOBALS
from models.db import Message, Conversation


def get_latest_message(product_id: str, conversation_id: str):
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        message = session.query(Message).filter(Message.product_id == product_id,
                                                Message.conversation_id == conversation_id).order_by(
            Message.created_at.desc()).first()
        if not message:
            return {}

        return message.to_dict()


def save_message(product_id: str, conversation_id: str, payment_intent_id: str, ai_message: dict):
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        session.query(Conversation).filter(Conversation.conversation_id == conversation_id).update({CONST.STEP: 2})

        metadata = json.dumps(ai_message.pop(CONST.USAGE, {}))
        message = Message()
        message.message_id = ai_message.get(CONST.ID)
        message.conversation_id = conversation_id
        message.product_id = product_id
        message.payment_intent_id = payment_intent_id
        message.status = CONST.SUCCESS
        message.answer = ai_message.get(CONST.CHOICES, [])[0].get(CONST.MESSAGE, {}).get(CONST.CONTENT, "")
        message.metafield = metadata
        session.add(message)
        session.commit()
        session.refresh(message)
        session.expunge(message)

        return message.to_dict()
