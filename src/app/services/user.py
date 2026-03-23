from app.core.auth import get_password_hash
from app.repository.user import UserRepository
from sqlalchemy.orm import Session

from app.schemas.user import UserDB, UserCreate, User
from fastapi import HTTPException, status

from app.core.auth import verify_password


class UserService:
    """Service class for user-related operations."""

    def __init__(self) -> None:
        """Initialize the UserService with a UserRepository instance."""
        self.repository = UserRepository()

    """Get functions"""

    def get_by_mail(self, db: Session, email: str) -> User | None:
        return self.repository.get_by_mail(db, email)

    def get_by_id(self, db: Session, user_id: int) -> User | None:
        return self.repository.get_by_id(db, user_id)

    def is_user_exists(self, db: Session, email: str) -> bool:
        """Check if a user with the given email already exists in the database."""
        return self.repository.get_by_mail(db, email) is not None

    """Post functions"""

    def register_user(self, db: Session, user_db: UserCreate) -> User:
        "FIXME: adding validation"
        """Register a new user.
        create a new user in the database with validation.

        Arguments:
            db: Database session
            user_db: User creation data
        
        Returns:
            User: The created user.
        
        Raises:
            HTTPException: If the username or email is already exists.
        """

        # Check if user already exists with the same username or email
        existing_user = self.is_user_exists(db, user_db.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        # Hash the password before creating the user
        hashed_password = get_password_hash(user_db.password)
        user_db = UserDB(
            username=user_db.username,
            email=user_db.email,
            hashed_password=hashed_password,
        )
        return self.repository.create_user(db, user_db)

    def authenticate(self, db: Session, email: str, password: str) -> User | None:
        """Authenticate user with email and password.

        Arguments:
            db: Database session
            email: User's email
            password: User's plaintext password
        Returns:
            User | None: The authenticated user if credentials are valid, None otherwise.
        """
        user = self.repository.get_by_mail(db, email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        if not verify_password(password, str(user.hashed_password)):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        return user


user_service = UserService()
