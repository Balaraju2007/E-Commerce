from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from .. import schemas, models, crud
from ..database import get_db
from ..tokens import get_current_user

router = APIRouter()

BASE_URL = "http://127.0.0.1:8000"

@router.get('/', response_model=list[schemas.BookResponse])
def get_books(
    db: Session = Depends(get_db)
    ):
    books = db.query(models.Book).all()
    return [
        schemas.BookResponse(
            book_id = book.book_id,
            book_name = book.book_name,
            seller_name = book.seller_name,
            author_id = book.author_id,
            price = book.price,
            quantity = book.quantity,
            genre_id = book.genre_id,
            publisher_id = book.publisher_id,
            picture = f"{BASE_URL}/uploads/books/{book.picture}"
            ) 
        for book in books
    ]

# @router.post('/', response_model=schemas.BookCreate)
# async def create_book(
#     db: Session = Depends(get_db),
#     email: str = Form(...),
#     password: str = Form(...),
#     full_name: str = Form(...),
#     contact_number: str = Form(...),
#     profile_image: UploadFile = File(...)
# )