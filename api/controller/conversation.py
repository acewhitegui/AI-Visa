# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : conversation.py
@Author: White Gui
@Date  : 2025/5/7
@Desc :
"""
from typing import Annotated

from fastapi import APIRouter, Depends

from common import utils
from models import User
from models.db import Conversation
from models.view.conversation import ConversationVO
from services import conversation_service
from services.auth_service import get_current_user

router = APIRouter()


@router.post("/conversation")
async def create_conversation(conversation: ConversationVO, current_user: Annotated[User, Depends(get_current_user)]):
    """
        创建会话
    :param conversation:
    :return:
    """
    user_id = current_user.id
    db_data: Conversation = await conversation_service.create_conversation(user_id, conversation)
    return utils.resp_success(data=db_data.to_dict())


@router.put("/conversation")
async def update_conversation(conversation):
    pass


@router.get("/conversations")
async def get_conversation_list():
    return {"message": "Hello World"}


@router.delete("/conversation")
async def delete_conversation(conversation_id):
    pass
