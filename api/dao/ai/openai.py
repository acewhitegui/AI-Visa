# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : openai.py
@Author: White Gui
@Date  : 2025/4/7
@Desc :
"""
import base64
import json
import mimetypes

import openai

from common.const import CONST
from common.logger import log
from services import file_service


def function_call(tools: list, message_contents: list):
    """

        example:
        tools = [{
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get current temperature for a given location.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "City and country e.g. Bogotá, Colombia"
                        }
                    },
                    "required": [
                        "location"
                    ],
                    "additionalProperties": False
                },
                "strict": True
            }
        }]

        completion = client.chat.completions.create(
            model="gpt-4.1",
            messages=[{"role": "user", "content": "What is the weather like in Paris today?"}],
            tools=tools
        )

    :param tools:
    :param message_contents:
    :return:
    """
    client = __get_open_client()

    completion = client.chat.completions.create(
        model=CONST.OPENAI_MODEL_NAME,
        messages=message_contents,
        tools=tools
    )

    resp_json = completion.model_dump()
    log.info(f"SUCCESS to call tool function from server, resp data: {resp_json}")

    tool_result = []
    for tool_call in completion.choices[0].message.tool_calls:
        args = json.loads(tool_call.function.arguments)
        tool_result.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "args": args
        })
    return tool_result


def file_upload(file_path: str):
    client = __get_open_client()
    guess_type, _ = mimetypes.guess_type(file_path)
    if guess_type in CONST.ALLOW_MIMETYPES:
        # Image like
        return file_path

    if guess_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        file_path = file_service.convert_word_to_pdf(file_path)

    # PDF processing
    with open(file_path, "rb") as f:
        response = client.files.create(
            file=f,
            purpose="user_data",
        )

    if not hasattr(response, 'id'):
        log.error(f"ERROR to upload file to server, error info: {response}")
        return ""

    log.info(
        f"SUCCESS to get file upload result from server: {CONST.OPENAI_BASE_URL}/files/upload, resp data: {response}")
    file_id = response.id
    return file_id


def chat_messages_with_files(prompt: str, file_id_list: list):
    client = __get_open_client()

    log.debug(
        f"Try to ask file info from server: {CONST.OPENAI_BASE_URL}, prompt: {prompt}, file_ids: {file_id_list}")

    try:
        # Create message content with text and files
        message_content = [{"type": "text", "text": prompt}]

        # Add files to message content
        __prepare_file_message(file_id_list, message_content)

        response = client.chat.completions.create(
            model=CONST.OPENAI_MODEL_NAME,
            messages=[
                {
                    'role': "developer",
                    "content": [
                        {
                            "type": "text",
                            "text": DEVELOP_ROLE_CONFIG,
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": message_content
                }]
        )

        resp_json = response.model_dump()
        log.info(f"SUCCESS to ask file info from server, resp data: {resp_json}")
        return resp_json
    except Exception as e:
        log.error(f"ERROR to ask file info from server, error info: {str(e)}")
        return {}


def chat_messages_with_response_format(prompt: str, file_id_list: list, response_format):
    client = __get_open_client()

    log.debug(
        f"Try to ask file info from server: {CONST.OPENAI_BASE_URL}, prompt: {prompt}, file_ids: {file_id_list}")

    try:
        # Create message content with text and files
        message_content = [{"type": "text", "text": prompt}]

        # Add files to message content
        __prepare_file_message(file_id_list, message_content)

        options = {
            "model": CONST.OPENAI_MODEL_NAME,
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert in structured data extraction."
                               "You will be provided with unstructured text from a research paper and should transform it into the specified structure."
                },
                {
                    "role": "user",
                    "content": message_content
                }
            ],
            "response_format": response_format
        }

        completion = client.beta.chat.completions.parse(
            **options
        )
        resp_json = completion.model_dump()
        log.info(f"SUCCESS to ask file info from server, resp data: {resp_json}")
        return resp_json
    except Exception as e:
        log.error(f"ERROR to ask file info from server, error info: {str(e)}")
        return {}


def __prepare_file_message(file_id_list, message_content):
    for file_id in file_id_list:
        # For image files, use image_url instead of file
        if file_id.endswith(('.jpg', '.jpeg', '.png')):
            # For file_id approach with images
            message_content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{encode_image(file_id)
                    }",
                },
            })
        else:
            # For PDFs and other document types
            message_content.append({
                "type": "file",
                "file": {"file_id": file_id}
            })


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def __get_open_client():
    client = openai.OpenAI(api_key=CONST.OPENAI_API_KEY, base_url=CONST.OPENAI_BASE_URL)
    return client


DEVELOP_ROLE_CONFIG = """
                            As a professional visa audit assistant, your task is to analyze the various documents and queries provided by the user, determine whether the user meets the requirements required for the visa, and provide a comprehensive audit report.
    
                            Follow these steps:
                            1. Thoroughly review the documents provided and user queries
                            2. Identify key information relevant to your visa application
                            3. Check user information against visa requirements
                            4. Evaluate whether the user meets all the necessary conditions
                            5. Prepare detailed reports, including:
                            - Get user passport information includes Passport number and issue date
                            - Compare passport number and issue date from application form. In case of any inconsistency, 
                            the information in the passport shall prevail and the errors in the application form should be pointed out.
                            - Summary of user application and related documents
                            - How does the analysis user meet or not meet the visa requirements
                            - Provide recommendations to users based on evaluations
                            - Identify gaps in the materials and documents that need to be supplemented
                            
                            You need to provide a professional and detailed visa application review report based on the files uploaded by users. Make sure your answers are practical and targeted to help improve the success rate of your visa application.
                        """
