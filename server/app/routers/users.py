from fastapi import APIRouter, Depends
from app import schemas
from app.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=schemas.UserBase)
def get_current_user_info(user: schemas.UserBase = Depends(get_current_user)):
    """Информация о текущем пользователе"""
    return user