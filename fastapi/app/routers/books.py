from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from .. import schemas, models, crud
from ..database import get_db
from ..tokens import get_current_user
import os

router = APIRouter()

UPLOAD_DIR = "uploads/books"
BASE_URL = "http://127.0.0.1:8000"

@router.get('/', response_model=list[dict])  # ✅ Remove response_model if using custom dict
def get_books(db: Session = Depends(get_db)):
    books = (
        db.query(
            models.Book,
            models.User.full_name.label("seller_name"),
            models.Author.author_name.label("author_name"),
            models.Genre.genre_name.label("genre_name"),
            models.Publisher.publisher_name.label("publisher_name"),
        )
        .join(models.User, models.User.user_id == models.Book.seller_id)
        .join(models.Author, models.Author.author_id == models.Book.author_id)
        .join(models.Genre, models.Genre.genre_id == models.Book.genre_id)
        .join(models.Publisher, models.Publisher.publisher_id == models.Book.publisher_id)
        .all()
    )

    return [
        {
            "book_id": book.Book.book_id,
            "book_name": book.Book.book_name,
            "seller_name": book.seller_name,
            "author_name": book.author_name,
            "price": book.Book.price,
            "quantity": book.Book.quantity,
            "genre_name": book.genre_name,
            "publisher_name": book.publisher_name,
            "picture": f"{BASE_URL}/uploads/books/{book.Book.picture}"
        }
        for book in books
    ]


@router.post('/')
async def create_book(
    db: Session = Depends(get_db),
    book_name: str = Form(...),
    seller_name: str = Form(...),
    quantity: int = Form(...),
    author_name: str = Form(...),
    publisher_name: str = Form(...),
    genre_name: str = Form(...),
    price: int = Form(...),
    picture: UploadFile = File(...)
):
    author = db.query(models.Author).filter(models.Author.author_name == author_name).first()
    if not author:
        author = models.Author(author_name = author_name)
        db.add(author)
        db.commit()
        db.refresh(author)
    
    publisher = db.query(models.Publisher).filter(models.Publisher.publisher_name == publisher_name).first()
    if not publisher:
        publisher = models.Publisher(publisher_name = publisher_name)
        db.add(publisher)
        db.commit()
        db.refresh(publisher)

    genre = db.query(models.Genre).filter(models.Genre.genre_name == genre_name).first()
    if not genre:
        genre = models.Genre(genre_name = genre_name)
        db.add(genre)
        db.commit()
        db.refresh(genre)

    seller = db.query(models.User).filter(models.User.full_name == seller_name).first()
    if not seller:
        return {'message': 'invalid user adding books'}
    seller_id = seller.user_id

    picture_filename = f"{book_name.replace(' ', '_')}.jpg"
    picture_path = os.path.join(UPLOAD_DIR, picture_filename)

    with open(picture_path, "wb") as buffer:
        buffer.write(await picture.read())

    # Create the new book entry
    new_book = models.Book(
        book_name=book_name,
        seller_id=seller_id,
        author_id=author.author_id,
        publisher_id=publisher.publisher_id,
        genre_id=genre.genre_id,
        price=price,
        quantity=quantity,
        picture=picture_filename,
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)

    return schemas.BookResponse(
        book_id=new_book.book_id,
        book_name=new_book.book_name,
        seller_id=new_book.seller_id,
        author_id=new_book.author_id,
        price=new_book.price,
        quantity=new_book.quantity,
        genre_id=new_book.genre_id,
        publisher_id=new_book.publisher_id,
        picture=f"{BASE_URL}/uploads/books/{new_book.picture}"
    )
    
    

