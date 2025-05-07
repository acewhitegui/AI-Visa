# -*- coding:utf-8 -*-

import logging
import os

from concurrent_log_handler import ConcurrentRotatingFileHandler

from common.const import CONST

LEVEL_MAP = {
    "critical": 50,
    "fatal": 50,
    "error": 40,
    "warning": 30,
    "warn": 30,
    "info": 20,
    "debug": 10,
    "notset": 0,
}


def get_logger_name():
    return CONST.SYSTEM_NAME + '_' + CONST.SUB_SYSTEM_NAME


def get_logger_file_name(logger_name):
    return logger_name + '.log'


def get_or_create_log_path():
    storage_path = '../data/log/'
    if not os.path.exists(storage_path):
        os.makedirs(storage_path, exist_ok=True)

    return storage_path


def get_logger_format():
    fmt = '[%(asctime)s]'
    fmt += '-[%(levelname)s]'
    fmt += '-[%(process)d]'
    fmt += '-[%(threadName)s]'
    fmt += '-[%(thread)d]'
    fmt += '-[%(filename)s:%(lineno)s]'
    fmt += ' # %(message)s'
    return fmt


def add_rotating_file_handler(logger, logger_name, formatter):
    file_name = get_or_create_log_path() + get_logger_file_name(logger_name)
    # handler = handlers.RotatingFileHandler(
    #     file_name, maxBytes=COMMON_CONST.MAX_BACK_FILE_SIZE, backupCount=COMMON_CONST.MAX_BACK_FILE_NUM,
    #     encoding=COMMON_CONST.UTF_8)
    #  解决多进程阻塞问题
    handler = ConcurrentRotatingFileHandler(
        file_name, maxBytes=CONST.MAX_BACK_FILE_SIZE, backupCount=CONST.MAX_BACK_FILE_NUM,
        encoding=CONST.UTF_8)
    handler.setFormatter(formatter)
    logger.addHandler(handler)


def add_stream_handler(logger, formatter):
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)


def init_logger(log_level):
    logger_name = get_logger_name()
    # 默认只用[logger_name]即可，sql模块加入日志系统增加sqlalchemy.engine
    logger_names = [logger_name]
    logger = None
    for log_model in logger_names:
        logger = logging.getLogger(log_model)
        formatter = logging.Formatter(get_logger_format())
        add_rotating_file_handler(logger, logger_name, formatter)
        add_stream_handler(logger, formatter)
        logger.setLevel(log_level)

    logger.propagate = False
    return logger

def refresh_level(level):
    log.setLevel(LEVEL_MAP.get(level.lower(), 30))

log = init_logger(logging.INFO)
refresh_level(CONST.LOG_LEVEL)
