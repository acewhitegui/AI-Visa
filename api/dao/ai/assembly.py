# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : assembly.py
@Author: White Gui
@Date  : 2025/4/7
@Desc :
"""
import pprint

import assemblyai as aai
from assemblyai import TranscriptionConfig

from common.const import CONST
from common.utils import format_segment_time


def transcribe(audio_path: str, language_code=""):
    result = []
    config = {
        "speaker_labels": True
    }

    # 音频语言
    if not language_code:
        config[CONST.LANGUAGE_DETECTION] = True
    else:
        config[CONST.LANGUAGE_CODE] = language_code

    aai.settings.api_key = CONST.ASSEMBLY_API_KEY
    transcriber = aai.Transcriber(config=TranscriptionConfig(**config))

    # loop utter
    transcript = transcriber.transcribe(audio_path)
    for utterance in transcript.utterances:
        speaker = utterance.speaker
        # Split text by pauses
        segments = []
        words = utterance.words
        current_segment = []
        last_end_time = None

        for word in words:
            if last_end_time is not None and (word.start - last_end_time) > 100:  # pause threshold
                if current_segment:
                    segment_text = " ".join([w.text for w in current_segment])
                    segment_start = current_segment[0].start
                    segment_end = current_segment[-1].end
                    segments.append((segment_start, segment_end, segment_text))
                current_segment = []

            current_segment.append(word)
            last_end_time = word.end

        # Add the last segment
        if current_segment:
            segment_text = " ".join([w.text for w in current_segment])
            segment_start = current_segment[0].start
            segment_end = current_segment[-1].end
            segments.append((segment_start, segment_end, segment_text))

        # Add segments to result
        for seg_start, seg_end, seg_text in segments:
            result.append(f"{speaker} {format_segment_time(seg_start)}s ~ {format_segment_time(seg_end)}s: {seg_text}")

    pprint.pprint(result)
