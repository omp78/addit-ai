from datetime import datetime

from sqlalchemy import JSON, DateTime, Integer, String
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

    chapter_path: Mapped[str] = mapped_column(
        String,
        nullable=True
    )

    summary: Mapped[str] = mapped_column(
        String,
        nullable=True
    )


    key_points: Mapped[dict] = mapped_column(
        JSON,
        nullable=True
    )


    chapters: Mapped[dict] = mapped_column(
        JSON,
        nullable=True
    )


    youtube_title: Mapped[str] = mapped_column(
        String,
        nullable=True
    )


    youtube_description: Mapped[str] = mapped_column(
        String,
        nullable=True
    )


    seo_keywords: Mapped[dict] = mapped_column(
        JSON,
        nullable=True
    )

    creator_intelligence: Mapped[dict] = mapped_column(
        JSON,
        nullable=True
    )