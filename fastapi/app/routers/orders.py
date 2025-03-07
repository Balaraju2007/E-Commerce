from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from .. import models
from ..database import get_db
from .books import get_book_by_id
from .cart import get_cart_items
import os, csv


router = APIRouter()

CSV_DIR= os.path.join(os.path.dirname(__file__), "../csv_files")
ORDERS_CSV = os.path.join(CSV_DIR, "Orders.csv")
ORDER_ITEMS_CSV = os.path.join(CSV_DIR, "OrderItems.csv")

def export_orders_to_csv(db: Session):
    orders = db.query(models.Order).all()
    
    with open(ORDERS_CSV, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['order_id', 'user_id', 'order_date'])
        
        for order in orders:
            writer.writerow([order.order_id, order.user_id, order.order_date])
        
    print('order data exported to csv')
    
def export_order_items_to_csv(db: Session):
    order_items = db.query(models.OrderItem).all()
    
    with open(ORDER_ITEMS_CSV, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["id", "order_id", "book_id", "quantity"])
        
        # ✅ Write each order item
        for order_item in order_items:
            writer.writerow([order_item.id, order_item.order_id, order_item.book_id, order_item.quantity])
            
    print('order items data exported to csv')


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
        
        if book.quantity < quantity:
            return {'message' : 'book quantity not available'}
        
        order = models.Order(user_id = user_id, order_date = datetime.utcnow())
        db.add(order)
        db.commit()
        db.refresh(order)
        
        order_item = models.OrderItem(order_id = order.order_id, book_id = book_id , quantity = quantity )
        db.add(order_item)
        db.commit()
        
        book.quantity -= quantity
        db.commit()
        
        export_orders_to_csv(db)
        export_order_items_to_csv(db)
        
        return {
            'message': 'order placed successfully (Direct order)',
            'order_id': order.order_id,
            'book_id': book_id,
            'quantity': quantity,
            'book_details': get_book_by_id(book_id, db)
        }
        
    cart = db.query(models.Cart).filter(models.Cart.user_id == user_id).first()
    if not cart or not cart.cart_items:
        return {'message' : 'your cart is empty nothing to order'}
    
    order = models.Order(user_id = user_id, order_date = datetime.utcnow())
    db.add(order)
    db.commit()
    db.refresh(order)
    
    for cart_item in cart.cart_items:
        book = db.query(models.Book).filter(models.Book.book_id == cart_item.book_id).first()
        if not book:
            continue
        
        if book.quantity < cart_item.quantity:
            raise HTTPException(status_code=400, detail="Book quantity not available")
        
        order_item = models.OrderItem(order_id = order.order_id, book_id = cart_item.book_id, quantity = cart_item.quantity)
        db.add(order_item)
        
        book.quantity -= cart_item.quantity
    
    db.commit()
    
    export_orders_to_csv(db)
    export_order_items_to_csv(db)
    
    return {
        "message": "Order placed successfully (Cart Order)",
        "order_id": order.order_id,
        "cart_details": get_cart_items(user_id, db)
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
    
@router.get('/details/{order_id}')
def ger_order_details(order_id: int, db: Session = Depends(get_db)):
    """ return details for given order id"""
    
    order = db.query(models.Order).filter(models.Order.order_id == order_id).first()
    
    if not order:
        return {'message': 'order not found'}
    
    order_items = db.query(models.OrderItem).filter(models.OrderItem.order_id == order_id).all()
    total_price = 0
    order_details = []
    
    for order_item in order_items:
        book_data = get_book_by_id(order_item.book_id, db)
        
        if not book_data:
            raise HTTPException(status_code=404, detail=f"Book with ID {order_item.book_id} not found")
        
        total_price += order_item.quantity * book_data["price"]  # ✅ Ensure book_data exists

        order_details.append({
            "quantity": order_item.quantity,
            "book_details": {k: v for k, v in book_data.items() if k not in ["book_id", "quantity"]}
        })
        
    return {
        "order_id": order.order_id,
        "order_date": order.order_date,
        "total_price": total_price,  # ✅ Total Price is added outside book details
        "order_items": order_details
    }
    

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """ Deletes an order and its items"""
    
    order = db.query(models.Order).filter(models.Order.order_id == order_id).first()
    if not order:
        return{'message': "Order not found"}

    db.delete(order)
    db.commit()
    
    export_orders_to_csv(db)
    export_order_items_to_csv(db)
    
    return {"message": f"Order {order_id} deleted successfully"}