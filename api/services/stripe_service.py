# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : stripe_service.py
@Author: White Gui
@Date  : 2025/5/14
@Desc :
"""
from datetime import datetime

from sqlalchemy.future import select
from sqlalchemy.orm import Session

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
        if event_type == 'payment_intent.succeeded':
            return await _handle_payment_intent_succeeded(event_data, db_session)

        elif event_type == 'payment_intent.payment_failed':
            return await _handle_payment_intent_failed(event_data, db_session)

        elif event_type == 'checkout.session.completed':
            return await _handle_checkout_session_completed(event_data, db_session)

        else:
            log.info(f"Unhandled event type: {event_type}")
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
    log.info(f"Checkout session completed: {session_id}")

    # If the checkout session has a payment_intent, find the order
    if 'payment_intent' in checkout_session:
        payment_intent_id = checkout_session['payment_intent']
        stmt = select(Order).where(Order.payment_intent_id == payment_intent_id)
        result = db_session.execute(stmt)
        order = result.scalars().first()

        if not order:
            log.warning(f"Order not found for payment_intent_id: {payment_intent_id}")
            return None

        # Update customer ID if available
        if 'customer' in checkout_session:
            order.customer_id = checkout_session['customer']

        # Update payment method if available
        if 'payment_method' in checkout_session:
            order.payment_method_id = checkout_session['payment_method']

        db_session.commit()
        log.info(f"Order {order.order_number} updated with checkout session data")
        return order

    log.warning(f"No payment_intent found in checkout session: {session_id}")
    return None
