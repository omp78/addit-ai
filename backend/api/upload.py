"""
Video upload API endpoints.
"""

from fastapi import APIRouter, File, UploadFile

from fastapi import BackgroundTasks

from backend.services.job_service import (
    create_upload_job,
    process_job
)

router = APIRouter(tags=["Upload"])

@router.post("/upload")
def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):

    job = create_upload_job(file)


    background_tasks.add_task(
        process_job,
        job["job_id"]
    )


    return {
        "success": True,
        "message": "Video queued successfully",
        "data": job
    }