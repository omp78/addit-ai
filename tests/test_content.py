from pathlib import Path

from backend.services.content_service import generate_content

result = generate_content(
    Path("storage/outputs/transcript/d7ad6a7a-e702-4ffa-8b2b-e59f8b4e65e1.txt"),
    "d7ad6a7a-e702-4ffa-8b2b-e59f8b4e65e1"
)

print(result)