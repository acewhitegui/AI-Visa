# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : webhook.py
@Author: White Gui
@Date  : 2025/5/14
@Desc :
"""
import json
import os

import stripe
from fastapi import APIRouter, BackgroundTasks
from starlette.exceptions import HTTPException
from starlette.requests import Request

from common import utils
from common.logger import log
from services.stripe_service import handle_stripe_event

router = APIRouter()


@router.post("/stripe/webhook")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks):
    body = {}
    try:
        body = await request.body()
        log.info(f"Try to handle stripe webhook data: {body}")
        # Set your Stripe API key
        stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

        # Webhook secret for validating the event
        endpoint_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')

        # Verify webhook signature and construct the event
        stripe_event = stripe.Event.construct_from(
            json.loads(body),
            endpoint_secret
        )

        background_tasks.add_task(handle_stripe_event, stripe_event)
        return utils.resp_success()
    except Exception as e:
        log.exception(f"Error processing webhook: {body}, error info: {str(e)}")
        raise HTTPException(status_code=400, detail="processing backed error")
