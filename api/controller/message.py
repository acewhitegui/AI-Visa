# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : message.py
@Author: White Gui
@Date  : 2025/4/10
@Desc :
"""
import asyncio
from concurrent.futures.thread import ThreadPoolExecutor
from typing import Annotated

from fastapi import APIRouter
from fastapi import (
    Depends
)
from fastapi import WebSocket
from fastapi.exceptions import WebSocketException
from fastapi.websockets import WebSocketDisconnect
from starlette.status import WS_1007_INVALID_FRAME_PAYLOAD_DATA, WS_1006_ABNORMAL_CLOSURE

from common.const import CONST
from common.logger import log
from services import auth_service
from services.auth_service import get_query_params
from wrapper.websocket_manager import GlobalWebsocketManager

router = APIRouter()

executor = ThreadPoolExecutor(thread_name_prefix=CONST.WEBSOCKET_THREAD_NAME_PREFIX,
                              max_workers=CONST.WS_MAX_THREAD_NUMBERS)


@router.websocket("/message")
async def message(websocket: WebSocket, query_params: Annotated[str, Depends(get_query_params)]):
    # 规则： 来源 user_id
    token, client_id, source = query_params
    user_info = await auth_service.get_current_user(token)
    if not user_info:
        log.warn(
            f"WARNING to get auth client key from: {token}, client info: {websocket.client}, query params: {query_params}")
        raise WebSocketException(code=WS_1007_INVALID_FRAME_PAYLOAD_DATA, reason="empty user info from token")

    user_id = user_info.get(CONST.USER_ID)
    client_key = "{}_{}_{}".format(user_id, client_id, source)
    # 连接数校验
    from wrapper.websocket_manager import GlobalWebsocketManager
    connections_limited = GlobalWebsocketManager.check_connections_limited(user_id)
    if connections_limited:
        log.warn(
            f"WARNING to reach connections limit: {CONST.USER_MAX_CONNECTIONS}, user id: {user_id},client key: {client_key}")
        raise WebSocketException(code=WS_1006_ABNORMAL_CLOSURE,
                                 reason=f"max connections reached: {CONST.USER_MAX_CONNECTIONS}")

    # Accept the WebSocket connection
    registered, error_reason = await GlobalWebsocketManager.register(client_key, websocket)
    if not registered:
        log.warning(f"ERROR to register websocket with client key: {client_key}, reason: {error_reason}")
        raise WebSocketException(code=WS_1007_INVALID_FRAME_PAYLOAD_DATA,
                                 reason=f"abnormal to register client key: {client_key}, reason: {error_reason}")

    log.info(f"Web Socket Accepted: {client_key}, start to handle messages with loop")

    try:
        while True:
            # Wait for message from client
            user_input = await websocket.receive_text()
            log.debug(f"Message Received: {user_input}, from client: {client_key}")

            if CONST.PING == user_input:
                log.debug(f"Message received PING message: {user_input}")
                await GlobalWebsocketManager.send(client_key, websocket, CONST.PONG)
                log.debug(f"Message response PONG message: {CONST.PONG}")
                continue

            executor.submit(
                asyncio.run,
                process_data(websocket, client_key, user_info, user_input)
            )

    except WebSocketDisconnect as e:
        err_str = str(e)
        if '1000' in err_str:
            log.debug(f"Web Socket normally disconnected: {client_key}, disconnect reason: {err_str}")
        else:
            log.exception(f"ERROR in Web Socket abnormally disconnected: {client_key}, disconnect reason: {err_str}")
        await GlobalWebsocketManager.remove(client_key, websocket)  # Optional: remove from tracking

    except WebSocketException as e:
        log.exception(f"WebSocket error, client key: {client_key},error info: {str(e)}")
        await GlobalWebsocketManager.remove(client_key, websocket)


async def process_data(websocket, client_key, user_info, user_input):
    try:
        log.info(f"Try to process data in task, client key: {client_key}, user input: {user_input}")
        await GlobalWebsocketManager.broadcast(client_key, {})
    except Exception as e:
        log.exception(
            f"ERROR to process data in task,client key: {client_key}, user input: {user_input},error info: {str(e)}")
