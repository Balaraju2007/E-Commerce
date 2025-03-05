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
        
    cart = db.query(models.Cart).filter(models.Cart.user_id == user_id).first()
    if not cart or not cart.cart_items:
        return {'message' : 'your cart is empty nothing to order'}
    
    order = models.Order(user_id = user_id, order_date = datetime.utcnow())
    db.add(order)
    db.commit()
    db.refresh(order)
    
    for cart_item in cart.cart_items:
        order_item = models.OrderItem(order_id = order.order_id, book_id = cart_item.book_id, quantity = cart_item.quantity)
        db.add(order_item)
    
    db.commit()
    
    return {
        "message": "Order placed successfully (Cart Order)",
        "order_id": order.order_id
    }
    
@router.get('/{user_id}')
def get_orders(user_id: int, db: Session = Depends(get_db)):
    """ Get all orders placed by a user"""
    
    orders = db.query(models.Order).filter(models.Order.user_id == user_id).all()
    if not orders:
        return {"message": "No orders found"}

    return [
        {
            "order_id": order.order_id,
            "order_date": order.order_date
        }
        for order in orders
    ]
    
@router.get('details/{order_id}')
def ger_order_details(order_id: int, db: Session = Depends(get_db)):
    """ return details for given order id"""
    
    order = db.query(models.Order).filter(models.Order.order_id == order_id).first()
    
    if not order:
        return {'message': 'order not found'}
    
    order_items = db.query(models.OrderItem).filter(models.OrderItem.order_id == order_id).all()
    
    return {
        "order_id": order.order_id,
        "order_date": order.order_date,
        "books": [
            {
                "book_id": item.book_id,
                "quantity": item.quantity
            }
            for item in order_items
        ]
    }
    

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """✅ Deletes an order and its items"""
    
    order = db.query(models.Order).filter(models.Order.order_id == order_id).first()
    if not order:
        return{'message': "Order not found"}

    db.delete(order)
    db.commit()
    
    return {"message": f"Order {order_id} deleted successfully"}