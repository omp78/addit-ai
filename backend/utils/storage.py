"""
Storage initialization utilities.
"""

from backend.config.settings import (
    UPLOAD_DIR,
    AUDIO_DIR,
    TRANSCRIPT_DIR,
    SUMMARY_DIR,
    THUMBNAIL_DIR,
    CHAPTERS_DIR,
)


def initialize_storage():

    folders = [
        UPLOAD_DIR,
        AUDIO_DIR,
        TRANSCRIPT_DIR,
        SUMMARY_DIR,
        THUMBNAIL_DIR,
        CHAPTERS_DIR,
    ]


    for folder in folders:

        folder.mkdir(
            parents=True,
            exist_ok=True
        )