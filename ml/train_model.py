import os
from datetime import timedelta

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt  # можно не использовать, оставлен на всякий случай

from catboost import CatBoostRegressor, Pool
from sklearn.metrics import mean_squared_error, mean_absolute_error
import joblib  # для сохранения метаданных (список фич и т.п.)

# ----------------- ПУТИ -----------------

DATA_PATH = "dataset.csv"      # входной файл с историей
MODEL_DIR = "model"
MODEL_PATH = os.path.join(MODEL_DIR, "catboost_sales_model.cbm")   # файл модели
META_PATH = os.path.join(MODEL_DIR, "catboost_sales_meta.pkl")     # метаданные (фичи, лаги и т.п.)


# ----------------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ -----------------

def rmse(y_true, y_pred):
    mse = mean_squared_error(y_true, y_pred)
    return mse ** 0.5


def add_lags(group, target_col='sales_kg'):
    """
    Добавление лагов и скользящих средних для одной группы (город+товар).
    Полностью повторяет твою функцию add_lags.
    """
    group = group.copy()

    # Лаги: вчера, 2 дня назад, ..., неделю, 2 недели, 4 недели назад
    for lag in [1, 2, 3, 4, 5, 6, 7, 14, 28]:
        group[f'lag_{lag}'] = group[target_col].shift(lag)

    # Скользящие средние по прошлым дням
    group['rolling_7_mean'] = group[target_col].shift(1).rolling(window=7).mean()
    group['rolling_14_mean'] = group[target_col].shift(1).rolling(window=14).mean()
    group['rolling_30_mean'] = group[target_col].shift(1).rolling(window=30).mean()
    group['rolling_60_mean'] = group[target_col].shift(1).rolling(window=60).mean()

    return group


# ----------------- ОСНОВНОЙ PIPELINE ОБУЧЕНИЯ -----------------

