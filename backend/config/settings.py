"""
Application configuration.
"""

from pathlib import Path



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