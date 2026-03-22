from sqlalchemy.orm import Session
from app.schemas.user import UserDB
from app.models.user import User


class UserRepository:
    """Repository class for user-related database operations."""

    @staticmethod
    def create_user(db: Session, user_db: UserDB) -> User:
        """Create a new user in the database."""
        db_user = User(email=user_db.email, hashed_password=user_db.hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
