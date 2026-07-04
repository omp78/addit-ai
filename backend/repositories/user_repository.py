from sqlalchemy.orm import Session

from backend.models.user import User


def create_user(
    db: Session,
    user_data: dict
):

    user = User(**user_data)

    db.add(user)

    db.commit()

    db.refresh(user)

    return user



def get_user_by_email(
    db: Session,
    email: str
):

    return (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

def get_user_by_user_id(
    db,
    user_id: str
):

    return (
        db.query(User)
        .filter(
            User.user_id == user_id
        )
        .first()
    )