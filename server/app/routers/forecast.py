from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from app import schemas, crud, models
from app.dependencies import get_current_user
from app.database import get_db
from app.ml_service import get_forecast_for_product

router = APIRouter(prefix="/forecast", tags=["forecast"])


@router.post("/", response_model=schemas.ForecastResponse)
def get_forecast(
    request: schemas.ForecastRequest,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Создать прогноз спроса для выбранного продукта
    на основе обученной CatBoost-модели.
    """

    # Получаем продукт
    product = crud.get_product(db, request.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Строим реальный ML-прогноз
    try:
        historical_data, forecast_data = get_forecast_for_product(
            product_id=product.id,
            period_months=request.period_months,
        )
    except ValueError as e:
        # Например, если нет данных по этому продукту в датасете
        raise HTTPException(status_code=400, detail=str(e))

    # Формируем summary на основе фактических чисел
    if historical_data and forecast_data:
        # Берём последние N месяцев истории (если их меньше — сколько есть)
        hist_tail = historical_data[-request.period_months :]
        hist_avg = sum(p.value for p in hist_tail) / len(hist_tail)
        forecast_avg = sum(p.value for p in forecast_data) / len(forecast_data)

        if hist_avg > 0:
            change_pct = (forecast_avg - hist_avg) / hist_avg * 100.0
            direction = "увеличится" if change_pct >= 0 else "уменьшится"
            summary = (
                f"Ожидается, что спрос на {product.name} {direction} "
                f"примерно на {abs(change_pct):.1f}% в течение следующих "
                f"{request.period_months} месяцев."
            )
        else:
            summary = (
                f"Недостаточно исторических данных для корректного сравнения, "
                f"отображается прогноз на {request.period_months} месяцев для товара {product.name}."
            )
    else:
        summary = (
            f"Недостаточно данных для построения прогноза по продукту {product.name}."
        )

    # Лог для отладки
    print("ДАННЫЕ ДЛЯ СОХРАНЕНИЯ:")
    print(f"  user_id: {user.id} (type: {type(user.id)})")
    print(f"  product_id: {product.id} (type: {type(product.id)})")
    print(f"  product_name: '{product.name}' (type: {type(product.name)})")
    print(f"  period_months: {request.period_months} (type: {type(request.period_months)})")
    print(f"  summary: '{summary}' (type: {type(summary)})")

    # Сохраняем в историю (структура такая же, как была у фейковой версии)
    forecast_history_data = {
        "user_id": user.id,
        "product_id": product.id,
        "product_name": product.name,
        "period_months": request.period_months,
        "forecast_data": json.dumps(
            {
                "historical": [item.dict() for item in historical_data],
                "forecast": [item.dict() for item in forecast_data],
            },
            ensure_ascii=False,
        ),
        "summary": summary,
    }
    crud.create_forecast_history(db, forecast_history_data)

    return schemas.ForecastResponse(
        product_name=product.name,
        historical_data=historical_data,
        forecast_data=forecast_data,
        summary=summary,
    )


@router.get("/my-history", response_model=List[schemas.ForecastHistoryResponse])
def get_my_forecast_history(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Получить историю прогнозов текущего пользователя"""
    return crud.get_user_forecast_history(db, user.id)


@router.get("/admin/all-history")
def get_all_forecast_history(db: Session = Depends(get_db)):
    """Получить всю историю прогнозов (для админа)"""
    history = crud.get_all_forecast_history(db)

    result = []
    for forecast in history:
        result.append(
            {
                "id": forecast.id,
                "user_id": forecast.user_id,
                "product_name": forecast.product_name,
                "period_months": forecast.period_months,
                "summary": forecast.summary,
                "created_at": forecast.created_at,
            }
        )

    return result
