# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : test_stripe_service.py
@Author: White Gui
@Date  : 2025/5/15
@Desc :
"""
import pprint
import unittest

from services.stripe_service import get_charge_details


class TestTemplate(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        pass

    def tearDown(self) -> None:
        pass

    async def test_get_charge_details(self):
        payment_intent_id = "pi_3ROc004N0ZpvGvcG14ggcWg5"
        details = await get_charge_details(payment_intent_id)
        pprint.pprint(details)

    async def test_get_charge_details_notfound(self):
        payment_intent_id = "123"
        details = await get_charge_details(payment_intent_id)
        pprint.pprint(details)


if __name__ == '__main__':
    unittest.main()
