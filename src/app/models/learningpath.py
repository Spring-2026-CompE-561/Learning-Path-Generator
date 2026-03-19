# importing from sqlalchemy the data types and things needed for the model
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON, func

# links between all the models made
from sqlalchemy.orm import relationship

from app.core.database import Base


# model named LearningPath
class LearningPath(Base):
    __tablename__ = "learning_paths"
  
    # new column named ID, primary key for learning path -> auto increment comes with primary key and every column is required by default
    id = Column(Integer, primary_key=True, index=True)

    # user id thats considered the foreign key -> points to users.id which is primary key of users, nullable = false makes it required
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # setting it for now to a max of 30 characters for topic and making sure its unique and required
    topic = Column(String(30), unique=True, nullable=False)

    # still debating on using this one
    proficency = Column(String, nullable=True)

    # optional also, using JSON for the array of strings
    learning_type = Column(JSON, nullable=True)

    # taking care of the min and max cojnstraint within the schema
    weeks = Column(Integer, nullable=False)

    # this will make sure that when created it will set the time to what it currently is
    create_at = Column(DateTime, server_default=func.now())

    # connecting back and matching to the relationship called in User.py
    user = relationship("User", back_populates="learning_paths")

    # making new realtionship with the weekly
    weekly_plans = relationship("WeeklyPlan", back_populates="learning_path")
