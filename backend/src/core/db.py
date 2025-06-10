from sqlmodel import create_engine
from ..consts import DATABASE_URL
from typing import Generator
from sqlmodel import Session


engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=2, pool_recycle=299, pool_pre_ping=True)

def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session