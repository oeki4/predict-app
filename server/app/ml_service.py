from pathlib import Path
from datetime import timedelta
from typing import List, Tuple

import numpy as np
import pandas as pd
from catboost import CatBoostRegressor
import joblib

from app.schemas import DataPoint


# ---------- ПУТИ К ФАЙЛАМ ----------

FILE_PATH = Path(__file__).resolve()

# Пытаемся угадать корень проекта в двух сценариях:
# 1) Локально: <PROJECT_ROOT>/server/app/ml_service.py  -> parents[2] == <PROJECT_ROOT>
# 2) В Docker: /app/app/ml_service.py                   -> parents[1] == /app
_base_dir_candidates = []
try:
    _base_dir_candidates.append(FILE_PATH.parents[2])
except IndexError:
    pass
try:
    _base_dir_candidates.append(FILE_PATH.parents[1])
except IndexError:
    pass

BASE_DIR = None
MODEL_PATH = None
META_PATH = None
DATA_PATH = None

for base in _base_dir_candidates:
    ml_dir = base / "ml"
    model_candidate = ml_dir / "model" / "catboost_sales_model.cbm"
    meta_candidate = ml_dir / "model" / "catboost_sales_meta.pkl"
    data_candidate = ml_dir / "dataset.csv"

    # минимальная проверка — наличие файла модели
    if model_candidate.exists():
        BASE_DIR = base
        MODEL_PATH = model_candidate
        META_PATH = meta_candidate
        DATA_PATH = data_candidate
        break

# Если не нашли по факту, просто берём первый кандидат и формируем пути от него
if BASE_DIR is None:
    if not _base_dir_candidates:
        BASE_DIR = FILE_PATH.parents[1]
    else:
        BASE_DIR = _base_dir_candidates[0]

ML_DIR = BASE_DIR / "ml"

if MODEL_PATH is None:
    MODEL_PATH = ML_DIR / "model" / "catboost_sales_model.cbm"
if META_PATH is None:
    META_PATH = ML_DIR / "model" / "catboost_sales_meta.pkl"
if DATA_PATH is None:
    DATA_PATH = ML_DIR / "dataset.csv"


# ---------- ФУНКЦИИ ФИЧ ----------

def add_lags(group: pd.DataFrame, target_col: str = "sales_kg") -> pd.DataFrame:
    """Та же логика, что в train_model.py."""
    group = group.copy()

    # Лаги
    for lag in [1, 2, 3, 4, 5, 6, 7, 14, 28]:
        group[f"lag_{lag}"] = group[target_col].shift(lag)

    # Скользящие средние
    group["rolling_7_mean"] = group[target_col].shift(1).rolling(window=7).mean()
    group["rolling_14_mean"] = group[target_col].shift(1).rolling(window=14).mean()
    group["rolling_30_mean"] = group[target_col].shift(1).rolling(window=30).mean()
    group["rolling_60_mean"] = group[target_col].shift(1).rolling(window=60).mean()

    return group


# ---------- ЗАГРУЗКА МОДЕЛИ И ДАННЫХ ----------

def _prepare_full_df() -> pd.DataFrame:
    """
    Готовим df с sales_kg + календарные фичи + лаги,
    максимально повторяя train_model.py.
    """
    data = pd.read_csv(
        DATA_PATH,
        sep=";",
        decimal=",",
        encoding="utf-8",
    )

    data["Дата"] = pd.to_datetime(data["Дата"], format="%d.%m.%Y")
    data["Продажи в кг"] = data["Продажи в кг"].astype(float)

    df = (
        data
        .groupby(["Дата", "Город", "Товар"], as_index=False)["Продажи в кг"]
        .sum()
        .rename(columns={"Продажи в кг": "sales_kg"})
    )

    df["sales_kg"] = df["sales_kg"].clip(lower=0)

    df = df.sort_values(["Город", "Товар", "Дата"])

    df["dayofweek"] = df["Дата"].dt.weekday
    df["is_weekend"] = df["dayofweek"].isin([5, 6]).astype(int)
    df["day"] = df["Дата"].dt.day
    df["month"] = df["Дата"].dt.month
    df["year"] = df["Дата"].dt.year
    df["weekofyear"] = df["Дата"].dt.isocalendar().week.astype(int)

    df = df.groupby(["Город", "Товар"], group_keys=False).apply(add_lags)
    df = df.dropna().reset_index(drop=True)

    return df


# Загружаем модель и мета-информацию один раз
_model = CatBoostRegressor()
_model.load_model(str(MODEL_PATH))

_meta = joblib.load(META_PATH)
_feature_cols: list[str] = _meta["feature_cols"]
_cat_features: list[str] = _meta["cat_features"]

_full_df = _prepare_full_df()


# ---------- ВНУТРЕННИЙ ПРОГНОЗ ПО ДНЯМ ----------

