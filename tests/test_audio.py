from pathlib import Path

from backend.services.audio_service import extract_audio

video_path = Path("storage/uploads/test2.mp4")

job_id = "test123"

result = extract_audio(video_path, job_id)

print(result)