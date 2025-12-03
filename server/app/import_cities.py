from pathlib import Path

import pandas as pd
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine
from app import models


# --- Пути ---

FILE_PATH = Path(__file__).resolve()

# Пытаемся угадать корень проекта в двух сценариях:
# 1) Локально: <PROJECT_ROOT>/server/app/import_cities.py  -> parents[2] == <PROJECT_ROOT>
# 2) В Docker: /app/app/import_cities.py                   -> parents[1] == /app
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
    """
    Читаем исходный датасет так же, как в других местах:
    - разделитель ;
    - десятичная запятая.
    """
    df = pd.read_csv(
        DATASET_PATH,
        sep=";",
        decimal=",",
        encoding="utf-8",
    )
    return df


def import_cities_from_dataset(session: Session, df: pd.DataFrame):
    """
    Создаём записи в таблице cities для всех уникальных кодов 'Город'
    из датасета.

    Принимаем соглашение:
      City.id   == значению столбца 'Город'
      City.name == строка вида 'Город {id}' (заглушка, можно потом переименовать)
    """
    if "Город" not in df.columns:
        raise ValueError("В датасете нет колонки 'Город'")

    city_codes = df["Город"].dropna().unique()
    created = 0

    for code in city_codes:
        city_id = int(code)

        # Уже есть такой город?
        existing = (
            session.query(models.City)
            .filter(models.City.id == city_id)
            .first()
        )
        if existing:
            continue

        city = models.City(
            id=city_id,
            name=f"Город {city_id}",
        )
        session.add(city)
        created += 1

    session.commit()
    print(f"Создано {created} городов на основе датасета")


def main():
    print(f"Читаем датасет из: {DATASET_PATH}")
    df = load_csv()

    print("Создаём таблицы (если ещё не созданы)...")
    models.Base.metadata.create_all(bind=engine)

    print("Подключаемся к базе...")
    db = SessionLocal()
    try:
        import_cities_from_dataset(db, df)
    finally:
        db.close()


if __name__ == "__main__":
    main()
