# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : test_strapi_service.py
@Author: White Gui
@Date  : 2025/5/8
@Desc :
"""
import pprint
import shutil
import unittest

from services.ai_service import get_rendered_md_content, convert_markdown_to_html
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

    async def test_get_rendered_md_content(self):
        shutil.copyfile("../models/templates/report.md", "./models/templates/report.md")
        test_data = {
            'passport_info': {'passport_number_length': 9, 'passport_number': 'EJ5863095', 'name': 'YANG, XINGLAI',
                              'sex': 'F', 'nationality': 'CHINESE', 'date_of_birth': '2006-03-14',
                              'place_of_birth': 'HUBEI', 'date_of_issue': '2022-08-04', 'place_of_issue': 'LONDON',
                              'date_of_expiry': '2032-08-03',
                              'authority': 'EMBASSY OF P.R.CHINA IN THE UNITED KINGDOM'}, 'materials': [
                {'requirement': "Retrieve the 'passport number' and 'issue date' from the application form.",
                 'status': 'Compliant',
                 'note': "Passport number 'EJ5863095' and issue date '2022-08-04' from the application form (see page 2) match the passport exactly."},
                {'requirement': 'Ensure that all personal information is accurate and error-free.',
                 'status': 'Compliant',
                 'note': "Name ('Xinglai Yang'), sex ('Female'), nationality ('Chinese'), and date of birth ('2006-03-14') in the application form (pages 1-3) are accurate per passport."},
                {'requirement': 'Verify that the details match the information provided in the CAS document.',
                 'status': 'Compliant',
                 'note': 'CAS (page 3) shows: Family Name (Yang), Given Name (Xinglai), Date of Birth (14/03/2006), Nationality (Chinese), Passport Number (EJ5863095) — all match application form and passport.'},
                {
                    'requirement': "Confirm consistency between the 'passport number' and 'issue date' in the passport and those entered in the application form.",
                    'status': 'Compliant',
                    'note': "'Passport number' and 'issue date' in the application form (page 2) exactly match the passport."},
                {
                    'requirement': "Select the appropriate application pathway (Student visa): On the first page of the application form, under the section labeled 'TYPE OF VISA / APPLICATION,' specify 'Student.'",
                    'status': 'Compliant',
                    'note': "The section 'TYPE OF VISA/APPLICATION' on page 1 of the application form shows the choice 'Student.'"},
                {'requirement': 'Correct personal information in CAS document.', 'status': 'Compliant',
                 'note': 'All personal details (name, date of birth, nationality, passport number) in CAS (page 3) are accurate and error-free compared to the passport.'}],
            'evaluations': [{'project': 'Incomplete Application Form.pdf',
                             'result': 'No material errors. All passport and personal data fields are consistent and accurate according to the passport and CAS.',
                             'note': 'Passport number and issue date precisely match passport details; application pathway correctly selected; all critical fields are verified and error-free.'},
                            {'project': 'Xinglai Yang CAS.pdf', 'result': 'Fully consistent and correct.',
                             'note': 'CAS information — including passport number, name, sex, nationality, and date of birth — precisely matches the passport. No discrepancies found.'}]}
        result = get_rendered_md_content(test_data)
        print(f"md content:\n {result}")
        final = await convert_markdown_to_html(result)
        print(final)


if __name__ == '__main__':
    unittest.main()
