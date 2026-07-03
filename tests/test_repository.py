from backend.database.connection import SessionLocal
from backend.repositories.job_repository import create_job, get_job_by_job_id, update_job

db = SessionLocal()

job_data = {
    "job_id": "test-job-001",
    "status": "UPLOADED",
    "original_filename": "demo.mp4",
    "video_path": "storage/uploads/demo.mp4",
    "audio_path": None,
    "transcript_path": None,
    "summary_path": None,
    "language": None,
}

#job = create_job(db, job_data)

#print("Database ID:", job.id)
#print("Job ID:", job.job_id)
#print("Status:", job.status)
job = get_job_by_job_id(db, "test-job-001")
job2 = update_job(
    db,
    job,
    status="PROCESSING",
    audio_path="storage/audio/demo.mp3",
)
print("Status:", job.status)

db.close()

