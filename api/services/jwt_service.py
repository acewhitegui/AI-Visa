# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : jwt_service.py
@Author: White Gui
@Date  : 2025/4/12
@Desc :
"""
import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend

from common.const import CONST


def encode_jwt(payload: dict) -> str:
    private_key = CONST.JWT_PRIVATE_KEY.replace("\\n","\n")
    encoded = jwt.encode(payload, private_key, algorithm=CONST.RS256)
    return encoded


def decode_jwt(encoded: str) -> dict:
    public_key = CONST.JWT_PUBLIC_KEY.replace("\\n","\n")
    decode = jwt.decode(encoded, public_key, algorithms=[CONST.RS256])
    return decode


def generate_key_pair() -> tuple:
    """
    Generate an RSA key pair for JWT signing and verification.

    Returns:
        tuple: (private_key_pem, public_key_pem) as strings
    """
    # Generate private key
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )

    # Get private key in PEM format
    private_key_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    ).decode('utf-8')

    # Get public key in PEM format
    public_key = private_key.public_key()
    public_key_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode('utf-8')

    return private_key_pem, public_key_pem
