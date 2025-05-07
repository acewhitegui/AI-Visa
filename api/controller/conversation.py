# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : conversation.py
@Author: White Gui
@Date  : 2025/5/7
@Desc :
"""
from fastapi import APIRouter

from common import utils

router = APIRouter()


@router.post("/conversation")
async def create_conversation(conversation):
    """
        创建会话
    :param conversation:
    :return:
    """
    return utils.resp_success()


@router.put("/conversation")
async def update_conversation(conversation):
    pass


@router.get("/conversation")
async def get_conversation_list():
    return {"message": "Hello World"}


@router.delete("/conversation")
async def delete_conversation(conversation_id):
    pass
