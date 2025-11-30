FROM node:22-alpine

WORKDIR /app

# Копируем package.json и lock-файл для установки зависимостей
COPY client/package*.json ./

# Используем npm install вместо npm ci, чтобы не требовать строгого совпадения lock-файла
RUN npm install

# Копируем остальной код фронтенда
COPY client ./

EXPOSE 80

# Запуск dev-сервера Vite (порт внутри контейнера 80, пробрасывается наружу через docker-compose)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"]



