# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : response.py
@Author: White Gui
@Date  : 2025/4/15
@Desc :
"""
from pydantic import BaseModel


class PassportDetails(BaseModel):
    passport_number_length: int
    passport_number: str
    name: str
    sex: str
    nationality: str
    date_of_birth: str
    place_of_birth: str
    date_of_issue: str
    place_of_issue: str
    date_of_expiry: str
    authority: str
