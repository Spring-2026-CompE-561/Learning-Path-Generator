class UserRepository:
    """Repository class for user-related database operations."""

    def __init__(self, db):
        self.db = db

    def create_user(self, user_data):
        """Create a new user in the database.
        This method will take user data and insert it into the users table.
        """
