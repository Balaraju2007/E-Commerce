from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, models, schemas, database
from .database import init_db
import logging
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import bcrypt
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow cross-origin requests from your React app running on port 5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods like GET, POST, etc.
    allow_headers=["*"],  # Allow all headers
)

pwd_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")





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


@app.post("/user/", response_model=schemas.UserResponse)
def create_user(request:schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_email(db=db, email=request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_new_user(db, request)



@app.get("/users/", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return [schemas.UserResponse(id=user.id, name=user.name, email=user.email, hashed_password = user.hashed_password) for user in users]




@app.delete("/users/{id}", response_model=dict)
def delete_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@app.get("/users/{id}", response_model=schemas.UserResponse)
def get_users_by_id(id : int,db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    return schemas.UserResponse(id=user.id, name=user.name, email=user.email)




# Login API
@app.post("/login")
def login(data:schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.name == data.username).first()
    if user and pwd_cxt.verify(data.password, user.hashed_password):
        return {"message": "Login successful", "user": {"id": user.id, "username": user.name}}
    raise HTTPException(status_code=400, detail="Invalid credentials")