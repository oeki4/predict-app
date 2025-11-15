from fastapi import HTTPException, Header, Depends
from sqlalchemy.orm import Session
from urllib.parse import parse_qsl
import json
from app import crud
from app.database import get_db

def verify_telegram_init_data(init_data: str) -> dict:
    """
    Упрощенная валидация Telegram WebApp initData
    """
    try:
        data = dict(parse_qsl(init_data))
        user_data_str = data.get("user", "{}")
        
        # Парсим JSON строку пользователя
        user_data = json.loads(user_data_str)
        
        return {
            "telegram_id": user_data.get("id", 0),
            "first_name": user_data.get("first_name", ""),
            "last_name": user_data.get("last_name", ""),
            "username": user_data.get("username", ""),
        }
    except Exception as e:
        print(f"Error parsing initData: {e}")
        return None

async def get_current_user(
    telegram_init_data: str = Header(..., alias="Telegram-Init-Data"),
    db: Session = Depends(get_db)
):
    """
    Получаем или создаем пользователя на основе Telegram initData
    """
    if not telegram_init_data:
        raise HTTPException(status_code=401, detail="Telegram init data required")
    
    user_data = verify_telegram_init_data(telegram_init_data)
    if not user_data or not user_data["telegram_id"]:
        raise HTTPException(status_code=401, detail="Invalid Telegram init data")
    
    # Ищем пользователя в БД или создаем нового
    user = crud.get_or_create_user(db, user_data)
    return user