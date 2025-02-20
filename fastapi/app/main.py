from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, models, schemas, database
from .database import init_db
import logging
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import bcrypt

app = FastAPI()



# logging.basicConfig(level=logging.ERROR)

# @app.exception_handler(Exception)
# async def global_exception_handler(request, exc):
#     logging.error(f"Unhandled Error: {exc}")
#     return JSONResponse(status_code=500, content={"detail": "Something went wrong!"})

# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request, exc):
#     return JSONResponse(status_code=422, content={"detail": exc.errors()})



# Initialize the database tables on startup
@app.on_event("startup")
def on_startup():
    init_db()



# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_email(db=db, email=user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return crud.create_user(db=db, user=user)
    # return schemas.UserResponse(user_id=user.id, name=user.name, email=user.email)



@app.get("/users/", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return [schemas.UserResponse(user_id=user.id, name=user.name, email=user.email) for user in users]




@app.delete("/users/{user_id}", response_model=dict)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_users_by_id(user_id : int,db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    return schemas.UserResponse(user_id=user.id, name=user.name, email=user.email)


# Function to verify password
def verify_password(plain_password, hashed_password):
    hashed_password = str(hashed_password)
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# Login API
@app.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.name == username).first()
    if user and verify_password(password, models.User.hashed_password):
        return {"message": "Login successful", "user": {"id": user.id, "username": user.username}}
    raise HTTPException(status_code=400, detail="Invalid credentials")