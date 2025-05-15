# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : strapi_cli.py
@Author: White Gui
@Date  : 2025/5/15
@Desc :
"""
import stripe

from common.const import CONST


async def get_stripe_client():
    stripe.api_key = CONST.STRIPE_SECRET_KEY
    return stripe
