# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : upload_file.py
@Author: White Gui
@Date  : 2025/5/7
@Desc :
"""
from sqlalchemy import String
from sqlalchemy.orm import mapped_column

from models.db.base import Base, BaseModel


class UploadFile(Base, BaseModel):
    """
        上传的文件记录
    """
    __tablename__ = 'upload_file'
    sha256 = mapped_column(String(36), primary_key=True)
    name = mapped_column(String(120), nullable=False)  # 文件名
    type = mapped_column(String(32), nullable=False, default="other")  # 文件类型
    file_path = mapped_column(String(1024), nullable=False)
