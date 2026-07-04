from datetime import datetime
from uuid import uuid4

from sqlalchemy import (
    String,
    DateTime
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column
)

from backend.database.base import Base


class User(Base):

    __tablename__ = "users"


    id: Mapped[int] = mapped_column(
        primary_key=True
    )


    user_id: Mapped[str] = mapped_column(
        String,
        unique=True,
        default=lambda: str(uuid4())
    )


    name: Mapped[str] = mapped_column(
        String,
        nullable=False
    )


    email: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False
    )


    hashed_password: Mapped[str] = mapped_column(
        String,
        nullable=False
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )