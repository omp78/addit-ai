from backend.database.connection import SessionLocal

from backend.repositories.job_repository import delete_job
from pathlib import Path

import json

from backend.repositories.job_repository import (
    get_all_jobs,
    get_job_by_job_id,
)


def list_jobs(user):

    db = SessionLocal()

    try:
        return get_all_jobs(db,user.id)

    finally:
        db.close()
    



def get_job(job_id: str):

    db = SessionLocal()

    try:
        return get_job_by_job_id(
            db,
            job_id
        )

    finally:
        db.close()

def remove_job(job_id: str):

    db = SessionLocal()

    try:
        job = get_job_by_job_id(
            db,
            job_id
        )

        if not job:
            return None


        files = [
            job.video_path,
            job.audio_path,
            job.transcript_path,
            job.summary_path
        ]


        for file in files:

            if file:

                path = Path(file)

                if path.exists():
                    path.unlink()


        delete_job(
            db,
            job
        )


        return True


    finally:
        db.close()

def get_job_status(job_id: str):

    db = SessionLocal()

    try:

        job = get_job_by_job_id(
            db,
            job_id
        )

        if not job:
            return None


        return {
            "job_id": job.job_id,
            "status": job.status,
            "error_message": job.error_message
        }


    finally:
        db.close()

def get_job_result(
    job_id: str
):

    db = SessionLocal()

    try:

        job = get_job_by_job_id(
            db,
            job_id
        )


        if not job:

            return None


        return {

            "summary": job.summary,

            "key_points": job.key_points,

            "chapters": job.chapters,

            "youtube_title": job.youtube_title,

            "youtube_description": job.youtube_description,

            "seo_keywords": job.seo_keywords,

            "creator_intelligence": job.creator_intelligence,

            "social_package": job.social_package,

            "shorts_package": job.shorts_package,

            "job_id": job.job_id

        }


    finally:

        db.close()