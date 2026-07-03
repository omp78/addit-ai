from sqlalchemy.orm import Session

from backend.models.job import Job

def create_job(db: Session, job_data: dict) -> Job:

    job = Job(**job_data)

    db.add(job)

    db.commit()

    db.refresh(job)

    return job

def get_job_by_job_id(
    db: Session,
    job_id: str
):

    return (
        db.query(Job)
        .filter(Job.job_id == job_id)
        .first()
    )

def update_job(
    db: Session,
    job: Job,
    **kwargs
):

    for key, value in kwargs.items():
        setattr(job, key, value)

    db.commit()

    db.refresh(job)

    return job