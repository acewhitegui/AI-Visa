# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : openai.py
@Author: White Gui
@Date  : 2025/4/7
@Desc :
"""

from openai import OpenAI

from common.const import CONST


def transcribe(audio_path: str):
    client = get_open_ai_client()
    audio_file = open(audio_path, "rb")
    transcription = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file
    )
    print(transcription.text)


def text_to_speech(user_input: str, output_file_path: str):
    client = get_open_ai_client()
    with client.audio.speech.with_streaming_response.create(
            model="tts-1",
            voice="coral",
            input=user_input,
            instructions="Speak in a cheerful and positive tone.",
    ) as response:
        response.stream_to_file(output_file_path)

    print(output_file_path)


def get_open_ai_client():
    client = OpenAI(
        base_url=CONST.OPENAI_BASE_URL,
        api_key=CONST.OPENAI_API_KEY
    )
    return client
