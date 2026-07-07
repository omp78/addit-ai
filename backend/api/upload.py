"""
Video upload API endpoints.
"""

from fastapi import APIRouter, File, UploadFile
from fastapi import BackgroundTasks
from fastapi import Depends

from backend.utils.exceptions import AdditException

from backend.dependencies.auth_dependency import get_current_user

from backend.services.job_service import (
    create_upload_job,
    process_job
)


router = APIRouter(
    tags=["Upload"]
)


@router.post("/upload")
def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):


    if not file.content_type.startswith("video/"):

        raise AdditException(
            "Only video files are allowed",
            400
        )


    job = create_upload_job(
        file,
        user
    )


    background_tasks.add_task(
        process_job,
        job["job_id"]
    )


    return {

        "success": True,

        "message": "Video queued successfully",

        "data": job

    }