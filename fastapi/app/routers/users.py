import os
from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from .. import schemas, models, crud
from ..database import get_db
from ..tokens import get_current_user
import csv

router = APIRouter()

CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), "../csv_files/Users.csv")

BASE_URL = "http://127.0.0.1:8000"

def write_all_users_to_csv(db: Session):
    """Rewrites the entire CSV file with current DB users (for updates & deletes)."""
    users = db.query(models.User).all()

    with open(CSV_FILE_PATH, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)

        # Write header
        writer.writerow(["user_id", "email", "full_name", "contact_number", "profile_image", "password"])

        #  Write all users
        for user in users:
            writer.writerow([user.user_id, user.email, user.full_name, user.contact_number, user.profile_image, 'asdf'])

    print(" CSV file updated with all users!")

@router.post("/", response_model=schemas.UserResponse)
async def create_user(
    db: Session = Depends(get_db),
    email: str = Form(...),
    password: str = Form(...),
    full_name: str = Form(...),
    contact_number: str = Form(...),
    profile_image: UploadFile = File(...)
):
    # Check if user already exists
    existing_user = crud.get_user_by_email(db=db, email=email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Read the uploaded image (Optional: Save it to disk or cloud storage)
    image_data = await profile_image.read()  # Reads the file content

    # Create user object
    user_data = schemas.UserCreate(email=email, password=password, full_name=full_name, contact_number=contact_number)

    # Create new user
    new_user = crud.create_new_user(db, user_data, image_data)  # Pass image to function

    # Append user to CSV file
    write_all_users_to_csv(db)
    
    return {
        "user_id": new_user.user_id,
        "email": new_user.email,
        "full_name": new_user.full_name,
        "contact_number": new_user.contact_number,
        "profile_image": f"{BASE_URL}/uploads/profiles/{new_user.profile_image}"
    }


@router.get("/", response_model=list[schemas.UserResponse])
def get_users(
    db: Session = Depends(get_db),
    # user: dict = Depends(get_current_user)
    ):
    users = db.query(models.User).all()
    return [
        schemas.UserResponse(
            user_id=user.user_id,
            full_name=user.full_name,
            email=user.email,
            contact_number=user.contact_number,
            profile_image = f"{BASE_URL}/{user.profile_image}"
            ) 
        for user in users
    ]


@router.delete("/{id}", response_model=dict)
def delete_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    
    # Update CSV file
    write_all_users_to_csv(db)
    
    return {"message": "User deleted successfully"}


@router.get("/{id}", response_model=schemas.UserResponse)
def get_users_by_id(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return  {
            'user_id':user.user_id,
            'full_name':user.full_name,
            'email':user.email,
            'contact_number':user.contact_number,
            'profile_image' : f"{BASE_URL}/{user.profile_image}"
            }
    