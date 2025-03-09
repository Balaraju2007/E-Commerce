from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_
from .. import schemas, models, crud
from ..database import get_db
from ..tokens import get_current_user

router = APIRouter()


@router.get("")
async def search_books(query: str, db: Session = Depends(get_db)):
    """Search for books by book name, author name, or genre."""
    
    books = (
        db.query(models.Book)
        .join(models.Author, models.Book.author_id == models.Author.author_id)
        .join(models.Genre, models.Book.genre_id == models.Genre.genre_id)
        .filter(
            or_(
                models.Book.book_name.ilike(f"%{query}%"),
                models.Author.author_name.ilike(f"%{query}%"),
                models.Genre.genre_name.ilike(f"%{query}%"),
            )
        )
        .all()
    )
    
    if not books:
        raise HTTPException(status_code=404, detail="No books found matching the query")

    return [
        {
            "book_id": book.book_id,
            "book_name": book.book_name,
            "author_name": book.author.author_name,
            "genre_name": book.genre.genre_name,
            "price": book.price,
            "quantity": book.quantity,
            "picture": f"http://127.0.0.1:8000/uploads/books/{book.picture}" if book.picture else None
        }
        for book in books
    ]
