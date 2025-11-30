FROM python:3.13-slim

WORKDIR /app

# Устанавливаем зависимости системы (при необходимости можно добавить libpq-dev и т.п.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
  && rm -rf /var/lib/apt/lists/*

# Копируем requirements и устанавливаем зависимости Python
COPY server/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код backend
COPY server/app ./app
COPY server/run.py ./run.py

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Запускаем приложение через uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]



