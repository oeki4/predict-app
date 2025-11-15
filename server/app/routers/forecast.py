from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import json
from typing import List
from app import schemas, crud, models
from app.dependencies import get_current_user
from app.database import get_db


router = APIRouter(prefix="/forecast", tags=["forecast"])

def generate_fake_historical_data(months: int = 6):
    """Генерирует фейковые исторические данные"""
    historical = []
    base_date = datetime.now() - timedelta(days=30 * months)
    
    for i in range(months):
        date = base_date + timedelta(days=30 * i)
        historical.append(schemas.DataPoint(
            date=date.strftime("%Y-%m-%d"),
            value=random.randint(80, 120)
        ))
    return historical

def generate_fake_forecast(historical_data: List[schemas.DataPoint], period_months: int):
    """Генерирует фейковый прогноз"""
    forecast = []
    if not historical_data:
        return forecast
        
    last_date = datetime.strptime(historical_data[-1].date, "%Y-%m-%d")
    
    for i in range(period_months):
        date = last_date + timedelta(days=30 * (i + 1))
        forecast.append(schemas.DataPoint(
            date=date.strftime("%Y-%m-%d"),
            value=random.randint(90, 130)
        ))
    return forecast

@router.post("/", response_model=schemas.ForecastResponse)
def get_forecast(
    request: schemas.ForecastRequest,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Создать прогноз спроса для выбранного продукта"""
    
    # Получаем продукт
    product = crud.get_product(db, request.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Генерируем данные
    historical_data = generate_fake_historical_data()
    forecast_data = generate_fake_forecast(historical_data, request.period_months)
    
    # Генерируем summary
    change = random.choice(["увеличится", "уменьшится"])
    percent = random.randint(5, 20)
    summary = f"Спрос на {product.name} {change} на {percent}% в следующие {request.period_months} месяцев"

    print("ДАННЫЕ ДЛЯ СОХРАНЕНИЯ:")
    print(f"  user_id: {user.id} (type: {type(user.id)})")
    print(f"  product_id: {product.id} (type: {type(product.id)})") 
    print(f"  product_name: '{product.name}' (type: {type(product.name)})")
    print(f"  period_months: {request.period_months} (type: {type(request.period_months)})")
    print(f"  summary: '{summary}' (type: {type(summary)})")

    # Сохраняем в историю
    forecast_history_data = {
        "user_id": user.id,
        "product_id": product.id,
        "product_name": product.name,
        "period_months": request.period_months,
        "forecast_data": json.dumps({
            "historical": [item.dict() for item in historical_data],
            "forecast": [item.dict() for item in forecast_data]
        }, ensure_ascii=False),
        "summary": summary
    }
    crud.create_forecast_history(db, forecast_history_data)
    
    return schemas.ForecastResponse(
        product_name=product.name,
        historical_data=historical_data,
        forecast_data=forecast_data,
        summary=summary
    )

@router.get("/my-history", response_model=List[schemas.ForecastHistoryResponse])
def get_my_forecast_history(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить историю прогнозов текущего пользователя"""
    return crud.get_user_forecast_history(db, user.id)

@router.get("/admin/all-history")
def get_all_forecast_history(db: Session = Depends(get_db)):
    """Получить всю историю прогнозов (для админа)"""
    history = crud.get_all_forecast_history(db)
    
    result = []
    for forecast in history:
        result.append({
            "id": forecast.id,
            "user_id": forecast.user_id,
            "product_name": forecast.product_name,
            "period_months": forecast.period_months,
            "summary": forecast.summary,
            "created_at": forecast.created_at
        })
    
    return result