# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : user_service.py
@Author: White Gui
@Date  : 2025/4/12
@Desc :
"""
from common.const import CONST
from common.globals import GLOBALS
from models import User


async def set_email_activated(email: str):
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        session.query(User).filter(User.email == email).update({User.is_active: True, User.status: CONST.ACTIVATED})


def get_user(username_or_email: str) -> User:
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        user_obj = session.query(User).filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).one_or_none()

        if user_obj:
            # Option 1: Force load all attributes
            session.refresh(user_obj)
            # Make SQLAlchemy load all attributes
            session.expunge(user_obj)

    return user_obj


def register_email_confirmed_user(user_info: dict) -> User:
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        user = User(**user_info)
        user.is_active = True
        user.status = CONST.ACTIVATED
        session.add(user)
        session.commit()
        session.refresh(user)
        session.expunge(user)

    return user
