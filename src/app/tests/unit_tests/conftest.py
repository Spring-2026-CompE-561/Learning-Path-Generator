import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db

# main conftest that the other tests will use and add onto for their own purposes

# new db made so that real data is never actually used
TEST_DATABASE_URL = "sqlite:///./test.db"

# creating connection to test db
engine = create_engine(
    TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)

# creates sessions pointing at the test db
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# anohter verison of get_db that is meant to connect to the test db instead of the real one
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# makes sure that all endpoints for tests use the test db and not the real one 
app.dependency_overrides[get_db] = override_get_db

# creates new tables for each tests and makes sure to destroy them after so that its not the same for every test and each test starts with a clean db to use
@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

# provides a session for the test if they need to interact wiht the db
@pytest.fixture
def db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# creates a fake HTTP clienting for route testing
@pytest.fixture
def client():
    return TestClient(app)