from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from datetime import datetime
import os, csv

router = APIRouter()

CSV_DIR= os.path.join(os.path.dirname(__file__), "../csv_files")
NOTIFICATIONS_CSV = os.path.join(CSV_DIR, "Notifications.csv")

def export_notifications_to_csv(db: Session):
    notifications = db.query(models.Notifications).all()
    
    with open(NOTIFICATIONS_CSV, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['user_id', 'message', 'created_at'])
        
        for n in notifications:
            writer.writerow([n.user_id, n.message, n.created_at])
            
    print('notification.csv updated')
    
    

def create_notification(db: Session , user_id: int, message:str):
    notification = models.Notifications(user_id=user_id, message=message, created_at=datetime.utcnow())
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    export_notifications_to_csv(db)
    
    
@router.get("/{user_id}")
def get_notifications(user_id: int, db: Session = Depends(get_db)):
    notifications = db.query(models.Notifications).filter(models.Notifications.user_id == user_id).all()
    
    return [
        {
            "id": n.id,
            "message": n.message,
            "is_read": n.is_read,
            "created_at": n.created_at
        }
        for n in notifications
    ]
    
    
@router.put('/{notification_id}/read')
def mark_notification_as_read(notification_id:int, db:Session = Depends(get_db)):
    notification = db.query(models.Notifications).filter(models.Notifications.id == notification_id).first()
    
    if not notification:
        return {'message' : 'no notifification is there'}
    
    notification.is_read = True
    db.commit()
    
    export_notifications_to_csv(db)
    
    return {'message': 'notification marked as read'}

