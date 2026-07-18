"""
Business logic for AI content generation using Gemini.
"""

import json
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai

from backend.config.settings import SUMMARY_DIR

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found.")

client = genai.Client(api_key=api_key)

def generate_content(video_path: Path, job_id: str) -> dict:
    """
    Generate AI content directly from a video file.
    """
    import time
    from backend.utils.logger import logger

    SUMMARY_DIR.mkdir(parents=True, exist_ok=True)

    logger.info(f"Uploading video {video_path.name} to Gemini Files API...")
    video_file = client.files.upload(file=video_path)
    logger.info(f"Uploaded. File name on Google servers: {video_file.name}. State: {video_file.state.name}")

    while video_file.state.name == "PROCESSING":
        logger.info("Waiting for Google to process video frames...")
        time.sleep(5)
        video_file = client.files.get(name=video_file.name)

    if video_file.state.name == "FAILED":
        raise ValueError(f"Video file processing failed on Google servers: {video_file.name}")

    logger.info("Video processing complete. Prompting Gemini model...")

    prompt = f"""
        You are an expert video content analyzer.

        Watch the video (both visual frames and audio cues).

        Return ONLY valid JSON.

        Structure:

        {{
            "summary":"",

            "key_points":[
                "",
                "",
                ""
            ],

            "chapters":[
                {{
                    "time":"00:00",
                    "title":""
                }}
            ],

            "youtube_title":"",

            "youtube_description":"",

            "seo_keywords":[
                "",
                "",
                ""
            ],

            "creator_intelligence": {{
                "viral_score": 85,
                "hook_analysis": {{
                    "rating": "Strong",
                    "feedback": "",
                    "suggestions": [
                        "",
                        ""
                    ]
                }},
                "audience_detection": {{
                    "demographics": "",
                    "interests": ""
                }},
                "platform_scores": {{
                    "youtube_longform": 90,
                    "youtube_shorts": 70,
                    "tiktok": 80,
                    "instagram_reels": 75,
                    "linkedin": 60
                }},
                "upload_time_suggestions": [
                    "",
                    ""
                ],
                "cta_suggestions": [
                    "",
                    ""
                ],
                "thumbnail_ideas": [
                    "",
                    ""
                ]
            }},

            "social_package": {{
                "instagram": {{
                    "caption": "",
                    "hashtags": ["", "", ""]
                }},
                "linkedin": {{
                    "post": ""
                }},
                "twitter": {{
                    "thread": [
                        "",
                        "",
                        ""
                    ]
                }},
                "facebook": {{
                    "caption": ""
                }},
                "threads": {{
                    "post": ""
                }}
            }}
        }}

        Rules for chapters:

        - Find only important moments.
        - Create meaningful video chapters.
        - Do not create a chapter for every segment.
        - Convert seconds into MM:SS format.

        Rules for social posts:
        - For Instagram: Write an engaging, emoji-rich caption with spacing and a dedicated list of relevant hashtags.
        - For LinkedIn: Write a professional, hook-driven post highlighting key business/educational value with clean bullet points.
        - For Twitter: Write a thread of at least 3 tweets. Each tweet must be strictly under 280 characters.
        - For Facebook: Write a casual, community-engaging post.
        - For Threads: Write a conversational, punchy, text-first post.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            video_file,
            prompt
        ]
    )
    generated_text = response.text
    generated_text = generated_text.replace("```json", "")
    generated_text = generated_text.replace("```", "")
    generated_text = generated_text.strip()

    content = json.loads(generated_text)

    summary_path = SUMMARY_DIR / f"{job_id}.json"

    with open(summary_path, "w", encoding="utf-8") as file:
        json.dump(content, file, indent=4, ensure_ascii=False)

    return {
        "summary_path": str(summary_path),
        **content
    }