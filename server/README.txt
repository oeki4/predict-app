Подготовка к запуску (м):
1. python -m venv venv
2. venv\Scripts\activate
3. pip install "fastapi [standart]"

Запуск бэкенда (команды в терминале):
1. cd server
2. python -m app.import_dataset
3. python run.py

Используемая БД: PostreSQL + pgAdmin 4
Изменить конфигурацию БД: пароль, пользователя и название таблицы можно в файле server/app/database.py (6 строка)

Необходимая документация сервера: http://127.0.0.1:8000/docs
Для тестирования и создания запросов испоьзовать этот же адрес

Для начала работы надо создать продукт:
1. products 
2. POST /api/v1/products
3. Try it out
4. Изменить поля в теле запроса, например на:
    {
        "name": "Яйца",
        "category": "Еда"
    }

После созданий продукта сделаем запрос на получение прогноза:
1. forecast 
2. POST /api/v1/forecast
3. Try it out
4. В поле Telegram-Init-Data вставить данные для пользователя, например:
    user={"id":123456,"first_name":"John","username":"john_doe"}
    user={"id":654321,"first_name":"Alice","last_name":"Smith"}
5. Изменить поля в теле запроса, например на:
    {
        "product_id": 1,
        "period_months": 3
    }



