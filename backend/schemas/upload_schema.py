from pydantic import BaseModel
from typing import List


class UploadData(BaseModel):

    job_id: str

    video_path: str

    audio_path: str

    transcript_path: str

    summary_path: str

    language: str | None

    summary: str

    key_points: List[str]

    youtube_title: str

    youtube_description: str

    seo_keywords: List[str]



class UploadResponse(BaseModel):

    success: bool

    message: str

    data: UploadData