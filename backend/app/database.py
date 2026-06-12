from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Load environment variables dari .env
load_dotenv()

# Ambil URL database langsung dari .env
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL belum di-set di file .env")

# Buat engine SQLAlchemy
engine = create_engine(DATABASE_URL, echo=False)

# Buat session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base untuk semua model ORM
Base = declarative_base()


# Dependency untuk FastAPI — ambil session per request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
