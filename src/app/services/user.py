class UserService:
    """Service class for user-related operations."""

    def __init__(self, db):
        self.db = db

    def register_user(self, user_data):
        """Register a new user.
        This method will take user data, validate it, and create a new user in the database.
        """
