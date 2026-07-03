"""
Business logic for audio transcription using Groq Whisper.
"""

from pathlib import Path
from groq import Groq
from dotenv import load_dotenv
import os

from backend.config.settings import TRANSCRIPT_DIR

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY not found in environment variables.")

client = Groq(api_key=api_key)

def transcribe_audio(audio_path: Path, job_id: str) -> dict:
    """
    Transcribe an audio file using Groq Whisper.
    """
    TRANSCRIPT_DIR.mkdir(parents=True, exist_ok=True)
    transcript_path = TRANSCRIPT_DIR / f"{job_id}.txt"
    with open(audio_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-large-v3",
            response_format="verbose_json"
        )
    with open(transcript_path, "w", encoding="utf-8") as file:
        file.write(transcription.text)
    return {
    "transcript_path": str(transcript_path),
    "language": transcription.language
    }