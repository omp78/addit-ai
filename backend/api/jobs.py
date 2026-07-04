from fastapi import APIRouter
from typing import List

from backend.schemas.job_schema import JobResponse

from fastapi import HTTPException

from backend.services.job_query_service import remove_job

from backend.services.job_query_service import (
    list_jobs,
    get_job
)


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


@router.get(
    "",
    response_model=List[JobResponse]
)
def fetch_jobs():

    return list_jobs()



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