# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : auth.py
@Author: White Gui
@Date  : 2025/4/12
@Desc :
"""
import datetime
from datetime import timedelta

from fastapi import APIRouter
from fastapi import Depends, status
from fastapi.exceptions import HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from typing_extensions import Annotated

from common import utils
from common.const import CONST
from models import User
from models.view.auth import UserRegistrationForm, Token
from services import jwt_service, auth_service, user_service
from services.auth_service import create_access_token, authenticate_user, send_verify_email, get_current_user

router = APIRouter()


@router.post("/login", response_model=Token)
async def login_for_access_token(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=CONST.ACCESS_TOKEN_EXPIRE_MINUTES)
    email = user.email
    access_token = create_access_token(
        data={
            CONST.EMAIL: email,
            CONST.USERNAME: form_data.username,
            CONST.PASSWORD_HASH: auth_service.get_password_hash(form_data.password),
            CONST.FIRST_NAME: user.first_name,
            CONST.LAST_NAME: user.last_name,
        }, expires_delta=access_token_expires
    )
    return Token(
        username=user.username,
        email=email,
        access_token=access_token,
        token_type="bearer")


@router.post("/register", response_model=Token)
async def register_user_endpoint(
        form_data: Annotated[UserRegistrationForm, Depends()],
) -> Token:
    """
        Register a new user
        1. generate a confirmed email
        2. send confirmation email
    """
    email = form_data.email
    access_token = create_access_token(
        data={
            CONST.EMAIL: email,
            CONST.USERNAME: form_data.username,
            CONST.PASSWORD_HASH: auth_service.get_password_hash(form_data.password),
            CONST.FIRST_NAME: form_data.first_name,
            CONST.LAST_NAME: form_data.last_name,
        },
        expires_delta=timedelta(minutes=CONST.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    verify_url = await send_verify_email(email, access_token)
    return utils.resp_success(data={
        CONST.VERIFY_URL: verify_url
    })


@router.get("/verify-email")
async def confirm_verify_email(token: str):
    """
        校验参数
        1. 提取token
        2. 解析token
        3. 判定是否过期
        4. 状态变更
    """
    if not token:
        return utils.resp_failure(reason="params error")

    decoded_data = jwt_service.decode_jwt(token)
    expires_at = decoded_data.pop(CONST.EXPIRE, 0)
    if expires_at < datetime.datetime.now().timestamp():
        return utils.resp_failure(reason="expired")

    user = user_service.register_email_confirmed_user(decoded_data)
    return utils.resp_success(data=user.to_dict())


@router.post("/logout")
async def logout():
    # Since JWT is stateless, the client is responsible for discarding the token
    # Server-side, we just return a successful response
    return {"message": "Successfully logged out"}


@router.get("/users/me")
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user
