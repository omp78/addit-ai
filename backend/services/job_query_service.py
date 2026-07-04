from backend.database.connection import SessionLocal

from backend.repositories.job_repository import delete_job
from pathlib import Path

from backend.repositories.job_repository import (
    get_all_jobs,
    get_job_by_job_id,
)


def list_jobs():

    db = SessionLocal()

    try:
        return get_all_jobs(db)

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