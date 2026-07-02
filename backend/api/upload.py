"""
Video upload API endpoints.
"""

from fastapi import APIRouter, File, UploadFile

from backend.services.video_service import save_video

router = APIRouter(tags=["Upload"])


@router.post("/upload")
def upload_video(file: UploadFile = File(...)):
    """
    Upload a video.
    """

    saved_video = save_video(file)

    return {
        "success": True,
        "message": "Video uploaded successfully.",
        "data": saved_video
    }