from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

DATABASE_URL = os.getenv('DATABASE_URL') or 'mysql+pymysql://user:password@localhost/db_name'

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()
Base = declarative_base()

# Dependência para obter a sessão do banco de dados

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
