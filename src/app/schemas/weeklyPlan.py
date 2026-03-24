"""WeeklyPlans schemas.
This module defines Pydantic Schemas for weekly plans for educational purposes.
"""

from pydantic import BaseModel
from typing import List


class WeeklyPlanBase(BaseModel):
    """Base schema for each WeeklyPlan object.
    All must have a goal, week number and a short description."""
    week_number: int
    goal: List[str]
    plan_description: str

class WeeklyPlanCreate(WeeklyPlanBase): 
    pass

class WeeklyPlanResponse(WeeklyPlanBase):
    """ Just return the ID for the system, in case we need to do any modification or referring 
    to specific plan
    """
    id: int
    learning_path_id: int
    completion_status: bool = False
    model_config = {"from_attributes": True}

