# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : order.py
@Author: White Gui
@Date  : 2025/5/14
@Desc :
"""
from sqlalchemy import Integer, ForeignKey, String, Enum, JSON, DateTime
from sqlalchemy.orm import mapped_column, relationship

from models.db.base import Base, BaseModel


class Order(Base, BaseModel):
    """
        根据stripe的event处理订单
    """
    __tablename__ = 'order'

    id = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id = mapped_column(Integer, ForeignKey('user.id'), nullable=False, index=True)
    order_number = mapped_column(String(64), unique=True, nullable=False, index=True)
    amount = mapped_column(Integer, nullable=False, comment='Order amount')
    currency = mapped_column(String(3), nullable=False, default='usd', comment='Currency type')
    status = mapped_column(Enum('pending', 'paid', 'failed', 'refunded', 'canceled', name="status"), default='pending',
                           nullable=False)

    # Stripe related fields
    payment_intent_id = mapped_column(String(255), unique=True, index=True, nullable=False,
                                      comment='Stripe payment intent ID')
    payment_method_id = mapped_column(String(255), index=True, comment='Stripe payment method ID')
    customer_id = mapped_column(String(255), index=True, comment='Stripe customer ID')
    charge_id = mapped_column(String(255), index=True, comment='Stripe charge ID')

    payment_method_details = mapped_column(JSON, comment='Payment method details')
    paid_at = mapped_column(DateTime(), comment='Payment time')
    # Relations
    user = relationship('User', back_populates='orders')
