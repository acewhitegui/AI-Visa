# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : stripe_service.py
@Author: White Gui
@Date  : 2025/5/14
@Desc :
"""
from common.logger import log


async def handle_stripe_event(stripe_event: dict):
    """
        处理stripe事件内容
        1.
    :param stripe_event:
    :return:
    """

    log.info(f"Try to handle stripe event data: {stripe_event}")

    # Handle the event
    if stripe_event['type'] == 'payment_intent.succeeded':
        payment_intent = stripe_event['data']['object']
        print(f"Payment intent succeeded: {payment_intent['id']}")
        # Handle successful payment here

    elif stripe_event['type'] == 'payment_intent.payment_failed':
        payment_intent = stripe_event['data']['object']
        print(f"Payment failed: {payment_intent['id']}")
        # Handle failed payment here

    elif stripe_event['type'] == 'checkout.session.completed':
        checkout_session = stripe_event['data']['object']
        print(f"Checkout session completed: {checkout_session['id']}")
        # Handle completed checkout session here

    else:
        print(f"Unhandled event type: {stripe_event['type']}")
