from datetime import date, datetime, timedelta

from app.database import get_db
from app.models.ar_card import ARCard
from app.models.login_history import LoginHistory
from app.models.scan_history import ScanHistory
from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import distinct, func
from sqlalchemy.orm import Session

router = APIRouter(prefix="/admin/dashboard", tags=["Admin Dashboard"])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_users = db.query(func.count(User.id)).scalar()
    
    one_day_ago = datetime.utcnow() - timedelta(days=1)
    active_users = db.query(func.count(distinct(LoginHistory.user_id))).filter(LoginHistory.created_at >= one_day_ago).scalar()
    
    total_qr_scans = db.query(func.count(ScanHistory.id)).scalar()
    unique_qr_scanners = db.query(func.count(distinct(ScanHistory.user_id))).scalar()
    
    now_utc = datetime.utcnow()
    now_jakarta = now_utc + timedelta(hours=7)
    today_start_jakarta = now_jakarta.replace(hour=0, minute=0, second=0, microsecond=0)
    today_start_utc = today_start_jakarta - timedelta(hours=7)

    todays_logins = db.query(func.count(LoginHistory.id)).filter(LoginHistory.created_at >= today_start_utc).scalar()
    todays_qr_scans = db.query(func.count(ScanHistory.id)).filter(ScanHistory.created_at >= today_start_utc).scalar()
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_qr_scans": total_qr_scans,
        "unique_qr_scanners": unique_qr_scanners,
        "todays_logins": todays_logins,
        "todays_qr_scans": todays_qr_scans
    }

@router.get("/logins")
def get_recent_logins(skip: int = 0, limit: int = 20, search: str = "", all: bool = False, db: Session = Depends(get_db)):
    query = db.query(LoginHistory, User).join(User, LoginHistory.user_id == User.id)
    if search:
        query = query.filter(User.name.ilike(f"%{search}%") | User.email.ilike(f"%{search}%"))
    
    total = query.count()
    if all:
        records = query.order_by(LoginHistory.created_at.desc()).all()
    else:
        records = query.order_by(LoginHistory.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for login_hist, user in records:
        result.append({
            "id": login_hist.id,
            "user_name": user.name,
            "email_address": user.email,
            "last_login_date": login_hist.created_at,
            "status": "Active"
        })
        
    return {
        "total": total,
        "data": result
    }

@router.get("/qr-scans")
def get_recent_qr_scans(skip: int = 0, limit: int = 20, search: str = "", date: str = "", all: bool = False, db: Session = Depends(get_db)):
    query = db.query(ScanHistory, User, ARCard).join(User, ScanHistory.user_id == User.id).join(ARCard, ScanHistory.card_id == ARCard.id)
    if search:
        query = query.filter(User.name.ilike(f"%{search}%") | ARCard.card_code.ilike(f"%{search}%") | ARCard.label.ilike(f"%{search}%"))
    if date:
        try:
            from sqlalchemy import Date, cast
            target_date = datetime.strptime(date, "%Y-%m-%d").date()
            query = query.filter(cast(ScanHistory.created_at, Date) == target_date)
        except ValueError:
            pass
            
    total = query.count()
    if all:
        records = query.order_by(ScanHistory.created_at.desc()).all()
    else:
        records = query.order_by(ScanHistory.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for scan_hist, user, card in records:
        result.append({
            "id": scan_hist.id,
            "user_name": user.name,
            "qr_code_scanned": card.card_code,
            "qr_code_label": card.label,
            "scan_date": scan_hist.created_at,
            "status": "Success"
        })
        
    return {
        "total": total,
        "data": result
    }

@router.get("/chart-data")
def get_chart_data(period: str = "daily", db: Session = Depends(get_db)):
    result = []
    today = datetime.utcnow().date()
    
    if period == "daily":
        for i in range(6, -1, -1):
            target_date = today - timedelta(days=i)
            start_dt = datetime.combine(target_date, datetime.min.time())
            end_dt = start_dt + timedelta(days=1)
            
            logins = db.query(func.count(LoginHistory.id)).filter(LoginHistory.created_at >= start_dt, LoginHistory.created_at < end_dt).scalar()
            avg_logins = db.query(func.count(distinct(LoginHistory.user_id))).filter(LoginHistory.created_at >= start_dt, LoginHistory.created_at < end_dt).scalar()
            scans = db.query(func.count(ScanHistory.id)).filter(ScanHistory.created_at >= start_dt, ScanHistory.created_at < end_dt).scalar()
            
            result.append({
                "date": target_date.strftime("%b %d"),
                "logins": logins,
                "avg": avg_logins,
                "scans": scans
            })
    elif period == "weekly":
        for i in range(3, -1, -1):
            start_dt = datetime.combine(today - timedelta(days=today.weekday() + 7*i), datetime.min.time())
            end_dt = start_dt + timedelta(days=7)
            
            logins = db.query(func.count(LoginHistory.id)).filter(LoginHistory.created_at >= start_dt, LoginHistory.created_at < end_dt).scalar()
            avg_logins = db.query(func.count(distinct(LoginHistory.user_id))).filter(LoginHistory.created_at >= start_dt, LoginHistory.created_at < end_dt).scalar()
            scans = db.query(func.count(ScanHistory.id)).filter(ScanHistory.created_at >= start_dt, ScanHistory.created_at < end_dt).scalar()
            
            result.append({
                "date": f"Week {start_dt.isocalendar()[1]}",
                "logins": logins,
                "avg": avg_logins,
                "scans": scans
            })
    elif period == "monthly":
        for i in range(5, -1, -1):
            month = today.month - i
            year = today.year
            if month <= 0:
                month += 12
                year -= 1
            
            start_dt = datetime(year, month, 1)
            next_month = month + 1 if month < 12 else 1
            next_year = year if month < 12 else year + 1
            end_dt = datetime(next_year, next_month, 1)
            
            logins = db.query(func.count(LoginHistory.id)).filter(LoginHistory.created_at >= start_dt, LoginHistory.created_at < end_dt).scalar()
            avg_logins = db.query(func.count(distinct(LoginHistory.user_id))).filter(LoginHistory.created_at >= start_dt, LoginHistory.created_at < end_dt).scalar()
            scans = db.query(func.count(ScanHistory.id)).filter(ScanHistory.created_at >= start_dt, ScanHistory.created_at < end_dt).scalar()
            
            result.append({
                "date": start_dt.strftime("%b"),
                "logins": logins,
                "avg": avg_logins,
                "scans": scans
            })
            
    return result
