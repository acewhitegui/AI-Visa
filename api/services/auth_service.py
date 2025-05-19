# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : auth_service.py
@Author: White Gui
@Date  : 2025/4/10
@Desc :
"""

from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi import (
    Query, )
from fastapi import WebSocket
from fastapi.exceptions import WebSocketException
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext

from common.const import CONST
from common.logger import log
from dao.email.smtp import send_email
from models.view.auth import TokenData, User
from services import jwt_service
from services.user_service import get_user


async def send_verify_email(email: str, access_token: str):
    """
        发送确认邮件
    """
    verify_url = f"{CONST.WEB_SERVER_URL}/api/verify-email?token={access_token}"
    log.info(f"Try to verify email with url: {verify_url}")
    path = "./models/templates/email_confirm.html"
    from_addr = CONST.SMTP_USER
    to_addrs = [email]
    subject = "Verify Email"
    with open(path, "r", encoding=CONST.CODE_UTF8) as file:
        body_temp = file.read()

    body = body_temp.replace("{{verifyUrl}}", verify_url)
    send_email(from_addr, to_addrs, subject, body)
    log.info(f"SUCCESS to send verification email,confirm url: {verify_url}")
    return verify_url


async def send_reset_email(email: str, access_token: str):
    verify_url = f"{CONST.WEB_SERVER_URL}/api/reset-email?token={access_token}"
    log.info(f"Try to reset email with url: {verify_url}")
    path = "./models/templates/reset_confirm.html"
    from_addr = CONST.SMTP_USER
    to_addrs = [email]
    subject = "Reset Password Email"
    with open(path, "r", encoding=CONST.CODE_UTF8) as file:
        body_temp = file.read()

    body = body_temp.replace("{{verifyUrl}}", verify_url)
    # TODO add support email
    body = body_temp.replace("{{support_email}}", CONST.SUPPORT_EMAIL)
    send_email(from_addr, to_addrs, subject, body)
    log.info(f"SUCCESS to send reset password email,confirm url: {verify_url}")
    return verify_url

async def get_query_params(
        websocket: WebSocket,
        token: Annotated[str | None, Query()] = None,
        client_id: Annotated[str | None, Query()] = None,
        source: Annotated[str | None, Query()] = CONST.UNKNOWN,
):
    """
        进入handler前，从cookie和header中获取需要的信息
    :param websocket:
    :param token: JWT
    :param client_id: 客户端标识
    :param source: 客户端来源
    :return:
    """
    if not all([token, client_id]):
        log.error(f"ERROR to get empty params from {websocket.client}")
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)

    return token, client_id, source


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        log.warning(f"User {username} not found.")
        return False

    status = user.status
    if CONST.ACTIVATED != status:
        log.warning(f"User {username} is not activated, current status is {status}")
        return False

    if not verify_password(password, user.password_hash):
        log.warning(f"user password is incorrect, username: {username}")
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    expired_at = round(expire.timestamp())
    to_encode.update({CONST.EXPIRE: expired_at})
    encoded_jwt = jwt_service.encode_jwt(to_encode)
    return encoded_jwt, expired_at


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt_service.decode_jwt(token)
        username = payload.get(CONST.USERNAME)
        if username is None:
            raise credentials_exception

        token_data = TokenData(**payload)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(token_data.email)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
        current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
