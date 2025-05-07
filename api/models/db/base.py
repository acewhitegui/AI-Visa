# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : base.py
@Author: White Gui
@Date  : 2025/3/20
@Desc :
"""
from datetime import datetime

from sqlalchemy import Column, DateTime
from sqlalchemy.orm import DeclarativeBase, mapped_column


class Base(DeclarativeBase):
    pass


class BaseModel(object):
    """
        这样create_date 和 modify_date属性就都添加了
    """
    created_at = mapped_column(DateTime(), default=datetime.now)
    updated_at = mapped_column(DateTime(), onupdate=datetime.now)

    def to_dict(self):
        obj_dict = {}
        if hasattr(self, '_fields'):
            for field in self._fields:
                value = self.__getattribute__(field)
                if value and not isinstance(value, bool):
                    value = str(value)
                obj_dict[field] = value
        else:
            # Get all attributes that are not methods or private
            for field in dir(self):
                if not field.startswith('_') and not callable(getattr(self, field)):
                    value = getattr(self, field)
                    if value and not isinstance(value, bool):
                        value = str(value)
                    obj_dict[field] = value
        return obj_dict
