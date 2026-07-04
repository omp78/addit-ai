from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from jose import jwt, JWTError

from backend.utils.security import (
    SECRET_KEY,
    ALGORITHM
)

from backend.database.connection import SessionLocal
from backend.repositories.user_repository import get_user_by_user_id


security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials


    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )


        user_id = payload.get("sub")


        if not user_id:

            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )


    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


    db = SessionLocal()


    try:

        user = get_user_by_user_id(
            db,
            user_id
        )


        if not user:

            raise HTTPException(
                status_code=401,
                detail="User not found"
            )


        return user


    finally:

        db.close()