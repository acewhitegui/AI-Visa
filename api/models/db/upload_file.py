# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : upload_file.py
@Author: White Gui
@Date  : 2025/5/7
@Desc :
"""
from sqlalchemy import String, UniqueConstraint
from sqlalchemy.orm import mapped_column

from common import utils
from models.db.base import Base, BaseModel


class UploadFile(Base, BaseModel):
    """
        上传的文件记录
    """
    __tablename__ = 'upload_file'
    file_id = mapped_column(String(36), primary_key=True, default=utils.generate_uuid)
    conversation_id = mapped_column(String(36), nullable=False)
    name = mapped_column(String(120), nullable=False)  # 文件名
    type = mapped_column(String(32), nullable=False, default="other")  # 文件类型
    file_path = mapped_column(String(1024), nullable=False)

    __table_args__ = (
        UniqueConstraint('name', 'type', 'conversation_id', name='uix_name_type_conversation_id'),
    )
