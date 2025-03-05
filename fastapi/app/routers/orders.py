from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from .. import models
from ..database import get_db


router = APIRouter()

@router.post('/')
def place_order(
    user_id: int,
    book_id: int = None,
    quantity: int = None,
    db : Session = Depends(get_db)
):
    if book_id:
        book = db.query(models.Book).filter(models.Book.book_id == book_id).first()
        if not book:
            return {'message' : 'book not found'}
        
        order = models.Order(user_id = user_id, order_date = datetime.utcnow())
        db.add(order)
        db.commit()
        db.refresh(order)
        
        order_item = models.OrderItem(order_id = order.order_id, book_id = book_id , quantity = quantity )
        db.add(order_item)
        db.commit()
        
        return {
            'message': 'order placed successfully (Direct order)',
            'order_id': order.order_id,
            'book_id': book_id,
            'quantity': quantity
        }