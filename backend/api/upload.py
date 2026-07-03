"""
Video upload API endpoints.
"""

from fastapi import APIRouter, File, UploadFile

from backend.services.job_service import process_upload
from backend.services.video_service import save_video
from backend.services.audio_service import extract_audio

router = APIRouter(tags=["Upload"])


@router.post("/upload")
def upload_video(file: UploadFile = File(...)):
    """
    Upload a video and extract its audio.
    """

    processed_job = process_upload(file)

    return {
    "success": True,
    "message": "Video uploaded and processed successfully.",
    "data": processed_job
    }