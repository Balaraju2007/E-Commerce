from pydantic import BaseModel
from pydantic.networks import EmailStr

# class ItemBase(BaseModel):
#     name: str
#     description: str
#     price: int

# class ItemCreate(ItemBase):
#     pass

# class Item(ItemBase):
#     id: int

#     class Config:
#         orm_mode = True


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    
class UserResponse(BaseModel):
    user_id: int
    name: str
    email: str

    class Config:
        from_attributes = True
        
    

