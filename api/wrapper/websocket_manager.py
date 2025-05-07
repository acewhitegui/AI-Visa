# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : websocket_manager.py
@Author: White Gui
@Date  : 2025/3/19
@Desc :
"""
import asyncio
import json
from typing import Dict

from fastapi import (
    WebSocket
)
from starlette.websockets import WebSocketState

from common.const import CONST
from common.globals import GLOBALS
from common.logger import log


class WebsocketManager(object):
    def __init__(self):
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}
        self.key_prefix = CONST.PROJECT_NAME + ":websockets:{}"
        self.redis_expire = CONST.SOCKET_KEY_EXPIRE

    async def register(self, client_key: str, websocket: WebSocket):
        try:
            await websocket.accept()
            redis_wrapper = GLOBALS.get_redis_wrapper()
            redis_key = self.key_prefix.format(client_key)

            redis_wrapper.set(redis_key, 1, self.redis_expire)

            user_id = self.__get_user_id(client_key)
            if user_id not in self.active_connections:
                self.active_connections[user_id] = {}

            connection_dict = self.active_connections.get(user_id, {})
            if connection_dict.get(client_key):
                log.warn(f"WARNING to get exists alive websocket with client key: {client_key}")
                return False, f"exists alive websocket"

            # 还需要考虑复用问题
            self.active_connections[user_id][client_key] = websocket
            return True, ""
        except Exception as e:
            error_reason = str(e)
            log.exception(f"ERROR to register websocket: {client_key},error info: {error_reason}")
            # 防止错误栈过大
            return False, error_reason[:100]

    async def send(self, client_key: str, websocket: WebSocket, text: str):
        try:
            await websocket.send_text(text)
            await self.ttl(client_key)
            log.debug(f"SUCCESS to send text, client key: {client_key}, msg length: {len(text)}")
        except Exception as e:
            log.exception(f"ERROR to send text, client key: {client_key},error info: {str(e)}")

    async def ttl(self, client_key):
        redis_wrapper = GLOBALS.get_redis_wrapper()
        redis_key = self.key_prefix.format(client_key)
        redis_wrapper.set(redis_key, 1, self.redis_expire)
        log.debug(f"SUCCESS to reset ttl of websocket: {client_key}")

    async def broadcast(self, client_key: str, message: str | dict):
        if isinstance(message, dict):
            message = json.dumps(message)

        user_id = self.__get_user_id(client_key)
        if user_id in self.active_connections:
            for key, websocket in list(self.active_connections[user_id].items()):
                if key == client_key:
                    log.debug(f"Try to skip exclude key: {client_key}")
                    continue

                try:
                    await GlobalWebsocketManager.send(client_key, websocket, message)
                except Exception as e:
                    log.error(f"Failed to send message to {key}: {str(e)}")
                    await self.remove(key, websocket)

    async def remove(self, key: str, websocket: WebSocket):
        try:
            redis_wrapper = GLOBALS.get_redis_wrapper()
            redis_key = self.key_prefix.format(key)
            redis_wrapper.delete(redis_key)

            log.debug(f"Try to remove websocket: {key}, current state: {websocket.client_state}")
            # Check if the websocket is still connected before closing
            if websocket.client_state == WebSocketState.CONNECTED:
                try:
                    await websocket.close(reason="closed from server")
                    log.info(f"SUCCESS to close websocket: {key}")
                except RuntimeError as e:
                    log.warning(f"Error closing websocket {key}: {str(e)}")

            # Clean up the connection objects
            user_id = self.__get_user_id(key)
            if user_id in self.active_connections:
                if key in self.active_connections[user_id]:
                    del self.active_connections[user_id][key]
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]

            log.debug(f"WebSocket: {key} removed from user id: {user_id}")
            return True
        except Exception as e:
            log.exception(f"ERROR to remove websocket: {key}, error info: {str(e)}")
            return False

    def __get_user_id(self, client_key: str):
        return client_key.split("_")[0]

    def check_connections_limited(self, user_id: str):
        connections_dict = self.active_connections.get(user_id, {})
        alive = len(connections_dict)

        max_connections = CONST.USER_MAX_CONNECTIONS
        log.debug(f"Trigger connections limit checking, alive: {alive},limit: {max_connections}, user id: {user_id}")
        return alive >= max_connections

    async def recycle_task(self):
        """Async task for recycling websockets - to be run in the main event loop"""
        log.info("Websocket manager recycle task starting")
        try:
            while True:
                alive, dead = 0, 0
                try:
                    log.debug(f"Recycle task starting")
                    redis_wrapper = GLOBALS.get_redis_wrapper()
                    for user_id, connections in list(self.active_connections.items()):
                        alive += len(connections)
                        for connector_key in list(connections.keys()):
                            redis_key = self.key_prefix.format(connector_key)
                            connections_dict = self.active_connections.get(user_id, {})
                            websocket = connections_dict.get(connector_key)
                            if not websocket:
                                connections_dict.pop(connector_key, "")
                                log.warn(f"WARNING to get empty websocket by key: {connector_key}")
                                continue

                            if not redis_wrapper.get(redis_key):
                                # 到期的要直接移除
                                await self.remove(connector_key, websocket)
                                alive -= 1
                                dead += 1
                                continue

                            # 没到期的要检查状态
                            if WebSocketState.DISCONNECTED == websocket.client_state:
                                await self.remove(connector_key, websocket)
                                alive -= 1
                                dead += 1

                    log.info(f"Recycle task finished - Alive: {alive}, Dead: {dead}")
                except Exception as e:
                    log.exception(f"Recycle error: {str(e)}")
                await asyncio.sleep(CONST.RECYCLE_INTERVAL)
        except asyncio.CancelledError:
            log.info("Websocket recycle task cancelled")
            raise


GlobalWebsocketManager = WebsocketManager()
