"""
Video upload API endpoints.
"""

from fastapi import APIRouter, File, UploadFile

from backend.services.video_service import save_video
from backend.services.audio_service import extract_audio

router = APIRouter(tags=["Upload"])


@router.post("/upload")
def upload_video(file: UploadFile = File(...)):
    """
    Upload a video and extract its audio.
    """

    saved_video = save_video(file)

    audio = extract_audio(
        saved_video["video_path"],
        saved_video["job_id"]
    )

    return {
        "success": True,
        "message": "Video uploaded and audio extracted successfully.",
        "data": {
            **saved_video,
            **audio
        }
    }