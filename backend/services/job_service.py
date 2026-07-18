"""
Orchestrates the complete upload pipeline.
"""
from uuid import uuid4
from pathlib import Path

from backend.utils.logger import logger

from backend.services.video_service import save_video
from backend.services.audio_service import extract_audio
from backend.services.transcription_service import transcribe_audio
from backend.services.content_service import generate_content

from backend.database.connection import SessionLocal
from backend.repositories.job_repository import (
    create_job,
    get_job_by_job_id,
    update_job,
)
from backend.models.enums import JobStatus



def process_job(job_id: str):
    """
    Process an uploaded video.
    """

    db = SessionLocal()
    job = None

    try:
        # video
        job = get_job_by_job_id(
                db,
                job_id
        )
        logger.info(f"Processing started: {job_id}")

        update_job(
            db,
            job,
            video_path=job.video_path
        )


        # 1. Update status to AUDIO_EXTRACTED representing "Uploading video to Google..." (50% progress)
        update_job(
            db,
            job,
            status=JobStatus.AUDIO_EXTRACTED.value
        )
        logger.info(f"Video upload to Gemini started: {job_id}")

        # 2. Generate content (Uploads raw video to Gemini and waits for processing)
        content = generate_content(
            Path(job.video_path),
            job_id
        )

        # 3. Update status to TRANSCRIBED representing "Gemini analyzing video..." (75% progress)
        update_job(
            db,
            job,
            status=JobStatus.TRANSCRIBED.value
        )
        logger.info(f"Gemini video analysis completed: {job_id}")

        # 4. Save results on success
        update_job(
            db,
            job,
            status=JobStatus.COMPLETED.value,

            summary_path=content["summary_path"],

            summary=content.get("summary"),

            key_points=content.get("key_points"),

            chapters=content.get("chapters"),

            youtube_title=content.get("youtube_title"),

            youtube_description=content.get("youtube_description"),

            seo_keywords=content.get("seo_keywords"),

            creator_intelligence=content.get("creator_intelligence"),

            social_package=content.get("social_package"),

            shorts_package=content.get("shorts_package")
        )

        logger.info(
            f"Job completed successfully: {job_id}"
        )

        return {
            "video_path": job.video_path,
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

def create_upload_job(file, user):

    job_id = str(uuid4())


    saved_video = save_video(
        file=file,
        job_id=job_id
    )


    db = SessionLocal()


    try:

        job = create_job(
            db,
            {
                "user_id": user.id,
                "job_id": job_id,
                "status": JobStatus.QUEUED.value,
                "original_filename": file.filename,
                "video_path": saved_video["video_path"],
                "audio_path": None,
                "transcript_path": None,
                "summary_path": None,
                "language": None,
                "error_message": None
            }
        )


        return {
            "job_id": job.job_id,
            "status": job.status
        }


    finally:
        db.close()

