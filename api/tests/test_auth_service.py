# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : test_auth_service.py
@Author: White Gui
@Date  : 2025/5/19
@Desc :
"""
import unittest
from datetime import timedelta

from common.const import CONST
from services import auth_service, jwt_service
from services.auth_service import verify_password, get_password_hash, create_access_token


class TestTemplate(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        pass

    def tearDown(self) -> None:
        pass

    def test_verify_password(self):
        plain = "AVgp@8789502"
        current_hash = get_password_hash(plain)

        current_result = verify_password(plain, current_hash)
        self.assertTrue(current_result)

        access_token, _ = create_access_token(
            data={
                CONST.EMAIL: "aceguipeng@gmail.com",
                CONST.USERNAME: "aceguipeng",
                CONST.PASSWORD_HASH: auth_service.get_password_hash(plain),
                CONST.FIRST_NAME: "",
                CONST.LAST_NAME: "",
            },
            expires_delta=timedelta(minutes=CONST.ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        decoded_data = jwt_service.decode_jwt(access_token)
        decoded_hash = decoded_data.get(CONST.PASSWORD_HASH)
        decoded_check_result = verify_password(plain, decoded_hash)
        self.assertTrue(decoded_check_result)

        hashed = "$2b$12$CpYLpJyXlqlw1ZPuFPVmCuAjls2i299hSfKMUcggwlsHxnvxJCHXq"
        result = verify_password(plain, hashed)
        self.assertTrue(result)


if __name__ == '__main__':
    unittest.main()
