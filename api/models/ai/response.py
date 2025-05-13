# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : response.py
@Author: White Gui
@Date  : 2025/4/15
@Desc :
"""
from typing import List

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


class MaterialCheckItem(BaseModel):
    requirement: str
    status: str
    note: str


class RiskEvaluationItem(BaseModel):
    project: str
    result: str
    note: str


class ReportDetails(BaseModel):
    passport_info: PassportDetails
    materials: List[MaterialCheckItem]
    evaluations: List[RiskEvaluationItem]
