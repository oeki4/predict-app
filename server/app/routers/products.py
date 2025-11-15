from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app import schemas, crud
from app.database import get_db

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[schemas.ProductBase])
def get_products(db: Session = Depends(get_db)):
    """Получить список всех продуктов"""
    return crud.get_products(db)

@router.post("/", response_model=schemas.ProductBase)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    """Создать новый продукт (для админа)"""
    return crud.create_product(db, product)