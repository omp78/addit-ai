"""
Health check API.
"""

from fastapi import APIRouter
from sqlalchemy import text

from backend.database.connection import SessionLocal


router = APIRouter(
    prefix="/health",
    tags=["Health"]
)


@router.get("")
def health_check():

    db = SessionLocal()

    try:

        db.execute(
            text("SELECT 1")
        )

        return {

            "status": "healthy",

            "database": "connected",

            "service": "Addit AI"

        }


    except Exception as e:

        return {

            "status": "unhealthy",

            "database": "error",

            "error": str(e)

        }


    finally:

        db.close()