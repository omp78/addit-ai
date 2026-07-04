from datetime import datetime

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.base import Base

from sqlalchemy import ForeignKey

class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    job_id: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String,
        default="PROCESSING"
    )
    error_message: Mapped[str] = mapped_column(
    String,
    nullable=True
    )

    original_filename: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    video_path: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    audio_path: Mapped[str] = mapped_column(
        String,
        nullable=True
    )

    transcript_path: Mapped[str] = mapped_column(
        String,
        nullable=True
    )

    summary_path: Mapped[str] = mapped_column(
        String,
        nullable=True
    )

    language: Mapped[str] = mapped_column(
        String,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user_id: Mapped[int] = mapped_column(
    ForeignKey("users.id"),
    nullable=False
    )
