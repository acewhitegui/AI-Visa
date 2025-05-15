# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : order.py
@Author: White Gui
@Date  : 2025/5/15
@Desc :
"""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from common import utils
from models import User
from services import stripe_service, order_service
from services.auth_service import get_current_user
from services.order_service import get_order_by_number

router = APIRouter()


@router.get("/order/{order_number}")
async def get_order_details(order_number: str, current_user: Annotated[User, Depends(get_current_user)]):
    """
        获取订单详情
    :return:
    """
    user_id = current_user.id
    order = await get_order_by_number(user_id, order_number)
    if not order:
        raise HTTPException(status_code=404, detail=f"Not found order: {order_number}")

    return utils.resp_success(data=order.to_dict())


@router.post("/order/{order_number}/refresh")
async def refresh_order_details(order_number: str, current_user: Annotated[User, Depends(get_current_user)]):
    user_id = current_user.id
    order = await order_service.get_order_by_number(user_id, order_number)
    if not order:
        raise HTTPException(status_code=404, detail=f"Not found order: {order_number}")

    # go stripe to refresh order info
    charge_details = await stripe_service.get_charge_details(order.payment_intent_id)
    # refresh order info
    new_order = await order_service.refresh_order_details(order, charge_details)
    return utils.resp_success(data=new_order.to_dict())


@router.get("/orders")
async def get_order_list():
    """
        获取订单列表
    :return:
    """
    pass
