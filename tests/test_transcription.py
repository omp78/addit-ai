from pathlib import Path

from backend.services.transcription_service import transcribe_audio

result = transcribe_audio(
    Path("storage/outputs/audio/test123.wav"),
    "test123"
)

print(result)