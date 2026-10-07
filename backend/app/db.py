import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# SQLite works out of the box. For PostgreSQL use e.g.
# DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/zameenmauka
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./zameenmauka.db")
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
