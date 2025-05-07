# -*-coding:utf-8-*-
import time

from common.const import CONST
from common.globals import GLOBALS
from loggers.logger import log


class RedisQueue(object):
    def __init__(self, name, redis_conn, namespace=CONST.PROJECT_NAME, ttl=-1, error_wait_time=8, key=None):
        self.redis_conn = redis_conn
        if not key:
            self.key = '{}:{}_queue'.format(namespace, name)
        else:
            self.key = key
        self.name = name
        self.error_wait_time = error_wait_time

        if ttl > 0:
            self._set_queue_expire(ttl)

    def _set_queue_expire(self, ttl: int):
        self.redis_conn.expire(self.key, ttl)

    def reset_conn(self):
        self.redis_conn = GLOBALS.get_redis_wrapper().get_redis_conn()

    def get_redis_conn(self):
        return self.redis_conn

    def queue_size(self):
        try:
            return self.redis_conn.llen(self.key)
        except Exception as e:
            log.exception(str(e))
            time.sleep(self.error_wait_time)
            self.reset_conn()
            return 0

    def is_empty(self):
        try:
            return self.queue_size() == 0
        except Exception as e:
            log.exception(str(e))
            time.sleep(self.error_wait_time)
            self.reset_conn()
            return True

    def put(self, item):
        try:
            self.redis_conn.rpush(self.key, item)
        except Exception as e:
            log.exception(str(e))
            time.sleep(self.error_wait_time)
            self.reset_conn()

    def jump(self, item):
        try:
            self.redis_conn.lpush(self.key, item)
        except Exception as e:
            log.exception(str(e))
            time.sleep(self.error_wait_time)
            self.reset_conn()
            return 0

    def delete(self):
        try:
            self.redis_conn.delete(self.key)
        except Exception as e:
            log.exception(str(e))
            time.sleep(self.error_wait_time)
            self.reset_conn()

    def get(self, block=False, timeout=None):
        item_result = None
        try:
            if block:
                item = self.redis_conn.blpop(self.key, timeout=timeout)
            else:
                item = self.redis_conn.lpop(self.key)

            if item:
                item_result = item.decode(CONST.UTF_8)
            else:
                item_result = None
        except Exception as error:
            log.exception(str(error))
            time.sleep(self.error_wait_time)
            self.reset_conn()

        return item_result

    def set_get(self):
        item_result = None
        try:
            item = self.redis_conn.spop(self.key)
            if item:
                item_result = item.decode(CONST.UTF_8)
            else:
                item_result = None
        except Exception as error:
            log.exception(str(error))
            time.sleep(self.error_wait_time)
            self.reset_conn()
        return item_result

    def set_put(self, item):
        try:
            self.redis_conn.sadd(self.key, item)
        except Exception as e:
            log.exception(str(e))
            time.sleep(self.error_wait_time)
            self.reset_conn()

    def set_queue_size(self):
        try:
            return self.redis_conn.scard(self.key)
        except Exception as e:
            log.exception(str(e))
            time.sleep(self.error_wait_time)
            self.reset_conn()
            return 0
