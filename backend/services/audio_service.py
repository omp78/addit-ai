"""
Business logic for audio extraction.
"""

import subprocess
from pathlib import Path

from backend.config.settings import AUDIO_DIR

def extract_audio(video_path: Path, job_id: str) -> dict:
    """
    Extract audio from a video using FFmpeg.
    """
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    audio_path = AUDIO_DIR / f"{job_id}.wav"
    command = [
    "ffmpeg",
    "-i",
    str(video_path),
    "-vn",
    "-acodec",
    "pcm_s16le",
    "-ar",
    "16000",
    "-ac",
    "1",
    str(audio_path),
    "-y"
    ]
    subprocess.run(
    command,
    check=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
    )
    return {
    "audio_path": str(audio_path)
    }