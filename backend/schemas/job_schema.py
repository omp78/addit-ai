from pydantic import BaseModel
from datetime import datetime


class JobResponse(BaseModel):

    job_id: str

    status: str

    original_filename: str

    language: str | None

    created_at: datetime

    updated_at: datetime


    class Config:
        from_attributes = True