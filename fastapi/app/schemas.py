from pydantic import BaseModel, EmailStr
from typing import Optional

# ✅ Request model
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    profile_image: Optional[bytes] = None
    contact_number: str | None = None
    class Config:
        orm_mode = True

# ✅ Response model
class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    profile_image: Optional[str] = None
    contact_number: str | None = None
    
    class Config:
        orm_mode = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None