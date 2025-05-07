# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : utils.py
@Author: White Gui
@Date  : 2025/4/5
@Desc :
"""
import asyncio
import time
from functools import wraps

from starlette.responses import JSONResponse

from common.const import CONST
from common.logger import log


def get_timestamp(millisecond=False):
    if millisecond:
        timestamp = int(round(time.time() * 1000))
    else:
        timestamp = int(round(time.time()))
    return timestamp


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def format_segment_time(seg_time: int):
    return round(seg_time / 1000, 1)


def resp_success(data=None):
    if data is None:
        data = {}

    resp_data = {}
    if not isinstance(data, dict):
        resp_data[CONST.DATA] = data
    else:
        resp_data = data

    if CONST.RESULT not in resp_data:
        resp_data[CONST.RESULT] = CONST.SUCCESS

    return JSONResponse(resp_data, status_code=200)


def resp_failure(data=None, reason: str = ""):
    if data is None:
        data = {}

    if CONST.RESULT not in data:
        data[CONST.RESULT] = CONST.FAILURE

    data[CONST.REASON] = reason
    return JSONResponse(data, status_code=400)


def timer(func):
    @wraps(func)
    async def async_function_timer(*args, **kwargs):
        t0 = time.time()
        result = await func(*args, **kwargs)
        t1 = time.time()
        log.debug("function: {},params:{} ,total time running cost {} seconds".format(func.__name__, (args, kwargs),
                                                                                      str(round(t1 - t0, 4))))
        return result

    @wraps(func)
    def sync_function_timer(*args, **kwargs):
        t0 = time.time()
        result = func(*args, **kwargs)
        t1 = time.time()
        log.debug("function: {},params:{} ,total time running cost {} seconds".format(func.__name__, (args, kwargs),
                                                                                      str(round(t1 - t0, 4))))
        return result

    if asyncio.iscoroutinefunction(func):
        return async_function_timer
    else:
        return sync_function_timer
