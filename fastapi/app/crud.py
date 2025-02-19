from sqlalchemy.orm import Session
from . import models, schemas

def create_item(db: Session, item: schemas.ItemCreate):
    db_item = models.Item(name=item.name, description=item.description, price=item.price)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Item).offset(skip).limit(limit).all()


def get_item_by_number(db:Session, item_id: int ):
    return db.query(models.Item).filter(models.Item.id == item_id).first()