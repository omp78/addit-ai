from fastapi import HTTPException

from backend.database.connection import SessionLocal

from backend.repositories.user_repository import (
    create_user,
    get_user_by_email
)

from backend.utils.security import (
    verify_password,
    create_access_token
)

from backend.utils.security import hash_password


def register_user(user_data):

    db = SessionLocal()

    try:

        existing_user = get_user_by_email(
            db,
            user_data.email
        )


        if existing_user:

            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )


        user = create_user(
            db,
            {
                "name": user_data.name,
                "email": user_data.email,
                "hashed_password": hash_password(
                    user_data.password
                )
            }
        )


        return user


    finally:

        db.close()


def login_user(user_data):

    db = SessionLocal()

    try:

        user = get_user_by_email(
            db,
            user_data.email
        )


        if not user:

            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )


        if not verify_password(
            user_data.password,
            user.hashed_password
        ):

            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )


        token = create_access_token(
            {
                "sub": user.user_id
            }
        )


        return {
            "access_token": token,
            "token_type": "bearer"
        }


    finally:

        db.close()