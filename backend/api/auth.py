from fastapi import APIRouter,Depends

from backend.services.auth_service import register_user,login_user

from backend.dependencies.auth_dependency import get_current_user

from backend.schemas.auth_schema import (
    UserRegister,
    UserResponse,
    UserLogin,
    TokenResponse
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user: UserRegister
):

    return register_user(user)

@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    user: UserLogin
):

    return login_user(user)

@router.get("/me")
def me(
    user = Depends(get_current_user)
):

    return {
        "user_id": user.user_id,
        "name": user.name,
        "email": user.email
    }