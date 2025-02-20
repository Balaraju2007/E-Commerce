from sqlalchemy.orm import Session
from .models import *
from .schemas import *
import bcrypt

# def create_item(db: Session, item: schemas.ItemCreate):
#     db_item = Item(name=item.name, description=item.description, price=item.price)
#     db.add(db_item)
#     db.commit()
#     db.refresh(db_item)s
#     return db_item

# def get_items(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(Item).offset(skip).limit(limit).all()


# def get_item_by_number(db:Session, item_id: int ):
#     return db.query(Item).filter(Item.id == item_id).first()



def create_user(db: Session, user: UserCreate):
    hashed_password = user.password
    db_user = User(name=user.name, email=user.email, hashed_password=hashed_password)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return UserResponse(user_id=db_user.id, name=db_user.name, email=db_user.email)

def get_users(db: Session):
    return db.query(User).all()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()