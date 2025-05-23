# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : main.py
@Author: White Gui
@Date  : 2025/4/7
@Desc :
"""
import asyncio

from common.logger import log
from initializer.initializer import de_init, init
from initializer.server import start_web_server


def start_all():
    init()
    asyncio.run(start_web_server())


def stop_all():
    de_init()


if __name__ == '__main__':
    try:
        start_all()
    except Exception as e:
        log.exception(f"ERROR to start websocket server, error info: {str(e)}")
    finally:
        stop_all()