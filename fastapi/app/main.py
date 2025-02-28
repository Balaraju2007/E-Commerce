from fastapi import FastAPI
from .database import init_db
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi.staticfiles import StaticFiles
from .routers import users, auth
from datetime import datetime
import pytz

app = FastAPI()

@app.middleware("http")
async def add_ist_time_header(request, call_next):
    response = await call_next(request)
    
    # Convert UTC time to IST
    ist = pytz.timezone("Asia/Kolkata")
    ist_time = datetime.now(ist).strftime("%a, %d %b %Y %H:%M:%S IST")
    
    del response.headers["date"]
        
    # Add the IST timestamp to response headers
    response.headers["Date"] = ist_time
    return response


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

@app.get("/")
def read_root():
    return {"message": "Welcome to the Bookstore API"}

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(auth.router, prefix="/login", tags=["auth"])  # Auth router for login

