from pathlib import Path

import pandas as pd
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine
from app import models


# /PREDICT-APP (корень проекта)
BASE_DIR = Path(__file__).resolve().parents[2]
# /PREDICT-APP/ml/dataset.csv
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
