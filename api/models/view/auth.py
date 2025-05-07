# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : auth.py
@Author: White Gui
@Date  : 2025/4/14
@Desc :
"""
from typing import Union

from fastapi import Form
from pydantic import BaseModel
from typing_extensions import Annotated, Doc

from fastapi.security import OAuth2PasswordRequestForm


class UserRegistrationForm(OAuth2PasswordRequestForm):
    def __init__(self,
                 username: Annotated[
                     str,
                     Form(),
                     Doc(
                         """
                         `username` string. The OAuth2 spec requires the exact field name
                         `username`.
                         """
                     ),
                 ],
                 email: Annotated[str, Form()],
                 password: Annotated[
                     str,
                     Form(),
                     Doc(
                         """
                         `password` string. The OAuth2 spec requires the exact field name
                         `password".
                         """
                     ),
                 ],
                 scope: Annotated[
                     str,
                     Form(),
                     Doc(
                         """
                         A single string with actually several scopes separated by spaces. Each
                         scope is also a string.
         
                         For example, a single string with:
         
                         ```python
                         "items:read items:write users:read profile openid"
                         ````
         
                         would represent the scopes:
         
                         * `items:read`
                         * `items:write`
                         * `users:read`
                         * `profile`
                         * `openid`
                         """
                     ),
                 ] = "",
                 client_id: Annotated[
                     Union[str, None],
                     Form(),
                     Doc(
                         """
                         If there's a `client_id`, it can be sent as part of the form fields.
                         But the OAuth2 specification recommends sending the `client_id` and
                         `client_secret` (if any) using HTTP Basic auth.
                         """
                     ),
                 ] = None,
                 client_secret: Annotated[
                     Union[str, None],
                     Form(),
                     Doc(
                         """
                         If there's a `client_password` (and a `client_id`), they can be sent
                         as part of the form fields. But the OAuth2 specification recommends
                         sending the `client_id` and `client_secret` (if any) using HTTP Basic
                         auth.
                         """
                     ),
                 ] = None,
                 grant_type: Annotated[
                     str,
                     Form(pattern="^password$"),
                     Doc(
                         """
                         The OAuth2 spec says it is required and MUST be the fixed string
                         "password". This dependency is strict about it. If you want to be
                         permissive, use instead the `OAuth2PasswordRequestForm` dependency
                         class.
                         """
                     ),
                 ] = "password",
                 first_name: Annotated[Union[str, None], Form()] = None,
                 last_name: Annotated[Union[str, None], Form()] = None):
        super().__init__(grant_type=grant_type,
                         username=username,
                         password=password,
                         scope=scope,
                         client_id=client_id,
                         client_secret=client_secret)
        self.email = email
        self.first_name = first_name
        self.last_name = last_name


class Token(BaseModel):
    username: str
    email: str
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
    email: str | None = None


class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None
