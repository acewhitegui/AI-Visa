# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : conversation_service.py
@Author: White Gui
@Date  : 2025/5/7
@Desc :
"""
from typing import List

from sqlalchemy.orm import Session

from common.const import CONST
from common.globals import GLOBALS
from models.db import Conversation
from models.view.conversation import PostConversationVO, ModifyConversationVO, ConversationListVO, DeleteConversationVO


async def create_conversation(user_id: int, conversation: PostConversationVO) -> Conversation:
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        conversation = Conversation(**conversation.model_dump())
        conversation.user_id = user_id
        session.add(conversation)
        session.commit()
        session.refresh(conversation)
        session.expunge(conversation)

    return conversation


async def get_conversation_list(user_id: int, params: ConversationListVO) -> List[dict]:
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        product_id = params.product_id
        obj_list = session.query(Conversation).filter(Conversation.user_id == user_id,
                                                      Conversation.product_id == product_id).all()
        if not obj_list:
            return []

        return [x.to_dict() for x in obj_list]


async def get_conversation(user_id: int, conversation_id: str) -> Conversation:
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        conversation = session.query(Conversation).filter(Conversation.user_id == user_id,
                                                          Conversation.conversation_id == conversation_id).one_or_none()
        if conversation:
            session.expunge(conversation)

    return conversation

async def update_conversation_final_step(user_id:int,conversation_id:str,session:Session):
    update_result = session.query(Conversation).filter(Conversation.user_id == user_id,
                                                       Conversation.conversation_id == conversation_id).update(
        {CONST.STEP:2})
    return update_result

async def update_conversation(user_id: int, conversation: ModifyConversationVO):
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        conversation_id = conversation.conversation_id
        update_result = session.query(Conversation).filter(Conversation.user_id == user_id,
                                                           Conversation.conversation_id == conversation_id).update(
            conversation.model_dump(exclude_none=True))
        session.commit()

    return update_result


async def delete_conversation(user_id: int, conversation: DeleteConversationVO):
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        conversation_id = conversation.conversation_id
        delete_result = session.query(Conversation).filter(Conversation.user_id == user_id,
                                                           Conversation.conversation_id == conversation_id).delete()
        session.commit()

    return delete_result
