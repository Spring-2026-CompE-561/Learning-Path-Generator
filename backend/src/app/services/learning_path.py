from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.repository.learning_path import LearningPathRepository
from app.schemas.learningpath import LearningPathCreate
from app.models.learningpath import LearningPath


class LearningPathService:
    """Service class for learning-path-related operations."""

    def __init__(self) -> None:
        """Initialize the LearningPathService with a LearningPathRepository instance."""
        self.repository = LearningPathRepository()

    """Read functions"""

    def get_by_id(self, db: Session, learning_path_id: int) -> LearningPath:
        """Get a learning path by ID, raising 404 if not found."""
        learning_path = self.repository.get_by_id(db, learning_path_id)
        if learning_path is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Learning path not found",
            )
        return learning_path

    def get_all_by_user(self, db: Session, user_id: int) -> list[LearningPath]:
        """Get all learning paths for a specific user."""
        return self.repository.get_all_by_user(db, user_id)

    """Create functions"""

    def create_learning_path(
        self, db: Session, learning_path_data: LearningPathCreate, user_id: int
    ) -> LearningPath:
        """Create a new learning path for a user.

        Arguments:
            db: Database session
            learning_path_data: Learning path creation data
            user_id: ID of the user creating the learning path

        Returns:
            LearningPath: The created learning path.

        Raises:
            HTTPException: If creation fails.
        """
        return self.repository.create_learning_path(db, learning_path_data, user_id)

    """Update functions"""

    def update_learning_path(
        self, db: Session, learning_path_id: int, user_id: int, updates: dict
    ) -> LearningPath:
        """Update a learning path, verifying ownership.

        Arguments:
            db: Database session
            learning_path_id: ID of the learning path to update
            user_id: ID of the current user (for ownership check)
            updates: Dictionary of fields to update

        Returns:
            LearningPath: The updated learning path.

        Raises:
            HTTPException: If learning path not found or user doesn't own it.
        """
        learning_path = self.get_by_id(db, learning_path_id)
        if learning_path.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this learning path",
            )
        return self.repository.update_learning_path(db, learning_path, updates)

    """Delete functions"""

    def delete_learning_path(
        self, db: Session, learning_path_id: int, user_id: int
    ) -> None:
        """Delete a learning path, verifying ownership.

        Arguments:
            db: Database session
            learning_path_id: ID of the learning path to delete
            user_id: ID of the current user (for ownership check)

        Raises:
            HTTPException: If learning path not found or user doesn't own it.
        """
        learning_path = self.get_by_id(db, learning_path_id)
        if learning_path.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this learning path",
            )
        self.repository.delete_learning_path(db, learning_path)


learning_path_service = LearningPathService()
