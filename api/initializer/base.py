# -*- coding:utf-8 -*-
import os

from common.const import CONST
from common.globals import GLOBALS
from common.logger import log
from wrapper.postgres_wrapper import PostgresWrapper
from wrapper.redis_wrapper import RedisWrapper


class _BaseInitializer:
    def __init__(self):
        self.has_been_initializer = False
        self.base_dir = '.'

    @classmethod
    def _init_redis(cls):
        redis_wrapper = RedisWrapper(host=CONST.REDIS_HOST, port=CONST.REDIS_PORT, password=CONST.REDIS_PASSWORD)
        GLOBALS.set_redis_wrapper(redis_wrapper)
        log.info('initialize redis successfully.')

    @classmethod
    def _init_postgres(cls):
        pg_wrapper = PostgresWrapper(url=CONST.POSTGRES_URL, echo=CONST.POSTGRES_ECHO)
        GLOBALS.set_postgres_wrapper(pg_wrapper)
        pg_wrapper.connect_pg()
        log.info('initialize pg successfully.')

    def initialize(self):
        log.info('try to initialize the base wrapper.')
        if self.has_been_initializer:
            log.info('system management has been initialized yet.')
            return

        # Attention: Don't change the order for initializing component.
        self._init_redis()
        self._init_postgres()

        log.info('base initialize successfully.')
        self.has_been_initializer = True

    def de_initialize(self):
        try:
            log.info('try to de-initialize the system management.')
            if not self.has_been_initializer:
                log.info('base has not been initialized.')
                return
            self.has_been_initializer = False
            log.info('base de initialize successfully.')
        except Exception as err:
            log.info('stop base initializer error {}'.format(err))


BS_INITIALIZER = _BaseInitializer()
