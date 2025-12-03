from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class UserBase(BaseModel):
    id: int
    telegram_id: int
    first_name: Optional[str] = None
    username: Optional[str] = None

class UserCreate(BaseModel):
    telegram_id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None

class ProductBase(BaseModel):
    id: int
    name: str
    category: Optional[str] = None

class ProductCreate(BaseModel):
    name: str
    category: Optional[str] = None

class CityBase(BaseModel):
    id: int
    name: str

class CityCreate(BaseModel):
    name: str

class ForecastRequest(BaseModel):
    product_id: int
    city_id: int
    period_months: int

class DataPoint(BaseModel):
    date: str
    value: float

class ForecastResponse(BaseModel):
    product_name: str
    historical_data: List[DataPoint]
    forecast_data: List[DataPoint]
    summary: str

class ForecastHistoryResponse(BaseModel):
    id: int
    product_name: str
    period_months: int
    summary: str
    created_at: datetime