def _choose_city_for_product(product_id: int) -> int:
    """
    Выбираем город для продукта: берём тот, где больше всего истории.
    Предполагаю, что Product.id == значению в колонке 'Товар'.
    Если это не так — нужно будет сделать маппинг.
    """
    subset = _full_df[_full_df["Товар"] == product_id]
    if subset.empty:
        raise ValueError("В датасете нет истории для этого product_id")

    city_id = int(subset["Город"].value_counts().idxmax())
    return city_id


def _forecast_daily_for_city_sku(
    city: int,
    sku: int,
    horizon_days: int,
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Делает автопрогноз на horizon_days по дням для заданного (город, товар).
    Возвращает (history_df, future_df).
    """
    history = _full_df[(_full_df["Город"] == city) & (_full_df["Товар"] == sku)].copy()
    history = history.sort_values("Дата").reset_index(drop=True)

    if history.empty:
        raise ValueError("Нет данных для такого сочетания город/товар")

    current_history = history.copy()
    future_rows = []

    lag_list = [1, 2, 3, 4, 5, 6, 7, 14, 28]
    rolling_windows = [7, 14, 30, 60]

    for _ in range(horizon_days):
        current_history = current_history.sort_values("Дата").reset_index(drop=True)
        temp = current_history[["Дата", "sales_kg"]].copy()

        last_date = temp["Дата"].iloc[-1]
        next_date = last_date + timedelta(days=1)

        row_feat: dict = {}

        # Лаги
        for lag in lag_list:
            col_name = f"lag_{lag}"
            if len(temp) >= lag:
                row_feat[col_name] = temp["sales_kg"].iloc[-lag]
            else:
                row_feat[col_name] = temp["sales_kg"].iloc[0]

        # Скользящие средние
        for window in rolling_windows:
            col_name = f"rolling_{window}_mean"
            if len(temp) >= window:
                row_feat[col_name] = temp["sales_kg"].rolling(window).mean().iloc[-1]
            else:
                row_feat[col_name] = temp["sales_kg"].mean()

        # Календарные признаки
        dow = next_date.weekday()
        row_feat.update(
            {
                "Дата": next_date,
                "Город": city,
                "Товар": sku,
                "sales_kg": np.nan,
                "dayofweek": dow,
                "is_weekend": int(dow in [5, 6]),
                "day": next_date.day,
                "month": next_date.month,
                "year": next_date.year,
                "weekofyear": next_date.isocalendar().week,
            }
        )

        row_df = pd.DataFrame([row_feat])
        pred = _model.predict(row_df[_feature_cols])[0]
        row_df["sales_kg"] = pred
        row_df["pred"] = pred

        future_rows.append(row_df.iloc[0])
        current_history = pd.concat([current_history, row_df], ignore_index=True)

    future_df = pd.DataFrame(future_rows)
    return history, future_df


def _aggregate_monthly(df: pd.DataFrame, value_col: str) -> pd.DataFrame:
    """Сумма по месяцам."""
    if df.empty:
        return df.copy()

    tmp = df.copy()
    tmp["month_start"] = tmp["Дата"].values.astype("datetime64[M]")
    monthly = (
        tmp.groupby("month_start")[value_col]
        .sum()
        .reset_index()
        .rename(columns={"month_start": "Дата"})
    )
    return monthly


# ---------- ПУБЛИЧНАЯ ФУНКЦИЯ ДЛЯ РОУТЕРА ----------

def get_forecast_for_product(
    product_id: int,
    period_months: int,
    history_months: int = 6,
) -> Tuple[List[DataPoint], List[DataPoint]]:
    """
    Возвращает:
      - historical_data: список DataPoint по месяцам (история)
      - forecast_data:   список DataPoint по месяцам (прогноз)
    """
    if period_months <= 0:
        raise ValueError("period_months должен быть > 0")

    city_id = _choose_city_for_product(product_id)

    horizon_days = int(period_months * 30)
    history_df, future_df = _forecast_daily_for_city_sku(
        city=city_id,
        sku=product_id,
        horizon_days=horizon_days,
    )

    # История за последние history_months
    history_df = history_df.sort_values("Дата")
    historical_points: List[DataPoint] = []

    if not history_df.empty:
        max_date = history_df["Дата"].max()
        min_date = max_date - pd.DateOffset(months=history_months)
        history_tail = history_df[history_df["Дата"] >= min_date]
        history_monthly = _aggregate_monthly(history_tail, "sales_kg")

        historical_points = [
            DataPoint(
                date=row["Дата"].strftime("%Y-%m-%d"),
                value=float(row["sales_kg"]),
            )
            for _, row in history_monthly.iterrows()
        ]

    # Прогноз по месяцам
    future_monthly = _aggregate_monthly(future_df, "pred")
    future_monthly = future_monthly.sort_values("Дата").head(period_months)

    forecast_points = [
        DataPoint(
            date=row["Дата"].strftime("%Y-%m-%d"),
            value=float(row["pred"]),
        )
        for _, row in future_monthly.iterrows()
    ]

    return historical_points, forecast_points
