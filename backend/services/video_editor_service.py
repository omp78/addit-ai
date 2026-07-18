import os
import time
import subprocess
from pathlib import Path
from backend.utils.logger import logger

CLIPS_DIR = Path("storage/outputs/clips")

def parse_time_to_seconds(t_str: str) -> float:
    """
    Parses MM:SS, HH:MM:SS or direct float strings into seconds.
    """
    parts = t_str.strip().split(":")
    if len(parts) == 2:  # MM:SS
        return int(parts[0]) * 60 + float(parts[1])
    elif len(parts) == 3:  # HH:MM:SS
        return int(parts[0]) * 3600 + int(parts[1]) * 60 + float(parts[2])
    return float(t_str)

def cleanup_old_clips():
    """
    Deletes clip files in the temporary directory older than 15 minutes to save disk space.
    """
    try:
        if not CLIPS_DIR.exists():
            return
        now = time.time()
        for f in CLIPS_DIR.iterdir():
            if f.is_file():
                age_seconds = now - f.stat().st_mtime
                if age_seconds > 900:  # 15 minutes
                    f.unlink()
                    logger.info(f"Auto-cleaned orphan clip file: {f.name}")
    except Exception as e:
        logger.error(f"Error cleaning up clips directory: {e}")

def trim_video_clip(video_path: Path, start_time: str, end_time: str, aspect_ratio: str, job_id: str) -> Path:
    """
    Trims a segment from a video file and optionally crops it center-vertical (9:16).
    """
    CLIPS_DIR.mkdir(parents=True, exist_ok=True)
    cleanup_old_clips()

    start_sec = parse_time_to_seconds(start_time)
    end_sec = parse_time_to_seconds(end_time)
    duration = end_sec - start_sec

    if duration <= 0:
        raise ValueError("Invalid duration: end time must be greater than start time.")

    # Generate unique output filename
    clip_filename = f"clip_{job_id}_{int(start_sec)}_{int(end_sec)}_{aspect_ratio}.mp4"
    output_path = CLIPS_DIR / clip_filename

    # If the clip has already been processed, return the cached file path
    if output_path.exists():
        logger.info(f"Using cached video clip: {output_path}")
        return output_path

    # Construct the FFmpeg command
    cmd = [
        "ffmpeg",
        "-ss", str(start_sec),
        "-t", str(duration),
        "-i", str(video_path)
    ]

    if aspect_ratio == "vertical":
        # Applies center-crop filter for standard 9:16 layout
        cmd.extend(["-vf", "crop=ih*9/16:ih"])

    cmd.extend([
        "-c:v", "libx264",
        "-c:a", "aac",
        "-strict", "experimental",
        "-y",
        str(output_path)
    ])

    logger.info(f"Executing FFmpeg slice: {' '.join(cmd)}")
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    if result.returncode != 0:
        logger.error(f"FFmpeg error code {result.returncode}. Stderr: {result.stderr}")
        raise RuntimeError(f"FFmpeg failed to slice clip: {result.stderr}")

    logger.info(f"Video clip generated successfully: {output_path}")
    return output_path
