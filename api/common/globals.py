# -*- coding:utf-8 -*-
from wrapper.postgres_wrapper import PostgresWrapper
from wrapper.redis_wrapper import RedisWrapper


class _Globals:
    def __init__(self):
        self.__redis_wrapper = None
        self.__postgres_wrapper = None

    def get_redis_wrapper(self) -> RedisWrapper:
        return self.__redis_wrapper

    def set_redis_wrapper(self, redis_wrapper):
        self.__redis_wrapper = redis_wrapper

    def get_postgres_wrapper(self) -> PostgresWrapper:
        return self.__postgres_wrapper

    def set_postgres_wrapper(self, postgres_wrapper):
        self.__postgres_wrapper = postgres_wrapper


GLOBALS = _Globals()
