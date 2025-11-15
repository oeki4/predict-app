from fastapi import FastAPI
from app.database import engine
from app import models
from app.routers import users, products, forecast

# Создаем таблицы в БД
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartDemand API",
    description="API для системы прогнозирования спроса с привязкой к пользователям Telegram",
    version="1.0.0"
)

# Подключаем роутеры
app.include_router(users.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(forecast.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Start Hosting"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
