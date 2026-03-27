from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.resource import resource_service
from app.schemas.resource import Resource as ResourceSchema

api_router = APIRouter(prefix = "/resources", tags = ["resources"])


"""Creating the resourca tied to plan"""
@api_router.post("/", response_model=ResourceSchema, status_code = status.HTTP_201_CREATED)

def create_resource(
    weekly_plan_id: int, resource_type: str, resource_summary: str, url: str,
    db: Session = Depends(get_db),
):
    return resource_service.create_resource(db, weekly_plan_id, resource_type, resource_summary, url)


"""Get all resources weekly plan for disp"""
@api_router.get("/weekly-plan/{weekly_plan_id}", response_model = list[ResourceSchema])

def get_all(
    weekly_plan_id: int, db: Session = Depends(get_db),
):
    return resource_service.get_all_by_weekly_plan(db, weekly_plan_id)


"""Get using resource id for view or edit"""
@api_router.get("/{resource_id}", response_model = ResourceSchema)

def get_using_specificid(
    resource_id: int, db: Session = Depends(get_db),
):
    return resource_service.get_by_id(db, resource_id)


"""Updating the resource, Todo:(can change updates if schema is updated)"""
@api_router.put("/{resource_id}", response_model = ResourceSchema)

def updating_resource(
    resource_id: int, updates: dict, db: Session = Depends(get_db),
):
    return resource_service.update_resource(db, resource_id, updates)


"""Delete the resource, return 204 no content"""
@api_router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
def del_resource(
    resource_id: int, db: Session = Depends(get_db),
):
    resource_service.delete_resource(db, resource_id)
    return None