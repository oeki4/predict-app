from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app import schemas, crud
from app.database import get_db

router = APIRouter(prefix="/cities", tags=["cities"])


@router.get("/", response_model=List[schemas.CityBase])
def get_cities(db: Session = Depends(get_db)):
    """Получить список всех городов"""
    return crud.get_cities(db)

@router.post("/", response_model=schemas.CityBase)
def create_city(city: schemas.CityCreate, db: Session = Depends(get_db)):
    """Создать новый город (для админа)"""
    return crud.create_city(db, city)
