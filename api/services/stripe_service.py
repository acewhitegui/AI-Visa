# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : stripe_service.py
@Author: White Gui
@Date  : 2025/5/14
@Desc :
"""
import uuid
from datetime import datetime

from sqlalchemy.future import select
from sqlalchemy.orm import Session

from common.const import CONST
from common.globals import GLOBALS
from common.logger import log
from models.db.order import Order


async def handle_stripe_event(stripe_event: dict):
    """
        处理stripe事件内容
        1. 根据事件类型更新订单状态
        2. 记录支付相关信息
        3. 处理成功/失败的支付
    :param stripe_event: Stripe webhook event data
    :return: Updated order or None
    """
    log.info(f"Try to handle stripe event data: {stripe_event}")

    event_type = stripe_event['type']
    event_data = stripe_event['data']['object']

    with GLOBALS.get_postgres_wrapper().session_scope() as db_session:
        # Handle the event
        if event_type == 'payment_intent.created':
            return await _handle_payment_intent_created(event_data, db_session)

        if event_type == 'payment_intent.succeeded':
            return await _handle_payment_intent_succeeded(event_data, db_session)

        elif event_type == 'payment_intent.payment_failed':
            return await _handle_payment_intent_failed(event_data, db_session)

        elif event_type == 'checkout.session.completed':
            return await _handle_checkout_session_completed(event_data, db_session)

        else:
            log.info(f"Unhandled event type: {event_type}")
            return None


async def _handle_payment_intent_created(payment_intent: dict, db_session: Session):
    """Handle created payment intent"""
    metadata = payment_intent.get(CONST.METADATA)
    if not metadata:
        return None

    payment_intent_id = payment_intent['id']
    user_id = payment_intent.get(CONST.USER_ID)
    amount = payment_intent.get(CONST.DATA, {}).get(CONST.AMOUNT)
    currency = payment_intent.get(CONST.DATA, {}).get(CONST.CURRENCY, "").upper()

    log.info(f"Creating new order for user {user_id} with amount {amount} {currency}, payment id: {payment_intent_id}")

    # Generate unique order number
    order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}-{int(datetime.now().timestamp())}"

    # Create payment intent with Stripe
    try:
        # Create order in database
        order = Order(
            user_id=user_id,
            order_number=order_number,
            amount=amount,
            currency=currency,
            status='pending',
            payment_intent_id=payment_intent_id,
        )

        db_session.add(order)
        db_session.commit()

        log.info(f"Created order {order_number} with payment intent {payment_intent_id}")
        return order
    except Exception as e:
        log.exception(f"ERROR to create order from payment intent: {payment_intent}, error inf: {str(e)}")
        return None


async def _handle_payment_intent_succeeded(payment_intent, db_session: Session):
    """Handle successful payment intent"""
    payment_intent_id = payment_intent['id']
    log.info(f"Payment intent succeeded: {payment_intent_id}")

    # Find the order by payment_intent_id
    stmt = select(Order).where(Order.payment_intent_id == payment_intent_id)
    result = db_session.execute(stmt)
    order = result.scalars().first()

    if not order:
        log.warning(f"Order not found for payment_intent_id: {payment_intent_id}")
        return None

    # Update order details
    order.status = 'paid'
    order.paid_at = datetime.now()

    # Update payment details
    if 'charges' in payment_intent and 'data' in payment_intent['charges'] and payment_intent['charges']['data']:
        charge = payment_intent['charges']['data'][0]
        order.charge_id = charge['id']

        if 'payment_method_details' in charge:
            order.payment_method_details = charge['payment_method_details']
            order.payment_method_type = charge['payment_method_details']['type']

    db_session.commit()
    log.info(f"Order {order.order_number} marked as paid")
    return order


async def _handle_payment_intent_failed(payment_intent, db_session: Session):
    """Handle failed payment intent"""
    payment_intent_id = payment_intent['id']
    log.info(f"Payment failed: {payment_intent_id}")

    # Find the order by payment_intent_id
    stmt = select(Order).where(Order.payment_intent_id == payment_intent_id)
    result = db_session.execute(stmt)
    order = result.scalars().first()

    if not order:
        log.warning(f"Order not found for payment_intent_id: {payment_intent_id}")
        return None

    # Update order status
    order.status = 'failed'

    # Store failure details if available
    if 'last_payment_error' in payment_intent:
        order.payment_method_details = payment_intent['last_payment_error']

    db_session.commit()
    log.info(f"Order {order.order_number} marked as failed")
    return order


async def _handle_checkout_session_completed(checkout_session, db_session: Session):
    """Handle completed checkout session"""
    session_id = checkout_session['id']
    log.info(f"_id Checkout session completed: {session_id}")

    # If the checkout session has a payment_intent, find the order
    if 'payment_intent' in checkout_session:
        payment_intent_id = checkout_session['payment_intent']
        stmt = select(Order).where(Order.payment_intent_id == payment_intent_id)
        result = db_session.execute(stmt)
        order = result.scalars().first()

        if not order:
            Noneone
