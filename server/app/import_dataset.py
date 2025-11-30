# server/app/import_dataset.py
from pathlib import Path

import pandas as pd
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine
from app import models, crud


# --- Пути ---

FILE_PATH = Path(__file__).resolve()

# Пытаемся угадать корень проекта в двух сценариях:
# 1) Локально: <PROJECT_ROOT>/server/app/import_dataset.py  -> parents[2] == <PROJECT_ROOT>
# 2) В Docker: /app/app/import_dataset.py                   -> parents[1] == /app
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
DATASET_PATH = None

for base in _base_dir_candidates:
    candidate = base / "ml" / "dataset.csv"
    if candidate.exists():
        BASE_DIR = base
        DATASET_PATH = candidate
        break

# Если ничего не нашли, используем первый кандидат и дадим упасть с понятным путём
if BASE_DIR is None:
    if not _base_dir_candidates:
        # на всякий случай: корень рядом с app/
        BASE_DIR = FILE_PATH.parents[1]
    else:
        BASE_DIR = _base_dir_candidates[0]
    DATASET_PATH = BASE_DIR / "ml" / "dataset.csv"


def load_csv() -> pd.DataFrame:
    # Читаем датасет так же, как в train_model.py
    df = pd.read_csv(
        DATASET_PATH,
        sep=";",        # разделитель — точка с запятой
        decimal=",",    # десятичный разделитель — запятая
        encoding="utf-8",
    )

    # Приводим типы
    df["Дата"] = pd.to_datetime(df["Дата"], format="%d.%m.%Y")
    df["Продажи в кг"] = df["Продажи в кг"].astype(float)

    return df


def import_sales_records(session: Session, df: pd.DataFrame):
    records = []
    for _, row in df.iterrows():
        rec = models.SalesRecord(
            date=row["Дата"].date(),
            category_id=int(row["Категория товара"]),
            product_code=int(row["Товар"]),
            city_id=int(row["Город"]),
            customer_group_id=int(row["Группа клиентов"]),
            store_format_id=int(row["Формат точки"]),
            sales_kg=float(row["Продажи в кг"]),
        )
        records.append(rec)

    session.bulk_save_objects(records)
    session.commit()
    print(f"Импортировано {len(records)} строк в sales_records")


def import_products_from_dataset(session: Session, df: pd.DataFrame):
    """
    Создаём записи в таблице products для всех уникальных кодов `Товар`.
    Предполагаем, что Product.id == коду из датасета.
    Если продукт с таким id уже есть — не трогаем.
    """
    # Берём по одному примеру категории на каждый код товара
    products_df = df.groupby("Товар", as_index=False)["Категория товара"].first()

    created = 0
    for _, row in products_df.iterrows():
        product_id = int(row["Товар"])
        category_id = int(row["Категория товара"])

        # есть ли уже такой продукт в БД?
        existing = session.query(models.Product).filter(models.Product.id == product_id).first()
        if existing:
            continue

        # создаём новый
        name = f"Товар {product_id}"
        new_product = models.Product(
            id=product_id,             # важный момент: id совпадает с кодом "Товар"
            name=name,
            category=str(category_id),
        )
        session.add(new_product)
        created += 1

    session.commit()
    print(f"Создано {created} продуктов на основе датасета")


def main():
    print(f"Читаем датасет из: {DATASET_PATH}")
    df = load_csv()

    print("Создаём таблицы (если ещё не созданы)...")
    models.Base.metadata.create_all(bind=engine)

    print("Подключаемся к базе...")
    db = SessionLocal()
    try:
        import_sales_records(db, df)
        import_products_from_dataset(db, df)
    finally:
        db.close()


if __name__ == "__main__":
    main()
