from sqlalchemy.orm import Session
from app import models, schemas

# Users CRUD
def get_user_by_telegram_id(db: Session, telegram_id: int):
    return db.query(models.User).filter(models.User.telegram_id == telegram_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_or_create_user(db: Session, user_data: dict):
    user = get_user_by_telegram_id(db, user_data["telegram_id"])
    if user:
        return user
    
    user_create = schemas.UserCreate(**user_data)
    return create_user(db, user_create)

# Products CRUD
def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# Cities CRUD
def get_cities(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.City).offset(skip).limit(limit).all()

def get_city(db: Session, city_id: int):
    return db.query(models.City).filter(models.City.id == city_id).first()

def create_city(db: Session, city: schemas.CityCreate):
    db_city = models.City(**city.dict())
    db.add(db_city)
    db.commit()
    db.refresh(db_city)
    return db_city

# Forecast History CRUD
def create_forecast_history(db: Session, forecast_data: dict):
    db_forecast = models.ForecastHistory(**forecast_data)
    db.add(db_forecast)
    db.commit()
    db.refresh(db_forecast)
    return db_forecast

def get_user_forecast_history(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.ForecastHistory)\
        .filter(models.ForecastHistory.user_id == user_id)\
        .order_by(models.ForecastHistory.created_at.desc())\
        .offset(skip).limit(limit).all()

def get_all_forecast_history(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ForecastHistory)\
        .order_by(models.ForecastHistory.created_at.desc())\
        .offset(skip).limit(limit).all()