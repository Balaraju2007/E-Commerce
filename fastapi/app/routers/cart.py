from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database
from ..database import get_db

router = APIRouter()



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
    
    return {"message": "Item added to cart successfully"}

        
    


@router.get("/{user_id}")
def get_cart_items(
    user_id: int,
    db: Session = Depends(get_db),
):
    cart = db.query(models.Cart).filter(models.Cart.user_id == user_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    cart_items = db.query(models.CartItem).filter(models.CartItem.cart_id == cart.cart_id).all()
    return cart_items
   

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
    return {"message": "Item removed from cart successfully"}
    
    
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
    return {"message": "Cart item updated successfully"}
    
@router.delete('/clear/{user_id}')
def clear_cart(user_id:int, db: Session = Depends(get_db)):
    cart = db.query(models.Cart).filter(models.Cart.user_id == user_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    cart_items = db.query(models.CartItem).filter(models.CartItem.cart_id == cart.cart_id).all()
    for item in cart_items:
        db.delete(item)
    db.commit()
    return {"message": "Cart cleared successfully"}