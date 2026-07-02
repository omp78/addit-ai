"""
Business logic for handling video files.
"""

from pathlib import Path
from uuid import uuid4
import shutil

from fastapi import HTTPException, UploadFile

from backend.utils.file_validator import is_allowed_file

UPLOAD_DIR = Path("uploads")


def save_video(file: UploadFile) -> dict:
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
    unique_filename = f"{uuid4()}{Path(file.filename).suffix.lower()}"

    file_path = UPLOAD_DIR / unique_filename

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "filename": unique_filename,
        "original_filename": file.filename,
        "path": str(file_path)
    }