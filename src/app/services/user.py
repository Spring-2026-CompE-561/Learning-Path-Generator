from app.core.auth import get_password_hash
from app.repository.user import UserRepository
from sqlalchemy.orm import Session

from app.schemas.user import UserDB, UserCreate, User


class UserService:
    """Service class for user-related operations."""

    def __init__(self) -> None:
        """Initialize the UserService with a UserRepository instance."""
        self.repository = UserRepository()

    "Return a user model, database object"

    def register_user(self, db: Session, user_db: UserCreate) -> User:
        "FIXME: adding validation"
        """Register a new user.
        create a new user in the database.
        """
        # Hash the password before creating the user
        hashed_password = get_password_hash(user_db.password)
        user_db = UserDB(
            username=user_db.username,
            email=user_db.email,
            hashed_password=hashed_password,
        )
        return self.repository.create_user(db, user_db)


user_service = UserService()
