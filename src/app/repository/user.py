from sqlalchemy.orm import Session
from app.schemas.user import UserDB
from app.models.user import User


class UserRepository:
    """Repository class for user-related database operations."""

    "GET"

    @staticmethod
    def get_by_mail(db: Session, email: str) -> User | None:
        """Get a user by email."""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> User | None:
        """Get a user by ID."""
        return db.query(User).filter(User.id == user_id).first()

    "POST"

    @staticmethod
    def create_user(db: Session, user_db: UserDB) -> User:
        """Create a new user in the database.
        transfering the user data from the UserDB schema to the User model and saving it to the database."""
        db_user = User(
            username=user_db.username,
            email=user_db.email,
            hashed_password=user_db.hashed_password,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
