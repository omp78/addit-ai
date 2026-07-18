from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pathlib import Path
from typing import List

from backend.schemas.job_schema import JobResponse
from backend.services.job_query_service import remove_job
from backend.services.job_query_service import get_job_status
from backend.services.job_query_service import get_job_result
from backend.dependencies.auth_dependency import get_current_user
from backend.services.job_query_service import (
    list_jobs,
    get_job
)
from backend.services.video_editor_service import trim_video_clip
from backend.utils.logger import logger


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


@router.get(
    "",
    response_model=List[JobResponse]
)
def fetch_jobs(
    user = Depends(get_current_user)
):

    return list_jobs(user)




@router.get("/{job_id}")
def fetch_job(job_id: str):

    return get_job(job_id)


@router.delete("/{job_id}")
def delete_existing_job(job_id: str):

    deleted = remove_job(job_id)


    if not deleted:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )


    return {
        "success": True,
        "message": "Job deleted successfully"
    }

@router.get("/{job_id}/status")
def fetch_job_status(job_id: str):

    status = get_job_status(job_id)


    if not status:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )


    return status

@router.get("/{job_id}/result")
def fetch_result(
    job_id: str
):

    result = get_job_result(
        job_id
    )


    if not result:

        raise HTTPException(
            status_code=404,
            detail="Result not found"
        )


    return result


class TrimRequest(BaseModel):
    start_time: str
    end_time: str
    aspect_ratio: str = "original"


@router.post("/{job_id}/trim")
def trim_clip(
    job_id: str,
    request: TrimRequest,
    background_tasks: BackgroundTasks
):
    job = get_job(job_id)
    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    video_path = Path(job.video_path)
    if not video_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Original video file not found on server."
        )

    try:
        clip_path = trim_video_clip(
            video_path=video_path,
            start_time=request.start_time,
            end_time=request.end_time,
            aspect_ratio=request.aspect_ratio,
            job_id=job_id
        )

        def remove_file(path: Path):
            try:
                if path.exists():
                    path.unlink()
                    logger.info(f"Successfully deleted temporary clip: {path.name}")
            except Exception as e:
                logger.error(f"Error deleting temp clip file {path.name}: {e}")

        background_tasks.add_task(remove_file, clip_path)

        return FileResponse(
            path=clip_path,
            media_type="video/mp4",
            filename=clip_path.name
        )

    except Exception as e:
        logger.error(f"Failed to trim clip: {e}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )