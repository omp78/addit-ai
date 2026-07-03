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

def generate_content(transcript_path: Path, job_id: str) -> dict:
    """
    Generate AI content from a transcript.
    """
    SUMMARY_DIR.mkdir(parents=True, exist_ok=True)
    #summary_path = SUMMARY_DIR / f"{job_id}.json"

    with open(transcript_path, "r", encoding="utf-8") as file:
        transcript = file.read()

    prompt = f"""
    You are an expert content creator.

    Analyze the following transcript.

    Return ONLY valid JSON.

    Structure:

    {{
        "summary":"",

        "key_points":[
            "",
            "",
            ""
        ],

        "youtube_title":"",

        "youtube_description":"",

        "seo_keywords":[
            "",
            "",
            ""
        ]
    }}

    Transcript:

    {transcript}
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