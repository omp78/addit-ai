"""
Utility functions for validating uploaded files.
"""

from pathlib import Path

# Allowed video file extensions
ALLOWED_VIDEO_EXTENSIONS = {
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
    ".webm",
}


def is_allowed_file(filename: str) -> bool:
    """
    Check whether the uploaded file has a supported video extension.

    Args:
        filename: Name of the uploaded file.

    Returns:
        True if the file extension is allowed, otherwise False.
    """

    extension = Path(filename).suffix.lower()

    return extension in ALLOWED_VIDEO_EXTENSIONS