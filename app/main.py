from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine, SessionLocal
from app.models import user, ar_card, scan_history, redeem_item, redeem_history

from app.routers import auth_route, redeem_item_route, user_route, redeem_history_route, scan_route
from app.routers.ar_card_route import router as ar_card_router

from app.seeder import seed_admin

import os

app = FastAPI(title="AR Membership API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# create tables
Base.metadata.create_all(bind=engine)

# folders
os.makedirs("uploads", exist_ok=True)
os.makedirs("qr_codes", exist_ok=True)

# static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/qr_codes", StaticFiles(directory="qr_codes"), name="qr_codes")

# routers
app.include_router(auth_route.router)
app.include_router(user_route.router)
app.include_router(redeem_item_route.router)
app.include_router(redeem_history_route.router)
app.include_router(ar_card_router)
app.include_router(scan_route.router)

# startup
@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    seed_admin(db)
    db.close()

@app.get("/")
def root():
    return {"message": "Database connected and tables created!"}