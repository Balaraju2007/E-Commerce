from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database
from ..database import get_db

router = APIRouter()



@router.post("/")
def add_to_cart( db: Session = Depends(get_db)):
    pass


@router.get("/")
def get_cart_items(db: Session = Depends(get_db)):
   pass

@router.delete("/{item_id}")
def remove_from_cart( db: Session = Depends(get_db)):
    pass

@router.put("/{item_id}")
def update_cart_item( db: Session = Depends(get_db)):
    pass