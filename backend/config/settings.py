"""
Application configuration.
"""

from pathlib import Path
import os

from dotenv import load_dotenv


# Load environment variables
load_dotenv()


# ======================
# ENV CONFIG
# ======================

DATABASE_URL = os.getenv(
    "DATABASE_URL"
)


SECRET_KEY = os.getenv(
    "SECRET_KEY"
)


ALGORITHM = os.getenv(
    "ALGORITHM",
    "HS256"
)


ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        60
    )
)



# ======================
# STORAGE CONFIG
# ======================


# Base storage directory
STORAGE_DIR = Path("storage")


# Uploads
UPLOAD_DIR = STORAGE_DIR / "uploads"


# Outputs
OUTPUT_DIR = STORAGE_DIR / "outputs"


AUDIO_DIR = OUTPUT_DIR / "audio"


TRANSCRIPT_DIR = OUTPUT_DIR / "transcript"


SUMMARY_DIR = OUTPUT_DIR / "summary"


THUMBNAIL_DIR = OUTPUT_DIR / "thumbnails"

