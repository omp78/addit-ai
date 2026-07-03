"""
Orchestrates the complete upload pipeline.
"""

from pathlib import Path

from fastapi import UploadFile

from backend.services.video_service import save_video
from backend.services.audio_service import extract_audio
from backend.services.transcription_service import transcribe_audio
from backend.services.content_service import generate_content

def process_upload(file: UploadFile) -> dict:
    """
    Process an uploaded video.
    """
    saved_video = save_video(file)

    audio = extract_audio(
        saved_video["video_path"],
        saved_video["job_id"]
    )

    transcript = transcribe_audio(
        Path(audio["audio_path"]),
        saved_video["job_id"]
    )

    content = generate_content(
        Path(transcript["transcript_path"]),
        saved_video["job_id"]
    )

    return {
        **saved_video,
        **audio,
        **transcript,
        **content
    }