def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    # 1. Чтение и первичная обработка
    data = pd.read_csv(
        DATA_PATH,
        sep=';',        # важно: в твоём файле разделитель — точка с запятой
        decimal=',',    # десятичный разделитель — запятая (1,23 -> 1.23)
        encoding='utf-8',  # если будет ошибка кодировки, попробуй 'cp1251'
    )

    print("Первые строки исходных данных:")
    print(data.head())
    print("\nТипы колонок до преобразований:")
    print(data.dtypes)

    # 1) Дата → datetime
    data['Дата'] = pd.to_datetime(data['Дата'], format='%d.%m.%Y')

    # 2) Продажи в кг → float (pandas уже учёл decimal=',', но на всякий случай)
    data['Продажи в кг'] = data['Продажи в кг'].astype(float)

    print("\nТипы колонок после преобразований:")
    print(data.dtypes)
    print("\nОписание данных:")
    print(data.describe(include='all'))

    # 2. Агрегация по дате/городу/товару
    df = (
        data
        .groupby(['Дата', 'Город', 'Товар'], as_index=False)
        ['Продажи в кг'].sum()
        .rename(columns={'Продажи в кг': 'sales_kg'})
    )

    print("\nПример агрегированных данных:")
    print(df.head())
    print("Минимальная дата:", df['Дата'].min())
    print("Максимальная дата:", df['Дата'].max())
    print('Число уникальных городов:', df['Город'].nunique())
    print('Число уникальных товаров:', df['Товар'].nunique())

    # Проверка пропусков
    print("\nПропуски по колонкам:")
    print(df.isna().sum())

    # Проверка на отрицательные продажи и экстремальные значения
    print('\nСтатистика по sales_kg до отсечения:')
    print('Мин продажи:', df['sales_kg'].min())
    print('95-й перцентиль:', df['sales_kg'].quantile(0.95))
    print('99-й перцентиль:', df['sales_kg'].quantile(0.99))
    print('Макс продажи:', df['sales_kg'].max())

    # Отсекаем отрицательные значения
    df['sales_kg'] = df['sales_kg'].clip(lower=0)

    # 3. Фича-инжиниринг
    df = df.sort_values(['Город', 'Товар', 'Дата'])

    # Календарные признаки
    df['dayofweek'] = df['Дата'].dt.weekday          # 0=понедельник, 6=воскресенье
    df['is_weekend'] = df['dayofweek'].isin([5, 6]).astype(int)
    df['day'] = df['Дата'].dt.day
    df['month'] = df['Дата'].dt.month
    df['year'] = df['Дата'].dt.year
    df['weekofyear'] = df['Дата'].dt.isocalendar().week.astype(int)

    group_cols = ['Город', 'Товар']
    df = df.sort_values(group_cols + ['Дата'])

    # Добавляем лаги и скользящие средние
    df = df.groupby(group_cols, group_keys=False).apply(add_lags)

    # Убираем строки, где лаги не посчитались (в начале ряда)
    df = df.dropna().reset_index(drop=True)

    print("\nПример данных после генерации лагов и скользящих средних:")
    print(df.head())

    # 4. Трейн/валид/тест сплиты по времени
    train_end = pd.Timestamp('2021-12-31')
    val_end = pd.Timestamp('2022-12-31')

    train = df[df['Дата'] <= train_end]
    val = df[(df['Дата'] > train_end) & (df['Дата'] <= val_end)]
    test = df[df['Дата'] > val_end]

    print("\nРазмеры выборок:")
    print("train:", len(train), "val:", len(val), "test:", len(test))

    target_col = 'sales_kg'

    # Список признаков — полностью как у тебя
    feature_cols = [
        # категориальные
        'Город',
        'Товар',
        # календарные
        'dayofweek', 'is_weekend', 'day', 'month', 'year', 'weekofyear',
        # лаги
        'lag_1', 'lag_2', 'lag_3', 'lag_4', 'lag_5', 'lag_6',
        'lag_7', 'lag_14', 'lag_28',
        # скользящие средние
        'rolling_7_mean', 'rolling_14_mean', 'rolling_30_mean', 'rolling_60_mean',
    ]

    X_train = train[feature_cols]
    y_train = train[target_col]

    X_val = val[feature_cols]
    y_val = val[target_col]

    X_test = test[feature_cols]
    y_test = test[target_col]

    cat_features = ['Город', 'Товар']

    train_pool = Pool(X_train, y_train, cat_features=cat_features)
    val_pool = Pool(X_val, y_val, cat_features=cat_features)
    test_pool = Pool(X_test, y_test, cat_features=cat_features)

    # 5. Базовая модель
    print("\n=== Обучаем базовую модель CatBoost ===")
    base_params = {
        'loss_function': 'RMSE',
        'eval_metric': 'RMSE',
        'random_seed': 42,
        'depth': 6,
        'learning_rate': 0.05,
        'l2_leaf_reg': 3.0,
        'iterations': 500,
        'verbose': 100
    }

    base_model = CatBoostRegressor(**base_params)
    base_model.fit(train_pool, eval_set=val_pool, use_best_model=True)

    val_pred = base_model.predict(val_pool)
    rmse_val = rmse(y_val, val_pred)
    mae_val = mean_absolute_error(y_val, val_pred)

    print(f"Baseline CatBoost: RMSE={rmse_val:.2f}, MAE={mae_val:.2f}")

    # 6. Перебор гиперпараметров
    print("\n=== Поиск лучших гиперпараметров ===")

    param_grid = [
        {'depth': 6, 'learning_rate': 0.05, 'l2_leaf_reg': 3.0},
        {'depth': 6, 'learning_rate': 0.03, 'l2_leaf_reg': 3.0},
        {'depth': 8, 'learning_rate': 0.05, 'l2_leaf_reg': 3.0},
        {'depth': 8, 'learning_rate': 0.03, 'l2_leaf_reg': 5.0},
        {'depth': 10, 'learning_rate': 0.03, 'l2_leaf_reg': 5.0},
    ]

    results = []

    for params in param_grid:
        print('------------------------------------')
        print('Пробуем параметры:', params)

        model = CatBoostRegressor(
            loss_function='RMSE',
            eval_metric='RMSE',
            random_seed=42,
            iterations=700,
            verbose=False,
            **params
        )

        model.fit(train_pool, eval_set=val_pool, use_best_model=True, verbose=False)

        val_pred = model.predict(val_pool)
        rmse_val = rmse(y_val, val_pred)
        mae_val = mean_absolute_error(y_val, val_pred)

        results.append({
            'params': params,
            'rmse_val': rmse_val,
            'mae_val': mae_val,
            'model': model
        })

        print(f"RMSE={rmse_val:.2f}, MAE={mae_val:.2f}")

    # Выбираем лучшую модель по RMSE на валидации
    best = min(results, key=lambda x: x['rmse_val'])
    best_model = best['model']

    print('\nЛучшая комбинация параметров:')
    print(best['params'])
    print(f"Лучший RMSE на валидации: {best['rmse_val']:.2f}")
    print(f"Лучший MAE на валидации: {best['mae_val']:.2f}")

    # 7. Финальное обучение на train + val
    print("\n=== Обучаем финальную модель на train+val ===")

    train_val = pd.concat([train, val], axis=0)

    X_train_val = train_val[feature_cols]
    y_train_val = train_val[target_col]

    train_val_pool = Pool(X_train_val, y_train_val, cat_features=cat_features)

    final_model = CatBoostRegressor(
        loss_function='RMSE',
        eval_metric='RMSE',
        random_seed=42,
        iterations=700,
        verbose=False,
        **best['params']
    )

    final_model.fit(train_val_pool, verbose=False)

    # 8. Оценка на test
    test_pred = final_model.predict(test_pool)

    mse_test = mean_squared_error(y_test, test_pred)
    rmse_test = mse_test ** 0.5
    mae_test = mean_absolute_error(y_test, test_pred)

    print(f"\n=== Качество финальной модели на TEST ===")
    print(f"Test RMSE={rmse_test:.2f}, MAE={mae_test:.2f}")

    # 9. Сохранение модели и метаданных
    print(f"\nСохраняем модель в файл: {MODEL_PATH}")
    final_model.save_model(MODEL_PATH, format="cbm")

    meta = {
        "feature_cols": feature_cols,
        "cat_features": cat_features,
        "best_params": best['params'],
        "train_end": train_end,
        "val_end": val_end,
    }

    print(f"Сохраняем метаданные в файл: {META_PATH}")
    joblib.dump(meta, META_PATH)

    print("\nГотово! Модель и метаданные сохранены.")


if __name__ == "__main__":
    main()
