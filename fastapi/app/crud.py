from sqlalchemy.orm import Session
from .models import *
from .schemas import *
import bcrypt
from passlib.context import CryptContext


pwd_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_new_user(db, request):
    hashed_password = pwd_cxt.hash(request.password)
    db_user = User(name=request.name, email=request.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return  db_user


def get_users(db: Session):
    return db.query(User).all()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()