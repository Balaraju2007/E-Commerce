from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

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
    user_id: int
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
    

# Book Schemas
class BookBase(BaseModel):
    book_id:int
    book_name: str
    seller_id: int
    author_id: int
    price: float
    quantity: int
    genre_id: int
    publisher_id: int
    picture: Optional[str] = None

class BookCreate(BookBase):
    pass

class BookResponse(BaseModel):
    book_id: int
    book_name: str
    seller_name: str
    seller_id: int   # Add this
    author_name: str
    author_id: int   # Add this
    publisher_name: str
    publisher_id: int  # Add this
    genre_name: str
    genre_id: int    # Add this
    price: float
    quantity: int    # Add this
    picture: str

    class Config:
        from_attributes = True

# Genre Schema
class GenreResponse(BaseModel):
    genre_id: int
    genre_name: str

    class Config:
        from_attributes = True

# Author Schema
class AuthorResponse(BaseModel):
    author_id: int
    author_name: str

    class Config:
        from_attributes = True

# Publisher Schema
class PublisherResponse(BaseModel):
    publisher_id: int
    publisher_name: str

    class Config:
        from_attributes = True

# Order Schemas
class OrderItemBase(BaseModel):
    book_id: int
    quantity: int

class OrderBase(BaseModel):
    user_id: int
    order_date: datetime

class OrderCreate(OrderBase):
    order_items: List[OrderItemBase]

class OrderResponse(OrderBase):
    order_id: int
    order_items: List[OrderItemBase]

    class Config:
        from_attributes = True

# Cart Schemas
class CartItemBase(BaseModel):
    book_id: int
    quantity: int

class CartResponse(BaseModel):
    cart_id: int
    user_id: int
    cart_items: List[CartItemBase]

    class Config:
        from_attributes = True