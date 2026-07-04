"""
Orchestrates the complete upload pipeline.
"""

from pathlib import Path

from backend.utils.logger import logger

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
    job = None
    job_id = None

    try:
        job_id = str(uuid4())


        # create database record
        job = create_job(
            db,
            {
                "job_id": job_id,
                "status": JobStatus.UPLOADED.value,
                "error_message": None,
                "original_filename": file.filename,
                "video_path": "",
                "audio_path": None,
                "transcript_path": None,
                "summary_path": None,
                "language": None,
                
            }
        )
        logger.info(f"Job created: {job.job_id}")

        # video
        saved_video = save_video(
            file=file,
            job_id=job_id
        )
        logger.info(f"Video saved for job: {job_id}")

        update_job(
            db,
            job,
            video_path=saved_video["video_path"]
        )


        # audio
        audio = extract_audio(
            saved_video["video_path"],
            job_id
        )
        logger.info(f"Audio extracted for job: {job_id}")


        update_job(
            db,
            job,
            status=JobStatus.AUDIO_EXTRACTED.value,
            audio_path=audio["audio_path"]
        )


        # transcription
        transcript = transcribe_audio(
            Path(audio["audio_path"]),
            job_id
        )
        logger.info(f"Transcription completed for job: {job_id}")


        update_job(
            db,
            job,
            status=JobStatus.TRANSCRIBED.value,
            transcript_path=transcript["transcript_path"],
            language=transcript["language"]
        )


        # content
        content = generate_content(
            Path(transcript["transcript_path"]),
            job_id
        )
        logger.info(f"Content generated for job: {job_id}")


        update_job(
            db,
            job,
            status=JobStatus.COMPLETED.value,
            summary_path=content["summary_path"]
        )
        logger.info(f"Job completed successfully: {job_id}")


        return {
            **saved_video,
            **audio,
            **transcript,
            **content
        }


    except Exception as e:

        logger.exception(
            f"Job failed: {job_id}"
        )

        if job:
            update_job(
                db,
                job,
                status=JobStatus.FAILED.value,
                error_message=str(e),
            )

        raise e


    finally:
        db.close()