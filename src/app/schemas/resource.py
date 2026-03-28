from pydantic import BaseModel, Field, HttpUrl
from typing import Literal

# no resource creation schema needa because ai will generate it


class ResourceBase(BaseModel):
    """base schema that will be used by the other resource response schema"""

    # literal restricts to a specific choice so it tells you out of the choices what this type is
    resource_type: Literal["video", "audio", "article", "problems", "course"]

    # Field sets max length to 300 and ... makes it req, used to describe what your resource does
    resource_summary: str = Field(..., max_length=300)

    url: str = Field(..., max_length=2000)


class ResourceUpdate(BaseModel):
    """meant to be used if they want to switch the resources given, required to give description as to what they want instead for better resources"""

    message: str


class ResourseCreate(BaseModel):
    weekly_plan_id: int
    resource_type: Literal["video", "audio", "article", "problems", "course"]
    resource_summary: str = Field(..., max_lenght=300)
    url: HttpUrl


class Resource(ResourceBase):
    """response that is given to frontend when resource is viewed or updated"""

    id: int

    # makes it so that pydantic can understand sqlalchemy
    model_config = {"from_attributes": True}
