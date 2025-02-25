from fastapi import FastAPI, Depends, HTTPException, Form, Request,UploadFile, File
from sqlalchemy.orm import Session
from . import crud, models, schemas, database
from .database import init_db
import logging
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import bcrypt
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi.staticfiles import StaticFiles
from .routers import users, auth
from .database import get_db
app = FastAPI()

# Allow cross-origin requests from your React app running on port 5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods like GET, POST, etc.
    allow_headers=["*"],  # Allow all headers
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
UPLOAD_FOLDER = "uploads/profile_images"

# Ensure the directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

pwd_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Initialize the database tables on startup
@app.on_event("startup")
def on_startup():
    init_db()



app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(auth.router, prefix="/login", tags=["auth"])  # Auth router for login


# # Login API
# @app.post("/login/")
# def login(data:schemas.LoginRequest, db: Session = Depends(get_db)):
#     user = db.query(models.User).filter(models.User.name == data.username).first()
#     if user and pwd_cxt.verify(data.password, user.hashed_password):
#         return {"message": "Login successful", "user": {"id": user.id, "username": user.name}}
#     raise HTTPException(status_code=400, detail="Invalid credentials")