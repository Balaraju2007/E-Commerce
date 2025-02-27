from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app import models, schemas
from app.database import get_db
from ..tokens import create_access_token
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException, status

BASE_URL = "http://127.0.0.1:8000"
router = APIRouter()
pwd_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Login API
@router.post("/")
def login(data:schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    # if user and pwd_cxt.verify(data.password, user.password):
    #     return {"message": "Login successful", "user": {"id": user.id, "username": user.full_name, "email": user.email, "profile_image": f"{BASE_URL}/{user.profile_image}"}}
    # raise HTTPException(status_code=400, detail="Invalid credentials")
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not pwd_cxt.verify(data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=30))
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.user_id,
            "username": user.full_name,
            "email": user.email,
            "profile_image": f"{BASE_URL}/{user.profile_image}"
            }
        }
    
    



