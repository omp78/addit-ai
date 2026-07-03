"""
Orchestrates the complete upload pipeline.
"""

from pathlib import Path

from fastapi import UploadFile

from backend.services.video_service import save_video
from backend.services.audio_service import extract_audio
from backend.services.transcription_service import transcribe_audio
from backend.services.content_service import generate_content
from uuid import uuid4

from backend.database.connection import SessionLocal
from backend.repositories.job_repository import (
    create_job,
    update_job,
)
from backend.models.enums import JobStatus



def process_upload(file: UploadFile) -> dict:
    """
    Process an uploaded video.
    """

    db = SessionLocal()
    try:
        job_id = str(uuid4())

        job = create_job(
            db,
            {
                "job_id": job_id,
                "status": JobStatus.UPLOADED.value,
                "original_filename": file.filename,
                "video_path": "",
                "audio_path": None,
                "transcript_path": None,
                "summary_path": None,
                "language": None,
            }
        )
        print("✅ Job created:", job.job_id)

        saved_video = save_video(
        file=file,
        job_id=job_id
        )

        print("✅ Video saved")

        update_job(
            db,
            job,
            video_path=saved_video["video_path"]
        )

        audio = extract_audio(
            saved_video["video_path"],
            saved_video["job_id"]
        )

        update_job(
            db,
            job,
            status=JobStatus.AUDIO_EXTRACTED.value,
            audio_path=audio["audio_path"],
        )

        transcript = transcribe_audio(
            Path(audio["audio_path"]),
            saved_video["job_id"]
        )
        update_job(
            db,
            job,
            status=JobStatus.TRANSCRIBED.value,
            transcript_path=transcript["transcript_path"],
            language=transcript["language"],
        )

        content = generate_content(
            Path(transcript["transcript_path"]),
            saved_video["job_id"]
        )

        update_job(
            db,
            job,
            status=JobStatus.CONTENT_GENERATED.value,
            summary_path=content["summary_path"],
        )

        return {
            **saved_video,
            **audio,
            **transcript,
            **content
        }
    finally:
        db.close()
        update_job(
        db,
        job,
        status=JobStatus.COMPLETED.value,
    )