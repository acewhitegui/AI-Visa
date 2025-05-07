# -*- coding:utf-8 -*-

from common.const import CONST
from common.logger import refresh_level, log
from initializer.base import BS_INITIALIZER


def init_executor():
    pass


def de_init_executor():
    try:
        pass
    except Exception as error:
        log.info('stop process monitor error: {}'.format(error))


def init():
    try:
        BS_INITIALIZER.initialize()
        init_executor()
        refresh_level(CONST.LOG_LEVEL)
    except Exception as e:
        log.error('{}'.format(str(e)))
        raise e


def de_init():
    BS_INITIALIZER.de_initialize()
    de_init_executor()
