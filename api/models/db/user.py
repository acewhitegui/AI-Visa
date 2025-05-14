# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : user.py
@Author: White Gui
@Date  : 2025/4/12
@Desc :
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Table, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from common.const import CONST
from models.db.base import Base, BaseModel

# Define all association tables first
user_role = Table(
    'user_role',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('user.id'), primary_key=True),
    Column('role_id', Integer, ForeignKey('role.id'), primary_key=True)
)

role_permission = Table(
    'role_permission',
    Base.metadata,
    Column('role_id', Integer, ForeignKey('role.id'), primary_key=True),
    Column('permission_id', Integer, ForeignKey('permission.id'), primary_key=True)
)


class User(Base, BaseModel):
    """
        User table for authentication and authorization
    """
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(50))
    last_name = Column(String(50))
    status = Column(String(16), nullable=False, default=CONST.PENDING, index=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    last_login = Column(DateTime(timezone=True))

    # Relationships
    roles = relationship('Role', secondary=user_role, back_populates='users', lazy="joined")
    orders = relationship("Order", lazy="joined")

    # Use a join condition instead of direct secondary for permissions
    def get_permissions(self):
        """Get all permissions for this user through their roles"""
        permissions = set()
        for role in self.roles:
            for permission in role.permissions:
                permissions.add(permission)
        return permissions

    __table_args__ = (
        CheckConstraint(
            f"status IN {(CONST.PENDING, CONST.ACTIVATED, CONST.DISABLED)}",
            name='check_valid_status'
        ),
    )

    def to_dict(self):
        self.password_hash = ""
        return super().to_dict()


class Role(Base, BaseModel):
    """
        Role table for RBAC
    """
    __tablename__ = 'role'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255))

    # Relationships
    users = relationship('User', secondary=user_role, back_populates='roles')
    permissions = relationship('Permission', secondary=role_permission,
                               back_populates='roles')


class Permission(Base, BaseModel):
    """
        Permission table for RBAC
    """
    __tablename__ = 'permission'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    description = Column(String(255))

    # Relationships
    roles = relationship('Role', secondary=role_permission,
                         back_populates='permissions')


class UserSession(Base, BaseModel):
    """
        User session logging
    """
    __tablename__ = 'user_session'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    ip_address = Column(String(45))  # IPv6 can be up to 45 chars
    user_agent = Column(String(255))
    expires_at = Column(DateTime(timezone=True), nullable=False)

    # Relationships
    user = relationship('User')


class AuditLog(Base, BaseModel):
    """
        Audit logging for tracking user actions
    """
    __tablename__ = 'audit_log'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    action = Column(String(50), nullable=False)
    resource_type = Column(String(50))
    resource_id = Column(String(50))
    details = Column(String(1000))
    ip_address = Column(String(45))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship('User')
