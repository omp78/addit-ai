"""
Business logic for handling video files.
"""

from pathlib import Path
import shutil

from fastapi import HTTPException, UploadFile

from backend.utils.file_validator import is_allowed_file

from backend.config.settings import UPLOAD_DIR

def save_video(
    file: UploadFile,
    job_id: str
):
    """
    Validate and save an uploaded video.
    """

    # Validate file type
    if not file.filename or not is_allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Unsupported video format."
        )

    # Create upload directory
    UPLOAD_DIR.mkdir(exist_ok=True)

    # Generate unique filename

    video_filename = f"{job_id}{Path(file.filename).suffix.lower()}"

    file_path = UPLOAD_DIR / video_filename

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
    "job_id": job_id,
    "video_filename": video_filename,
    "original_filename": file.filename,
    "video_path": str(file_path)
    }