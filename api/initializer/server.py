# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : server.py
@Author: White Gui
@Date  : 2025/3/19
@Desc :
"""
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import Response

from common.const import CONST
from common.globals import GLOBALS
from common.logger import log
from controller import alive, auth, conversation, file, ai


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("Starting to create database tables...")
    GLOBALS.get_postgres_wrapper().create_tables()
    log.info("Database tables creation completed.")
    yield


app = FastAPI(root_path=CONST.URL_PREFIX, lifespan=lifespan)

path = [
    alive.router,
    auth.router,
    conversation.router,
    file.router,
    ai.router
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for route in path:
    app.include_router(route)


async def start_web_server():
    log.info(
        f"Try to start server: {CONST.HOST}, port: {CONST.PORT}")
    config = uvicorn.Config(app, host=CONST.HOST, port=CONST.PORT, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()


@app.exception_handler(Exception)
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        # you probably want some kind of logging here
        log.exception(f"Uncaught exception, error info: {str(e)}")
        return Response("Internal server error", status_code=400)
