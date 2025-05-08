# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : file_service.py
@Author: White Gui
@Date  : 2025/5/8
@Desc :
"""
from datetime import datetime

from common.globals import GLOBALS
from common.logger import log
from models.db import UploadFile


async def get_uploaded_files(conversation_id):
    return None


async def store_file(conversation_id, file_name, file_type, file_path):
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        log.info(
            f"Try to store file: {file_name} with, conversation id: {conversation_id}, file type: {file_type}, file path: {file_path}")
        existed_file: UploadFile = session.query(UploadFile).filter(UploadFile.conversation_id == conversation_id,
                                                                    UploadFile.name == file_name,
                                                                    UploadFile.type == file_type).first()
        if not existed_file:
            upload_file = UploadFile()
            upload_file.conversation_id = conversation_id
            upload_file.name = file_name
            upload_file.file_path = file_path
            upload_file.type = file_type
            session.add(upload_file)
            session.commit()
            log.info(
                f"SUCCESS to store new file: {file_name} with, file type: {file_type}, file path: {file_path}")
        else:
            existed_file.file_path = file_path
            existed_file.updated_at = datetime.now()
            session.commit()
            log.info(
                f"SUCCESS to rewrite file: {file_name} with, file type: {file_type}, file path: {file_path}")
