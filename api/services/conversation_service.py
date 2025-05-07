# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : conversation_service.py
@Author: White Gui
@Date  : 2025/5/7
@Desc :
"""
from common.globals import GLOBALS
from models.db import Conversation
from models.view.conversation import ConversationVO


async def create_conversation(conversation: ConversationVO) -> Conversation:
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        conversation = Conversation(**conversation.model_dump())
        session.add(conversation)
        session.commit()
        session.refresh(conversation)

    return conversation
