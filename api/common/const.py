# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : const.py
@Author: White Gui
@Date  : 2025/4/3
@Desc :
"""
import os
from typing import Dict, Optional

from dotenv import load_dotenv

load_dotenv()


class _Const(object):
    def __setattr__(self, name, value):
        raise ValueError("can't set attribute")

    SYSTEM_NAME = 'ai-visa'
    SUB_SYSTEM_NAME = 'api'

    MAX_BACK_FILE_NUM = 10
    MAX_BACK_FILE_SIZE = 32 * 1024 * 1024
    RS256 = "RS256"

    PROJECT_NAME = '{}_{}'.format(SYSTEM_NAME, SUB_SYSTEM_NAME)
    URL_PREFIX = '/' + SYSTEM_NAME + '/' + SUB_SYSTEM_NAME + '/v1'

    CODE_UTF8 = 'utf-8'
    UTF_8 = 'utf8'
    PARSER_LXML = 'lxml'
    FILE_HTML = 'html'

    DATA = "data"
    RESULT = "result"
    MESSAGE = "message"
    REASON = "reason"
    SUCCESS = "success"
    FAILURE = "failure"
    TYPE = "type"

    HOST = os.getenv("HOST", "localhost")
    PORT = int(os.getenv("PORT", 8000))
    ANY_CONVERTERS_WEB_URL = os.getenv("ANY_CONVERTERS_WEB_URL", "https://anyconverters.com")

    POSTGRES_URL = os.getenv("POSTGRES_URL")
    POSTGRES_ECHO = bool(int(os.getenv("POSTGRES_ECHO", 0)))

    REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
    REDIS_PORT = os.getenv('REDIS_PORT', 6379)
    REDIS_PASSWORD = os.getenv('REDIS_PASSWORD', '')

    DEBUG = bool(int(os.getenv("DEBUG", 0)))

    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

    TEMP_FILE_PATH = os.getenv("TEMP_FILE_PATH", "./data/tmp")

    OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.org")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL_NAME = os.getenv("OPENAI_MODEL_NAME", "gpt-4o")
    ASSEMBLY_API_KEY = os.getenv("ASSEMBLY_API_KEY", "")

    ALIYUN_ACCESS_KEY_ID = os.getenv("ALIYUN_ACCESS_KEY_ID", "")
    ALIYUN_ACCESS_KEY_SECRET = os.getenv("ALIYUN_ACCESS_KEY_SECRET", "")
    ALIYUN_BUCKET_ENDPOINT = os.getenv("ALIYUN_BUCKET_ENDPOINT", "https://oss-cn-hangzhou.aliyuncs.com")
    ALIYUN_BUCKET_NAME = os.getenv("ALIYUN_BUCKET_NAME", "")
    ALIYUN_BUCKET_REGION = os.getenv("ALIYUN_BUCKET_REGION", "cn-hangzhou")
    OSS_DEFAULT_EXPIRES = int(os.getenv("OSS_DEFAULT_EXPIRES", 5 * 60))

    PROXY_URL = os.getenv("PROXY_URL", "")

    JWT_PRIVATE_KEY = os.getenv("JWT_PRIVATE_KEY", "")
    JWT_PUBLIC_KEY = os.getenv("JWT_PUBLIC_KEY", "")

    ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60)

    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = os.getenv("SMTP_PORT", 587)
    SMTP_USER = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

    TITLE = "title"

    # assembly ai
    LANGUAGE_CODE = "language_code"
    LANGUAGE_DETECTION = "language_detection"

    # aliyun
    URL = "url"
    EXPIRES = "expires"

    # proxy
    PROXIES = "proxies"
    HTTP = "http"
    HTTPS = "https"

    # auth
    UNKNOWN = "unknown"
    PENDING = "pending"
    ACTIVATED = "activated"
    DISABLED = "disabled"
    EMAIL = "email"
    USERNAME = "username"
    FIRST_NAME = "first_name"
    LAST_NAME = "last_name"
    PASSWORD = "password"
    PASSWORD_HASH = "password_hash"
    EXPIRE = "exp"

    # Define font styles mapping once at module level

    UNICODE_FONT_STYLES: Dict[str, Dict[str, Optional[int]]] = {
        'bold': {
            'upper_start': 0x1D400,
            'lower_start': 0x1D41A,
            'number_start': 0x1D7CE
        },
        'italic': {
            'upper_start': 0x1D434,
            'lower_start': 0x1D44E,
            'number_start': None  # No italic numbers in Unicode
        },
        'bold_italic': {
            'upper_start': 0x1D468,
            'lower_start': 0x1D482,
            'number_start': None
        },
        'monospace': {
            'upper_start': 0x1D670,
            'lower_start': 0x1D68A,
            'number_start': 0x1D7F6
        },
        'script': {
            'upper_start': 0x1D49C,
            'lower_start': None,  # Script typically only has uppercase
            'number_start': None
        },
        'sans_serif': {
            'upper_start': 0x1D5A0,
            'lower_start': 0x1D5BA,
            'number_start': 0x1D7E2
        }
    }


CONST = _Const()
