# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : base.py
@Author: White Gui
@Date  : 2025/3/20
@Desc :
"""
from datetime import datetime

from sqlalchemy import DateTime
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped


class Base(DeclarativeBase):
    pass


class BaseModel(object):
    """
        这样create_date 和 modify_date属性就都添加了
    """
    created_at: Mapped[int] = mapped_column(DateTime(timezone=True), default=datetime.now)
    updated_at: Mapped[int] = mapped_column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)

    def to_dict(self):
        """Convert model instance to dictionary.

        Returns:
            dict: Dictionary representation of the model instance.
        """
        obj_dict = {}

        # Determine which fields to process
        if hasattr(self, '_fields'):
            fields = self._fields
        else:
            # Get all non-private, non-callable attributes
            fields = [field for field in dir(self)
                      if not field.startswith('_') and not callable(getattr(self, field))]

        # Process each field
        for field in fields:
            # Use getattr consistently instead of mixing with __getattribute__
            if field in ["registry"]:
                continue

            value = getattr(self, field)

            # Format value based on type
            if value is not None:
                if isinstance(value, datetime):
                    value = round(value.timestamp())
                elif not isinstance(value, bool) and not isinstance(value, (int, float)):
                    value = str(value)

            obj_dict[field] = value

        return obj_dict
