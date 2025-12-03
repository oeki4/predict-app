FROM python:3.13-slim

WORKDIR /app

# Устанавливаем зависимости системы (при необходимости можно добавить libpq-dev и т.п.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
  && rm -rf /var/lib/apt/lists/*

# Копируем requirements и устанавливаем зависимости Python
COPY server/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Копируем датасет для импорта в БД
COPY ml ./ml

# Копируем исходный код backend
COPY server/app ./app
COPY server/run.py ./run.py

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Запускаем приложение: сначала импортируем датасет, затем города, затем стартуем uvicorn
CMD ["sh", "-c", "python -m app.import_dataset && python -m app.import_cities && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
