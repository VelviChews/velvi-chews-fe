import traceback
from app.database import SessionLocal
from app.models.scan_history import ScanHistory

db = SessionLocal()
try:
    records = db.query(ScanHistory).all()
    for r in records:
        print(r.id, r.created_at, type(r.created_at))
except Exception as e:
    traceback.print_exc()
finally:
    db.close()
