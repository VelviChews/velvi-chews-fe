from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine, SessionLocal
from .models import user, ar_card, scan_history, redeem_item, redeem_history
from app.routers import auth_route, redeem_item_route, user_route, redeem_history_route, scan_route
from app.routers.ar_card_route import router as ar_card_router
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="AR Membership API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ganti dengan ["http://localhost:5173"] kalau pakai Vite/React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all tables
Base.metadata.create_all(bind=engine)

from app.seeder import seed_admin

# Buat folder upload kalau belum ada
os.makedirs("uploads", exist_ok=True)

# Serve folder uploads secara publik
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Serve QR code images
os.makedirs("qr_codes", exist_ok=True)
app.mount("/qr_codes", StaticFiles(directory="qr_codes"), name="qr_codes")

# Register router
app.include_router(auth_route.router)
app.include_router(user_route.router)
app.include_router(redeem_item_route.router)
app.include_router(redeem_history_route.router)
app.include_router(ar_card_router)
app.include_router(scan_route.router)

# Seeder otomatis saat startup
@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    seed_admin(db)
    db.close()

@app.get("/")
def root():
    return {"message": "Database connected and tables created!"}
