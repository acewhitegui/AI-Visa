# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : cas.py
@Author: White Gui
@Date  : 2025/5/23
@Desc :
"""

from pydantic import BaseModel


class CASDetails(BaseModel):
    annual_tuition_fee: str  # 1年学费
    remaining_unpaid_tuition_fees: str
    studying_address: str
    is_inside_london: bool
    start_date: str
    end_date: str


INSIDE_LONDON_MOUTHLY_LIVING_EXPENSES = 1483  # 英镑
OUTSIDE_LONDON_MOUTHLY_LIVING_EXPENSES = 1136  # 英镑
