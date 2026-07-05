from fastapi import APIRouter
from typing import List

from backend.schemas.job_schema import JobResponse

from fastapi import HTTPException

from backend.services.job_query_service import remove_job

from backend.services.job_query_service import get_job_status
from backend.services.job_query_service import get_job_result
from fastapi import Depends

from backend.dependencies.auth_dependency import get_current_user

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