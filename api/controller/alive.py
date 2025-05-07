# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : alive.py
@Author: White Gui
@Date  : 2025/3/19
@Desc :
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/alive")
async def alive():
    return {"message": "Hello World"}
