# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : order_service.py
@Author: White Gui
@Date  : 2025/5/14
@Desc :
"""
from sqlalchemy.orm import joinedload

from common.const import CONST
from common.globals import GLOBALS
from models.db import Order


async def get_order_by_number(user_id: int, order_number: str) -> Order | None:
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        order_obj: Order = session.query(Order).options(joinedload(Order.user)).filter(Order.user_id == user_id,
                                                                                       Order.order_number == order_number).one_or_none()
        if not order_obj:
            return None

        if order_obj.user:
            _ = order_obj.user.id

        session.commit()
        session.refresh(order_obj)
        session.expunge_all()
        return order_obj


async def refresh_order_details(order_numer: str, charge_details: dict) -> Order:
    is_paid = charge_details.get(CONST.PAID)
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        order: Order = session.query(Order).options(joinedload(Order.user)).filter(
            Order.order_number == order_numer).one_or_none()
        # update fields
        order.charge_id = charge_details.get(CONST.ID)
        order.status = CONST.PAID if is_paid else charge_details.get(CONST.STATUS)
        order.payment_method_id = charge_details.get(CONST.PAYMENT_METHOD)
        order.payment_method_details = dict(charge_details.get(CONST.PAYMENT_METHOD_DETAILS))
        # handle session
        if order.user:
            _ = order.user.id
        session.commit()
        session.refresh(order)
        session.expunge_all()
        return order


async def get_order_list(user_id: int) -> list:
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        obj_list = session.query(Order).options(joinedload(Order.user)).filter(Order.user_id == user_id).all()
        if not obj_list:
            return []

        return [x.to_dict() for x in obj_list]
