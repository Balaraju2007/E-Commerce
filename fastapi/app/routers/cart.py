from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database
from ..database import get_db
from .books import get_book_by_id
from ..routers.users import get_users_by_id
import logging
import os, csv

router = APIRouter()

CSV_DIR= os.path.join(os.path.dirname(__file__), "../csv_files")
CART_CSV = os.path.join(CSV_DIR, "Cart.csv")
CART_ITEMS_CSV = os.path.join(CSV_DIR, "CartItems.csv")


def export_cart_to_csv(db: Session):
    """Exports Cart table data to a CSV file."""
    carts = db.query(models.Cart).all()

    with open(CART_CSV, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["cart_id", "user_id"])  # ✅ Header

        for cart in carts:
            writer.writerow([cart.cart_id, cart.user_id])
    
    print("✅ Cart data exported to CSV")


# ✅ Function to export CartItems table data to CSV
def export_cart_items_to_csv(db: Session):
    """Exports CartItems table data to a CSV file."""
    cart_items = db.query(models.CartItem).all()
    
    with open(CART_ITEMS_CSV, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["cart_id","book_id", "quantity"])  # ✅ Header

        for item in cart_items:
            writer.writerow([item.cart_id, item.book_id, item.quantity ])
    
    print("✅ Cart Items exported to CSV")



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
    
    export_cart_to_csv(db)
    export_cart_items_to_csv(db)
    
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
    
    export_cart_to_csv(db)
    export_cart_items_to_csv(db)
    
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
    
    export_cart_to_csv(db)
    export_cart_items_to_csv(db)
    
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
    
    export_cart_to_csv(db)
    export_cart_items_to_csv(db)
    
    return {
            "message": f"Cart cleared successfully for user {user_id}",
            "user_details": user_details
        }
