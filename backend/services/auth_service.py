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


def login_google(credential: str):
    import requests
    import secrets

    try:
        response = requests.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}",
            timeout=5
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to connect to Google validation service: {str(e)}"
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=401,
            detail="Invalid Google token"
        )

    token_info = response.json()

    if token_info.get("email_verified") != "true" and token_info.get("email_verified") != True:
        raise HTTPException(
            status_code=400,
            detail="Google account email is not verified"
        )

    email = token_info.get("email")
    name = token_info.get("name", "Google User")

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email not provided by Google token"
        )

    db = SessionLocal()
    try:
        user = get_user_by_email(db, email)
        if not user:
            random_pwd = secrets.token_hex(16)
            user = create_user(
                db,
                {
                    "name": name,
                    "email": email,
                    "hashed_password": hash_password(random_pwd)
                }
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