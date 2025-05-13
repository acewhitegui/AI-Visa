# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : file_service.py
@Author: White Gui
@Date  : 2025/5/8
@Desc :
"""
import os
from datetime import datetime

from spire.doc import Document, FileFormat

from common.const import CONST
from common.globals import GLOBALS
from common.logger import log
from dao.aliyun import oss_service
from models.db import UploadFile


async def get_uploaded_files(conversation_id):
    file_dict = {}
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        obj_list: list[UploadFile] = session.query(UploadFile).filter(
            UploadFile.conversation_id == conversation_id).all()
        for obj in obj_list:
            item = obj.to_dict()
            file_type = obj.type
            file_path = obj.file_path
            file_url = oss_service.generate_file_url(file_path)
            item[CONST.URL] = file_url
            file_dict[file_type] = item

    return file_dict


async def store_file(conversation_id, material_id, file_name, file_type, file_path):
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        log.info(
            f"Try to store file: {file_name} with, conversation id: {conversation_id}, file type: {file_type}, file path: {file_path}")
        existed_file: UploadFile = session.query(UploadFile).filter(UploadFile.conversation_id == conversation_id,
                                                                    UploadFile.name == file_name,
                                                                    UploadFile.type == file_type).first()
        if not existed_file:
            upload_file = UploadFile()
            upload_file.conversation_id = conversation_id
            upload_file.material_id = material_id
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


def convert_word_to_pdf(word_path: str):
    # Get the PDF file path by replacing the extension
    pdf_path = os.path.splitext(word_path)[0] + '.pdf'
    doc = None
    try:
        # Create a Spire.Doc document
        doc = Document()

        # Load the Word document
        doc.LoadFromFile(word_path)

        # Save as PDF
        doc.SaveToFile(pdf_path, FileFormat.PDF)

        # Close the document
        log.info(f"SUCCESS to convert doc to pdf, word path: {word_path}")
        return pdf_path
    except Exception as e:
        log.exception(f"ERROR to convert word to pdf, file path: {word_path}, error info: {str(e)}")
        raise e
    finally:
        # Quit Word application
        if doc:
            doc.Close()
