# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : ai_service.py
@Author: White Gui
@Date  : 2025/4/9
@Desc :
"""
import os.path
from tempfile import TemporaryDirectory

import markdown
from jinja2 import Template

from common.const import CONST
from common.globals import GLOBALS
from common.logger import log
from dao.ai import openai
from dao.ai.openai import chat_messages_with_response_format
from dao.aliyun import oss_service
from models.ai.response import PassportDetails, ReportDetails
from models.db import UploadFile
from services import product_service, material_service
from services.message_service import save_message


async def submit_ai_check(product_id: str, conversation_id: str, locale: str):
    """
        提交AI的检查结果
        1. 读取会话下所有提交的材料
        2. 通过材料查找类型的检查条件
        3. 上传AI文件
        4. 构造提示词进行对话
        5. 存储会话
    :param locale:
    :param product_id:
    :param conversation_id:
    :return:
    """
    passport_details = ""
    # 1. 读取材料
    with GLOBALS.get_postgres_wrapper().session_scope() as session:
        upload_obj_list: list[UploadFile] = session.query(UploadFile).filter(
            UploadFile.conversation_id == conversation_id).all()
        for upload_obj in upload_obj_list:
            session.expunge(upload_obj)
    # 2. 查找材料的检查条件
    file_id_list = []
    file_description_list = []
    bucket = oss_service.get_bucket()
    for upload_obj in upload_obj_list:
        material_id = upload_obj.material_id
        file_type = upload_obj.type
        material_obj: dict = await material_service.get_material(material_id, locale)
        if not material_obj:
            log.warning(f"WARNING to get not included file: {upload_obj.name}, file type: {file_type}")
            continue

        check_standard = material_obj.get(CONST.STANDARD)
        # 3. 上传ai文件
        oss_file_key = upload_obj.file_path
        filename = oss_file_key.split("/")[-1]
        with TemporaryDirectory() as tmp_dir:
            full_path = os.path.join(tmp_dir, filename)
            with open(full_path, "wb") as file:
                content = oss_service.download_file(bucket, oss_file_key)
                file.write(content)

            file_id = openai.file_upload(full_path)

        if CONST.PASSPORT == file_type:
            # 3.1 用function call 提取ai参数
            passport_details = extract_passport_info(file_id)
            # 护照信息只用解析，不用提交给AI
            continue

        file_id_list.append(file_id)
        file_description_list.append(
            f"file name: {upload_obj.name}, file type: {file_type}, check tips: ```{check_standard}```\n")

    # 4. 构造prompt
    product_dict = await product_service.get_product_details(product_id, locale)
    extra_check_tips = product_dict.get(CONST.EXTRA_CHECK_TIPS)

    prompt = f"""
        I will give you {len(file_description_list)} files, 
        
        The files descriptions are: 
        ```
        {"================\n".join(file_description_list)}
        ```
        
        All files need: ```{extra_check_tips}```.
    """
    if passport_details:
        prefix_prompt = f"""
        The passport info are: 
            {passport_details}\n,
        The contents of the documents uploaded from then on must be proofread with reference to the passport information.
        \n
        """
        prompt = prefix_prompt + prompt

    ai_message = extract_report_info(prompt, file_id_list)
    if not ai_message:
        raise ValueError("ERROR to get ai message")

    # 5. 存储会话
    message_dict = save_message(product_id, conversation_id, ai_message)
    # 6. 标准化返回
    answer = message_dict.get(CONST.ANSWER)
    message_dict[CONST.ANSWER] = markdown.markdown(answer)
    return message_dict


def extract_passport_info(file_id) -> dict:
    file_id_list = [file_id]
    log.info(f"Try to extract passport info by openai file id: {file_id}")
    prompt = (
        "You are now an expert in recognizing the content of passport documents. The bottom two lines of the passport are invalid information. Please extract the content of the passport document according to the requirements I give you:\n"
        "- When extracting passport dates from files, such as '04 8月/AUG 2022', this corresponds to the date '2022-08-04'.\n"
        "- Think and find the passport number rules and number length for that country.\n"
        "- The passport number is located at the top right. If it is not recognized or does not match the rules of the passport number you found for that country, must indicate the passport number as 'unrecognizable'.\n"
        "- The information in the bottom two lines of the passport must be disregarded.\n"
    )
    result = chat_messages_with_response_format(prompt, file_id_list, PassportDetails)
    passport_details = result.get(CONST.CHOICES, [])[0].get(CONST.MESSAGE, {}).get(CONST.PARSED, {})
    return passport_details


def extract_report_info(prompt: str, file_id_list: list) -> dict:
    """
        提取报告模板中的参数
    :param prompt:
    :param file_id_list:
    :return:
    """
    log.info(f"Try to extract passport info by openai file id list: {file_id_list}")
    result = chat_messages_with_response_format(prompt, file_id_list, ReportDetails)
    # transfer to markdown template
    message_dict = result.get(CONST.CHOICES, [])[0].get(CONST.MESSAGE, {})
    report_details = message_dict.get(CONST.PARSED, {})
    content = __get_rendered_md_content(report_details)
    message_dict[CONST.CONTENT] = content
    return message_dict


def __get_rendered_md_content(report_details):
    with open('./models/templates/report.md', 'r') as file:
        template = Template(file.read(), trim_blocks=True)
        rendered_text = template.render(**report_details)
        return rendered_text
