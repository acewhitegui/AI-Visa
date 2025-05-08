# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : test_strapi_service.py
@Author: White Gui
@Date  : 2025/5/8
@Desc :
"""
import pprint
import unittest

from services.product_service import get_product_details
from services.question_service import get_question_details


class TestTemplate(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        pass

    def tearDown(self) -> None:
        pass

    async def test_get_product_details(self):
        product_id = "ijzrdfa02ikjedahw4zdb8to"
        locale = "en"
        result = await get_product_details(product_id, locale)
        self.assertIsInstance(result, dict)
        document_id = result.get("documentId")
        self.assertEqual(document_id, product_id)
        pprint.pprint(result)

    async def test_get_question_details(self):
        question_id = "yclryfbuayh7tdc4git7927i"
        locale = "en"
        result = await get_question_details(question_id, locale)
        pprint.pprint(result)


if __name__ == '__main__':
    unittest.main()
