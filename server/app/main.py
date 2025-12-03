from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, products, forecast, cities
from app.database import engine
from app import models
from app.routers import users, products, forecast

# Создаем таблицы в БД
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartDemand API",
    description="API для системы прогнозирования спроса с привязкой к пользователям Telegram",
    version="1.0.0",
)

# Разрешаем запросы с любых доменов (по сути максимально ослабленный CORS).
# Если позже нужно будет ограничить список доменов — сюда можно подставить конкретные origin'ы.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(users.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(forecast.router, prefix="/api/v1")
app.include_router(cities.router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "Start Hosting"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
