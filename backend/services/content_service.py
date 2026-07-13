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

def generate_content(transcript_path: Path, job_id: str, timestamp_path: Path) -> dict:
    """
    Generate AI content from a transcript.
    """
    SUMMARY_DIR.mkdir(parents=True, exist_ok=True)
    #summary_path = SUMMARY_DIR / f"{job_id}.json"

    with open(transcript_path, "r", encoding="utf-8") as file:
        transcript = file.read()
    with open(timestamp_path, "r", encoding="utf-8") as file:
        timestamps = json.load(file)
    prompt = f"""
        You are an expert video content analyzer.

        Analyze the transcript and timestamp segments.

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
            }}
        }}

        Rules for chapters:

        - Find only important moments.
        - Create meaningful video chapters.
        - Use the timestamp data.
        - Do not create a chapter for every segment.
        - Convert seconds into MM:SS format.

        Transcript:

        {transcript}


        Timestamp Data:

        {timestamps}
    """
    response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt
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