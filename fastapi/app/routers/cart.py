from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database
from ..database import get_db
from .books import get_book_by_id
from ..routers.users import get_users_by_id
import logging

router = APIRouter()

@router.get("/{user_id}")
def get_cart_items(
    user_id: int,
    db: Session = Depends(get_db),
):
    
    user_details = get_users_by_id(user_id, db)
    
    cart = db.query(models.Cart).filter(models.Cart.user_id == user_id).first()
    if not cart:
         return {
            "user": user_details,
            "message": "Cart is empty",
            "cart_items": []
        }
    
    cart_items = (
        db.query(models.CartItem, models.Book.book_name, models.Book.price)
        .join(models.Book, models.CartItem.book_id == models.Book.book_id)
        .filter(models.CartItem.cart_id == cart.cart_id)
        .all()
    )
    return {
        'message': f'Cart items for {user_id} user successfully',
        "user_details": user_details,
        "cart_items": [
            {
                "cart_item_id": item.CartItem.id,
                "book_id": item.CartItem.book_id,
                "book_name": item.book_name,
                "price": item.price,
                "quantity": item.CartItem.quantity,
                "total_price": item.CartItem.quantity * item.price,
                'book_detals': get_book_by_id(item.CartItem.book_id, db)
            }
            for item in cart_items
        ]
    }

@router.post("/")
def add_to_cart( 
    db: Session = Depends(get_db),
    user_id: int = Form(...),
    book_id: int = Form(...),
    quantity: int = Form(...)            
):
    book = db.query(models.Book).filter(models.Book.book_id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    cart = db.query(models.Cart).filter(models.Cart.user_id == user_id).first()
    
    if not cart:
        cart = models.Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
        
    cart_item = db.query(models.CartItem).filter(models.CartItem.book_id == book_id, models.CartItem.cart_id == cart.cart_id).first()
   
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = models.CartItem(cart_id=cart.cart_id, book_id=book_id, quantity=quantity)
        db.add(cart_item)
        
    db.commit()
    db.refresh(cart_item)
    
    book_details = get_book_by_id(book_id, db)
    cart_details = get_cart_items(user_id, db)
    
    return {
        "message": "Item added to cart successfully",
        "cart": cart_details,
        "book": book_details
    }

        
    



   

@router.delete("/{user_id}/{item_id}")
def remove_from_cart(user_id:int, item_id:int,db: Session = Depends(get_db)):
    
    cart = db.query(models.Cart).filter(models.Cart.user_id == user_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    
    cart_item = db.query(models.CartItem).filter(models.CartItem.id == item_id, models.CartItem.cart_id == cart.cart_id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(cart_item)
    db.commit()
    
    cart_details = get_cart_items(user_id, db)
    return {
        "message": "Item removed from cart successfully",
        "cart": cart_details
        }
    
    
@router.put("/{user_id}/{item_id}")
def update_cart_item(user_id:int, item_id:int, quantity:int, db: Session = Depends(get_db)):
    cart = db.query(models.Cart).filter(models.Cart.user_id == user_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    cart_item = db.query(models.CartItem).filter(models.CartItem.id == item_id, models.CartItem.cart_id == cart.cart_id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    cart_item.quantity = quantity
    db.commit()
    db.refresh(cart_item)
    
    cart_details = get_cart_items(user_id, db)
    return {
        "message": "Cart item updated successfully",
        "cart": cart_details
        }
    
    
    
    
@router.delete("/clear/{user_id}/")
async def clear_cart(user_id: int, db: Session = Depends(get_db)):
    """✅ Deletes the user's cart and all cart items"""
    
    user_details = get_users_by_id(user_id, db)
    cart = db.query(models.Cart).filter(models.Cart.user_id == user_id).first()
    
    if not cart:
        return {
                "message": "Cart is already empty",
                "user_details": user_details
               }
    
    db.delete(cart)  # ✅ Automatically deletes all cart items due to cascade delete
    db.commit()
    
    return {
            "message": f"Cart cleared successfully for user {user_id}",
            "user_details": user_details
        }
