# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : oss_service.py
@Author: White Gui
@Date  : 2025/4/10
@Desc :
"""
import oss2
from oss2 import Bucket
from oss2.credentials import StaticCredentialsProvider

from common.const import CONST
from common.logger import log
from common.utils import timer


@timer
def upload_file(bucket: Bucket, oss_path, data):
    try:
        log.debug(f"Try to upload file, oss path: {oss_path}")
        result = bucket.put_object(oss_path, data)
        log.info(f"File uploaded successfully, result: {result}")
        return result
    except oss2.exceptions.OssError as e:
        log.exception(f"Failed to upload file: {e}")
        raise e


def presign_file_url(bucket: Bucket, oss_path, expires=CONST.OSS_DEFAULT_EXPIRES):
    try:
        result = bucket.sign_url('GET', oss_path, expires)
        log.info(f"File presign successfully, result: {result}")
        return result
    except oss2.exceptions.OssError as e:
        log.exception(f"Failed to presign file: {e}")
        raise e


def download_file(bucket: Bucket, oss_path):
    try:
        file_obj = bucket.get_object(oss_path)
        content = file_obj.read().decode('utf-8')
        log.info(f"File content: {content}")
        return content
    except oss2.exceptions.OssError as e:
        log.exception(f"Failed to download file: {e}")
        raise e


def get_bucket():
    provider = StaticCredentialsProvider(access_key_id=CONST.ALIYUN_ACCESS_KEY_ID,
                                         access_key_secret=CONST.ALIYUN_ACCESS_KEY_SECRET)
    auth = oss2.ProviderAuthV4(provider)
    endpoint = CONST.ALIYUN_BUCKET_ENDPOINT
    region = CONST.ALIYUN_BUCKET_REGION
    bucket_name = CONST.ALIYUN_BUCKET_NAME
    bucket = oss2.Bucket(auth, endpoint, bucket_name, region=region)
    return bucket
