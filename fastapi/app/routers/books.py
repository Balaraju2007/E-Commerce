from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from .. import schemas, models, crud
from ..database import get_db
from ..tokens import get_current_user
import os
import csv

router = APIRouter()

UPLOAD_DIR = "uploads/books"
BASE_URL = "http://127.0.0.1:8000"


CSV_DIR= os.path.join(os.path.dirname(__file__), "../csv_files")
BOOKS_CSV = os.path.join(CSV_DIR, "Books.csv")
AUTHORS_CSV = os.path.join(CSV_DIR, "Authors.csv")
GENRES_CSV = os.path.join(CSV_DIR, "Genres.csv")
PUBLISHERS_CSV = os.path.join(CSV_DIR, "Publishers.csv")


def write_all_books_to_csv(db: Session):
    """Rewrites the entire CSV file with current DB users (for updates & deletes)."""
    # Update Books CSV
    books = db.query(models.Book).all()
    with open(BOOKS_CSV, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["book_id", "book_name", "seller_id", "author_id", "price", "quantity", "genre_id", "publisher_id", "picture"])
        for book in books:
            writer.writerow([
                book.book_id, book.book_name, book.seller_id, book.author_id,
                book.price, book.quantity, book.genre_id, book.publisher_id, book.picture
            ])

    #  Update Authors CSV
    authors = db.query(models.Author).all()
    with open(AUTHORS_CSV, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["author_id", "author_name"])
        for author in authors:
            writer.writerow([author.author_id, author.author_name])

    # Update Genres CSV
    genres = db.query(models.Genre).all()
    with open(GENRES_CSV, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["genre_id", "genre_name"])
        for genre in genres:
            writer.writerow([genre.genre_id, genre.genre_name])

    # Update Publishers CSV
    publishers = db.query(models.Publisher).all()
    with open(PUBLISHERS_CSV, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["publisher_id", "publisher_name"])
        for publisher in publishers:
            writer.writerow([publisher.publisher_id, publisher.publisher_name])

    print("✅ All CSV files updated!")



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


@router.get('/{user_id}', response_model = list[dict])
def get_books_for_user(user_id: int, db : Session = Depends(get_db)):
    books = (
        db.query(
            models.Book,
            models.User.full_name.label("seller_name"),
            models.Author.author_name.label("author_name"),
            models.Genre.genre_name.label("genre_name"),
            models.Publisher.publisher_name.label("publisher_name"),
        )
        .filter(models.Book.seller_id != user_id)
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
    
    write_all_books_to_csv(db)

    return {
        "book_id":new_book.book_id,
        "book_name":new_book.book_name,
        "seller_name":seller_name,
        "author_name":author.author_name,
        "price":new_book.price,
        "quantity":new_book.quantity,
        "genre_name":genre.genre_name,
        "publisher_name":publisher.publisher_name,
        "picture":f"{BASE_URL}/uploads/books/{new_book.picture}"
    }
    
    

@router.delete('/{book_id}', response_model=dict)
def delete_book(book_id:int, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.book_id == book_id).first()
    
    if not book:
        return {'message' : 'no book there in my db with such id'}
    
    db.delete(book)
    db.commit()
    
    write_all_books_to_csv(db)
    
    return { 'message' : 'book deleted successfully'}


@router.get('/{book_id}', response_model=dict)
def get_book_by_id( book_id:int, db: Session = Depends(get_db)):
    book = (
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
        .filter(models.Book.book_id == book_id)
        .first()
    )
    
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    return {
        "book_id": book.Book.book_id,
        "book_name": book.Book.book_name,
        "seller_name": book.seller_name,
        "author_name": book.author_name,
        "price": book.Book.price,
        "quantity": book.Book.quantity,
        "genre_name": book.genre_name,
        "publisher_name": book.publisher_name,
        "picture": f"{BASE_URL}/uploads/books/{book.Book.picture}" if book.Book.picture else None
    }
    




@router.put('/{book_id}', response_model=dict)
async def update_book(
    book_id:int,
    db: Session = Depends(get_db),
    book_name: str = Form(...),
    seller_name: str = Form(...),
    quantity: str = Form(...),
    author_name: str = Form(...),
    publisher_name: str = Form(...),
    genre_name: str = Form(...),
    price: float = Form(...),
    picture: UploadFile = File(...)
):
    book = db.query(models.Book).filter(models.Book.book_id == book_id).first()
    
    if not book:
        return {'message' : 'no book there in my db with such id'}
    
    author = db.query(models.Author).filter(models.Author.author_name == author_name).first()
    if not author:
        author = models.Author(author_name = author_name)
        db.add(author)
        db.commit()
        db.refresh(author)
    author_id = author.author_id
    
    publisher = db.query(models.Publisher).filter(models.Publisher.publisher_name == publisher_name).first()
    if not publisher:
        publisher = models.Publisher(publisher_name = publisher_name)
        db.add(publisher)
        db.commit()
        db.refresh(publisher)
    publisher_id = publisher.publisher_id

    genre = db.query(models.Genre).filter(models.Genre.genre_name == genre_name).first()
    if not genre:
        genre = models.Genre(genre_name = genre_name)
        db.add(genre)
        db.commit()
        db.refresh(genre)
    genre_id = genre.genre_id

    seller = db.query(models.User).filter(models.User.full_name == seller_name).first()
    if not seller:
        return {'message': 'invalid user adding books'}
    seller_id = seller.user_id
    if picture:
        picture_filename = f"{book_name.replace(' ', '_')}.jpg"
        picture_path = os.path.join(UPLOAD_DIR, picture_filename)

        with open(picture_path, "wb") as buffer:
            buffer.write(await picture.read())
        
        book.picture = picture_filename

    # Create the new book entry
    
    book.book_name=book_name
    book.seller_id=seller_id
    book.author_id=author_id
    book.publisher_id=publisher_id
    book.genre_id=genre_id
    book.price=float(price)
    book.quantity=int(quantity)

    
    db.commit()
    db.refresh(book)
    
    write_all_books_to_csv(db)

    return {
        "book_id":book.book_id,
        "book_name":book.book_name,
        "seller_name":seller_name,
        "author_name":author.author_name,
        "price":book.price,
        "quantity":book.quantity,
        "genre_name":genre.genre_name,
        "publisher_name":publisher.publisher_name,
        "picture":f"{BASE_URL}/uploads/books/{book.picture}" if book.picture else None
    }
