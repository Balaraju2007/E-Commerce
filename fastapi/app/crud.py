from sqlalchemy.orm import Session
from .models import *
from .schemas import *
import bcrypt
from passlib.context import CryptContext
import uuid
import os

pwd_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_cxt.hash(password)

def create_new_user(db: Session, user_data, image_data: bytes = None):
    # Save image to a file (or use a cloud storage)
    image_dir = 'uploads/profile_images'
    os.makedirs(image_dir, exist_ok=True)
    
    #sanitized name
    sanitized_name = user_data.full_name.replace(" ", "_")  # Replace spaces with underscores
    image_filename = f"{image_dir}/{sanitized_name}.jpg"  

    
    with open(image_filename, "wb") as f:
        f.write(image_data)

    # Create user object
    new_user = User(
        email=user_data.email,
        password=hash_password(user_data.password),  # Ensure this is hashed
        full_name=user_data.full_name,
        contact_number=user_data.contact_number,
        profile_image=image_filename  # Store the file path
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def get_users(db: Session):
    return db.query(User).all()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()