# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : ai.py
@Author: White Gui
@Date  : 2025/5/7
@Desc :
"""
from typing import Annotated
from typing import Dict, Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi import Body

from common import utils
from common.const import CONST
from common.logger import log
from models import User
from services.ai_service import submit_ai_check, convert_markdown_to_html
from services.auth_service import get_current_user
from services.message_service import get_latest_message

router = APIRouter()


@router.get("/ai")
async def get_ai_result(
        current_user: Annotated[User, Depends(get_current_user)],
        product_id: Optional[str] = Query(None, alias=CONST.PRODUCT_ID),
        conversation_id: Optional[str] = Query(None, alias=CONST.CONVERSATION_ID),
):
    params = {"product_id": product_id, "conversation_id": conversation_id}
    message_dict = get_latest_message(product_id, conversation_id)
    if not message_dict:
        log.error(f"ERROR to get empty message by params: {params}")
        raise HTTPException(status_code=400, detail="Failed to get message")

    answer = message_dict.get(CONST.ANSWER)
    message_dict[CONST.ANSWER] = await convert_markdown_to_html(answer)
    data = {
        CONST.MESSAGE: message_dict
    }
    log.info(f"SUCCESS to get message info, params data: {params},get result data: {data}")
    return utils.resp_success(data=data)


@router.post("/ai")
async def submit_ai_result(
        current_user: Annotated[User, Depends(get_current_user)],
        data: Dict[str, Any] = Body(...)
):
    """
        提交审核结果
    """
    log.info(f"Try to submit ai check with post data: {data}")
    product_id = data.get(CONST.PRODUCT_ID)
    conversation_id = data.get(CONST.CONVERSATION_ID)
    locale = data.get(CONST.LOCALE)
    message_dict = get_latest_message(product_id, conversation_id)
    if message_dict:
        answer = message_dict.get(CONST.ANSWER)
        message_dict[CONST.ANSWER] = await convert_markdown_to_html(answer)
        response_data = {
            CONST.MESSAGE: message_dict
        }
        log.info(f"SUCCESS to reuse the post data: {data}, result data: {response_data}")
    else:
        result = await submit_ai_check(product_id, conversation_id, locale)
        response_data = {
            CONST.MESSAGE: result
        }
        log.info(f"SUCCESS to submit ai check, post data: {data},get result data: {response_data}")

    return utils.resp_success(data=response_data)


@router.put("/ai")
async def regenerate_ai_result(
        data: Dict[str, Any] = Body(...)
):
    """
        重新生成AI结果
    """
    log.info(f"Try to submit ai check with post data: {data}")
    product_id = data.get(CONST.PRODUCT_ID)
    conversation_id = data.get(CONST.CONVERSATION_ID)
    locale = data.get(CONST.LOCALE)
    result = await submit_ai_check(product_id, conversation_id, locale)
    response_data = {
        CONST.MESSAGE: result
    }
    log.info(f"SUCCESS to submit ai check, post data: {data},get result data: {response_data}")
    return utils.resp_success(data=response_data)
