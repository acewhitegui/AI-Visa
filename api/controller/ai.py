# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : ai.py
@Author: White Gui
@Date  : 2025/5/7
@Desc :
"""
from typing import Annotated
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from common import utils
from common.const import CONST
from common.logger import log
from models import User
from models.view.ai import AIVO
from services.ai_service import submit_ai_check, convert_markdown_to_html
from services.auth_service import get_current_user
from services.message_service import get_latest_message
from services.stripe_service import validate_stripe_session

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
        data: AIVO
):
    """
        提交审核结果
    """
    log.info(f"Try to submit ai check with post data: {data.model_dump()}")
    user_id = current_user.id
    session_id = data.session_id
    is_valid, payment_intent_id = await validate_stripe_session(user_id, session_id)
    if not is_valid:
        raise HTTPException(400, detail=f"Invalid session id: {session_id}")

    product_id = data.product_id
    conversation_id = data.conversation_id
    locale = data.locale
    result = await submit_ai_check(product_id, conversation_id, locale)
    response_data = {
        CONST.MESSAGE: result
    }
    log.info(f"SUCCESS to submit ai check, post data: {data},get result data: {response_data}")
    return utils.resp_success(data=response_data)


@router.put("/ai")
async def regenerate_ai_result(
        current_user: Annotated[User, Depends(get_current_user)],
        data: AIVO
):
    """
        重新生成AI结果
    """
    log.info(f"Try to submit ai check with post data: {data.model_dump()}")
    user_id = current_user.id
    session_id = data.session_id
    is_valid, payment_intent_id = await validate_stripe_session(user_id, session_id)
    if not is_valid:
        raise HTTPException(400, detail=f"Invalid session id: {session_id}")

    product_id = data.product_id
    conversation_id = data.conversation_id
    locale = data.locale
    result = await submit_ai_check(product_id, conversation_id, payment_intent_id, locale)
    response_data = {
        CONST.MESSAGE: result
    }
    log.info(f"SUCCESS to submit ai check, post data: {data},get result data: {response_data}")
    return utils.resp_success(data=response_data)
