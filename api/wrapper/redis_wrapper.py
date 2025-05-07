# -*-coding:utf-8-*-
import time

import redis
from redis import Redis

from common.const import CONST
from common.logger import log


class RedisWrapper(object):
    def __init__(self, host, port, password=None, db=0, max_connections=256, expire=300, error_wait_time=8):
        self.host = host
        self.port = port
        self.password = password
        self.redis_pool = None
        self.db = db
        self.max_connections = max_connections
        self.expire = expire
        self.error_wait_time = error_wait_time
        self.connect()
        log.info('init redis :{}'.format(host))

    def connect(self):
        if not self.password:
            self.redis_pool = redis.ConnectionPool(host=self.host, port=self.port, db=self.db,
                                                   max_connections=self.max_connections)
        else:
            self.redis_pool = redis.ConnectionPool(host=self.host, port=self.port, password=self.password,
                                                   db=self.db,
                                                   max_connections=self.max_connections)

    def get_redis_conn(self) -> Redis | None:
        try:
            redis_conn = redis.Redis(connection_pool=self.redis_pool)
            redis_conn.ping()
            return redis_conn
        except Exception as e:
            log.exception('redis connect error,error info: {}'.format(str(e)))
            time.sleep(self.error_wait_time)
            self.connect()

    def get(self, key):
        redis_conn = redis.Redis(connection_pool=self.redis_pool)
        value_byte: bytes = redis_conn.get(key)
        if value_byte:
            value = value_byte.decode(CONST.CODE_UTF8)
        else:
            value = None
        return value

    def set(self, key, value, expire_time=None):
        redis_conn = redis.Redis(connection_pool=self.redis_pool)
        if expire_time is None:
            expire_time = self.expire

        if expire_time > 0:
            return  redis_conn.set(key, value, ex=expire_time)

        return redis_conn.set(key, value)

    def delete(self, key):
        redis_conn = redis.Redis(connection_pool=self.redis_pool)
        redis_conn.delete(key)
