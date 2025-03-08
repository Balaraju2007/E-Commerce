import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get `app/` directory path
DB_PATH = os.path.join(BASE_DIR, "../test.db")  # Move up one level to `fastapi/`
DATABASE_URL = f"sqlite:///{DB_PATH}"  # Absolute path to avoid incorrect creation


# DATABASE_URL = "sqlite:///./test.db"  # SQLite database file (local file-based)

# Create an engine that stores data in the SQLite file.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Base class for class definitions of models
Base = declarative_base()

# Session maker to handle interactions with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    # Create all tables from the models that inherit from Base
    Base.metadata.create_all(bind=engine)
    

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()